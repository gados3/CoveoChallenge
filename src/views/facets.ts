import * as Backbone from 'backbone';
import * as _ from 'underscore';
import { FacetsCollection } from '../collections/facets';
import { SeachView } from './search';

let tpl = require('../templates/facets.html');

export class FacetsView extends Backbone.View<Backbone.Model> {

	private static template = _.template(tpl);

	private _facets: Map<string, FacetsCollection>;
	private activatedFacets: Map<string, string>;
	get facets(): Map<string, FacetsCollection> {
		return this._facets;
	}
	private parent: SeachView;
	private _events = {
		'change input[type="checkbox"][name="facet"]': 'facetToggled'
	};

	constructor(parent: SeachView, fields: any[], options?) {
		super($.extend(true, {
			el: '#facets-wrapper ul',
		}, options));
		this.parent = parent;
		this._facets = new Map();
		this.activatedFacets = new Map();
		fields.forEach((field) => {
			this.facets.set(field.name, new FacetsCollection(field.title));
		});
	}

	public render(groupByResults?: any[] | undefined) {
		this.$el.html('');
		if (groupByResults) {
			groupByResults.forEach((fieldGroup) => {
				let fc = this.facets.get('@' + fieldGroup.field);
				if (fc) {
					fc.reset(fieldGroup.values);
					this.$el.append(FacetsView.template({
						field: fieldGroup.field,
						models: fc.models,
						sectionTitle: fc.fieldName
					}));
				}
			});
			this.delegateEvents(this._events);
		}
		return this;
	}

	public getAdvencedQuery() {
		let query = {};
		if (this.activatedFacets.size > 0) {
			let terms = '';
			this.activatedFacets.forEach((value, field) => {
				terms += '@' + field + '=' + value + ' ';
			});
			query['aq'] = terms.slice(0, -1);
		}
		return query;
	}

	public facetToggled(e) {
		if (e.target.checked) {
			this.activatedFacets.set($(e.target).data('field'), $(e.target).data('query'));
		} else {
			this.activatedFacets.delete($(e.target).data('field'));
		}
		this.parent.render(this.getAdvencedQuery(), false);
	}
}
import * as Backbone from 'backbone';
import * as _ from 'underscore';
import { FacetsCollection } from '../collections/facets';
import { SeachView } from './search';
import { hashString } from '../utils/auth';

let tpl = require('../templates/facets.html');

export class FacetsView extends Backbone.View<Backbone.Model> {

	private static template = _.template(tpl);

	private _facets: Map<string, FacetsCollection>;
	private activatedFacets: Map<string, string[]>;
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
						sectionTitle: fc.fieldName,
						hashString
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
			this.activatedFacets.forEach((values, field) => {
				terms += '@' + field + '==("' + values.join('","') + '") ';
			});
			query['aq'] = terms.slice(0, -1);
		}
		return query;
	}

	public facetToggled(e) {
		let field = <string>$(e.target).data('field');
		let value = <string>$(e.target).data('query');
		if (e.target.checked) {
			if (this.activatedFacets.has(field)) {
				this.activatedFacets.set(field, [value].concat(<string[]>this.activatedFacets.get(field)));
			} else {
				this.activatedFacets.set(field, [value]);
			}
		} else {
			if (this.activatedFacets.has(field) && (<string[]>this.activatedFacets.get(field)).length > 1) {
				let index = (<string[]>this.activatedFacets.get(field)).indexOf(value);
				if (index > -1) {
					this.activatedFacets.set(field, (<string[]>this.activatedFacets.get(field)).splice(index, 1));
				}
			} else {
				this.activatedFacets.delete(field);
			}
		}
		this.parent.render({}, true);
	}

	public updateUI(groupByResults) {
		$('.facet-count').text('0');
		groupByResults.forEach((fieldGroup) => {
			let fc = this.facets.get('@' + fieldGroup.field);
			if (fc) {
				fc.reset(fieldGroup.values);
				_.each(fc.models, (model) => {
					$('#facet-count_' + fieldGroup.field + '_' + hashString(model.get('value'))).text(model.get('numberOfResults'));
				});
			}
		});
	}
}

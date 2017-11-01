import * as Backbone from 'backbone';
import * as _ from 'underscore';

let tpl = require('../templates/searchBar.html');

export class SearchBarView extends Backbone.View<Backbone.Model> {

	private static template = _.template(tpl);
	private searchCallback: (s: string) => any;
	private sortCallback: (s: string) => any;

	constructor(searchCallback, sortCallback, options?) {
		super($.extend(true, {
			el: '#search-bar-wrapper',
			events: {
				'change #search-bar': 'inputChange',
			}
		}, options));
		this.searchCallback = searchCallback;
		this.sortCallback = sortCallback;
	}

	public render() {
		this.$el.append(SearchBarView.template());
		$('#sortCriteria select').material_select(this.sortCriteriaChange.bind(this));
		return this;
	}

	public inputChange(e) {
		this.searchCallback(e.target.value);
	}

	public sortCriteriaChange() {
		this.sortCallback(<string>$('#sortCriteria select').val());
	}
}
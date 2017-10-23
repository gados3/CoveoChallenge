import * as Backbone from 'backbone';
import * as _ from 'underscore';

let tpl = require('../templates/searchBar.html');

export class SearchBarView extends Backbone.View<Backbone.Model> {

	private static template = _.template(tpl);
	private searchCallback: (s: string) => any;

	constructor(searchCallback, options?) {
		super($.extend(true, {
			el: '#search-bar-wrapper',
			events: {
				'change #search-bar': 'inputChange',
			}
		}, options));
		this.searchCallback = searchCallback;
	}

	public render() {
		this.$el.append(SearchBarView.template());
		return this;
	}

	public inputChange(e) {
		this.searchCallback(escape(e.target.value));
	}
}
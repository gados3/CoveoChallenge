import * as Backbone from 'backbone';
import * as _ from 'underscore';
import { CriteriasView } from './criterias';
import { SeachView } from './search';
import { SearchBarView } from './searchBar';

let tpl: string = require('../templates/app.html');

export class AppView extends Backbone.View<Backbone.Model> {

	private static template = _.template(tpl);

	constructor() {
		super({ el: '#app' });
	}

	public render(): AppView {
		this.$el.html(AppView.template());
		new CriteriasView().render();
		let searchResults = new SeachView();
		new SearchBarView(
			searchResults.userSearch.bind(searchResults),
			searchResults.changeSortCriteria.bind(searchResults)
		).render();
		searchResults.render();
		return this;
	}
}

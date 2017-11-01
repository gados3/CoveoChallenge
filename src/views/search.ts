import * as Backbone from 'backbone';
import * as $ from 'jquery';
import * as _ from 'underscore';
import { FacetsCollection } from '../collections/facets';
import { ResultCollection } from '../collections/result';
import { ResultView } from '../views/result';
import { FacetsView } from './facets';
import { PaginationView } from './pagination';
import { AppView } from './app';

let tpl: string = require('../templates/search.html');

export class SeachView extends Backbone.View<Backbone.Model> {

	private static template = _.template(tpl);
	public pageLength = 12;
	public currentPage = 0;

	private currentQuery = {};
	private facetsCollections: {};
	private facetsView: FacetsView;
	private pagination: PaginationView;
	private results = new ResultCollection();
	private App: AppView;

	constructor(App: AppView, options?) {
		super($.extend(true, {
			el: '#search-wrapper',
			events: {
				'click .qcorrection': 'searchDidYouMean',
				'click .results-count-wrapper>ul>a': 'changePageLength'
			}
		}, options));
		this.App = App;
		this.init();
	}

	public render(options?, dontOverrideFacets: boolean = false): SeachView {
		this.currentQuery = $.extend(true, this.currentQuery, options);
		this.results.fetch($.extend(true, {
			firstResult: this.pagination.currentPage * this.pageLength,
			numberOfResults: this.pageLength
		}, this.currentQuery, this.facetsView.getAdvencedQuery()))
			.done((response) => {
				this.$el.html(SeachView.template(response));
				if (dontOverrideFacets) {
					this.facetsView.updateUI(response.groupByResults);
				} else {
					this.facetsView.render(response.groupByResults);
				}
				this.pagination.render(response.totalCount / this.pageLength);
				this.results.each((model) => {
					let result = new ResultView({ model });
					$('#results-wrapper').append(result.render().el);
				});
				window.scrollTo(0, 0);
				this.App.initializeComponents();
			});
		return this;
	}

	public searchDidYouMean(e) {
		this.userSearch($(e.target).data('query'));
	}

	public userSearch(query: string) {
		this.render({
			enableDidYouMean: true,
			q: query
		});
	}

	public changePageLength(e) {
		this.pageLength = $(e.target).data('count');
		this.render();
	}

	public changeSortCriteria(criteria: string) {
		this.currentPage = 0;
		this.render({
			sortCriteria: criteria
		}, true);
	}

	private init() {
		this.pagination = new PaginationView(this);
		this.facetsView = new FacetsView(this, this.results.groupByFields);
	}
}

import * as Backbone from 'backbone';
import * as $ from 'jquery';
import * as _ from 'underscore';
import { ResultCollection } from '../collections/result';
import { ResultView } from '../views/result';
import { PaginationView } from './pagination';

let tpl: string = require('../templates/search.html');

export class SeachView extends Backbone.View<Backbone.Model> {

	private static template = _.template(tpl);
	public pageLength = 12;
	public currentPage = 0;

	private currentQuery = {};
	private results = new ResultCollection();
	private pagination: PaginationView;

	constructor(options?) {
		super($.extend(true, {
			el: '#search-wrapper',
			events: {
				'click .qcorrection': 'searchDidYouMean',
				'click .results-count-btn': 'changePageLength'
			}
		}, options));
		this.init();
	}


	public render(options?): SeachView {
		$.extend(true, this.currentQuery, options);
		this.results.search($.extend(true, {
			firstResult: this.pagination.currentPage * this.pageLength,
			numberOfResults: this.pageLength
		}, this.currentQuery))
			.done((response) => {
				this.pagination.render(response.totalCount / this.pageLength);
				this.$el.html(SeachView.template({
					data: response,
				}));
				this.results.each((model) => {
					let result = new ResultView({ model });
					this.$el.find('#results-wrapper').append(result.render().el);
				});
				window.scrollTo(0, 0);
			});
		return this;
	}

	public searchDidYouMean(e) {
		this.userSearch($(e.target).data('query'));
	}

	public progSearch(query: string) {
		this.render({
			aq: query
		});
	}

	public userSearch(query: string) {
		this.render({
			enableDidYouMean: true,
			q: escape(query)
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
		});
	}

	private init() {
		this.pagination = new PaginationView(this);
	}
}

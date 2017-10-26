import * as Backbone from 'backbone';
import * as $ from 'jquery';
import * as _ from 'underscore';
import { Query } from '../collections/query';
import { ResultView } from '../views/result';

let tpl: string = require('../templates/search.html');

export class SeachView extends Backbone.View<Backbone.Model> {

	private static template = _.template(tpl);
	public pageCount: number;
	public pageLength = 12;
	public currentPage = 0;
	private paginationLength = 5;
	private currentQuery = {};
	private query = new Query();

	constructor(options?) {
		super($.extend(true, {
			el: '#search-wrapper',
			events: {
				'click .next-page-btn': 'nextPage',
				'click .page-btn': 'goToPage',
				'click .prev-page-btn': 'previousPage',
				'click .qcorrection': 'searchDidYouMean',
				'click .results-count-btn': 'changePageLength'
			}
		}, options));
	}

	public render(options?): SeachView {
		$.extend(true, this.currentQuery, options);
		this.query.search($.extend(true, {
			firstResult: this.currentPage * this.pageLength,
			numberOfResults: this.pageLength
		}, this.currentQuery))
			.done((response) => {
				this.pageCount = response.totalCount / this.pageLength;
				this.$el.html(SeachView.template({
					currentPage: this.currentPage,
					data: response,
					pageCount: this.pageCount,
					paginationMax: Math.min(this.pageCount, this.currentPage + this.paginationLength),
					paginationMin: Math.max(0, this.currentPage - this.paginationLength)
				}));
				this.query.each((model) => {
					let result = new ResultView({ model });
					this.$el.find('#results').append(result.render().el);
				});
				window.scrollTo(0, 0);
				console.log($('.tooltipped'));
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

	public nextPage(e) {
		if (this.currentPage <= this.pageCount) {
			this.currentPage++;
			this.render();
		}
	}

	public previousPage(e) {
		if (this.currentPage > 0) {
			this.currentPage--;
			this.render();
		}
	}

	public goToPage(e) {
		this.currentPage = $(e.target).data('page-nbr');
		this.render();
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
}

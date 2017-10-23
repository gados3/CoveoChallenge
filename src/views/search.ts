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
	private query = new Query();
	private queryString = '';

	constructor(options?) {
		super($.extend(true, {
			el: '#search-wrapper',
			events: {
				'click .next-page-btn': 'nextPage',
				'click .page-btn': 'goToPage',
				'click .prev-page-btn': 'previousPage'
			}
		}, options));
	}

	public render(): SeachView {
		this.query.search({
			firstResult: this.currentPage * this.pageLength,
			numberOfResults: this.pageLength,
			q: this.queryString
		}).done((response) => {
			this.pageCount = response.totalCount / this.pageLength;
			this.$el.html(SeachView.template({
				currentPage: this.currentPage,
				pageCount: this.pageCount,
				paginationMax: Math.min(this.pageCount, this.currentPage + this.paginationLength),
				paginationMin: Math.max(0, this.currentPage - this.paginationLength),
			}));
			this.query.each((model) => {
				let result = new ResultView({ model });
				this.$el.find('#results').append(result.render().el);
			});
		});
		return this;
	}

	public search(query: string) {
		this.queryString = query;
		this.render();
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

	public changePageLength(pageLength: number) {
		this.pageLength = pageLength;
		this.render();
	}

}
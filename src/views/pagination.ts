import * as Backbone from 'backbone';
import * as $ from 'jquery';
import * as _ from 'underscore';
import { SeachView } from './search';

let tpl: string = require('../templates/pagination.html');

export class PaginationView extends Backbone.View<Backbone.Model> {

	private static template = _.template(tpl);
	private pageCount: number;
	private parent: SeachView;
	private paginationLength = 5;

	private _currentPage: number = 0;
	get currentPage(): number {
		return this._currentPage;
	}

	constructor(parent: SeachView, options?) {
		super($.extend(true, {
			el: '#pagination-wrapper',
			events: {
				'click .next-page-btn': 'nextPage',
				'click .page-btn': 'goToPage',
				'click .prev-page-btn': 'previousPage'
			}
		}, options));
	}

	public render(pageCount?: number | undefined) {
		if (pageCount) {
			this.pageCount = pageCount;
		}
		if (this.pageCount) {
			this.$el.html(PaginationView.template({
				currentPage: this._currentPage,
				pageCount: this.pageCount,
				paginationMax: Math.min(this.pageCount, this._currentPage + this.paginationLength),
				paginationMin: Math.max(0, this._currentPage - this.paginationLength)
			}));
		} else {
			this.$el.html('');
		}
		return this;
	}


	public nextPage(e) {
		if (this._currentPage <= this.pageCount) {
			this._currentPage++;
			this.parent.goToPage(this._currentPage);
		}
	}

	public previousPage(e) {
		if (this._currentPage > 0) {
			this._currentPage--;
			this.parent.goToPage(this._currentPage);
		}
	}

	public goToPage(e) {
		this._currentPage = $(e.target).data('page-nbr');
		this.parent.goToPage(this._currentPage);
	}

}
import * as Backbone from 'backbone';
import * as $ from 'jquery';
import { ResultModel } from '../models/result';
import * as Auth from '../utils/auth';

export class ResultCollection extends Backbone.Collection<ResultModel> {

	private static baseUrl = 'https://cloudplatform.coveo.com/rest/search';
	public model = ResultModel;

	public parse(response: any) {
		return response.results;
	}

	public search(params?): JQueryXHR {
		let query = (params) ? '?fieldsToExclude=["tppagebody","tpinventairetypenomsuccursalerawsplitgroup"]&' + $.param(params) : '';
		this.url = ResultCollection.baseUrl + query;
		return this.fetch({
			beforeSend: Auth.setHeader
		});
	}
}

import * as Backbone from 'backbone';
import * as $ from 'jquery';
import { ResultModel } from '../models/result';
import * as Auth from '../utils/auth';

export class QueryCollection extends Backbone.Collection<ResultModel> {

	private static baseUrl = 'https://cloudplatform.coveo.com/rest/search';
	public model = ResultModel;

	public parse(response: any) {
		return response.results;
	}

	public search(params?): JQueryXHR {
		let query = (params) ? '?' + $.param(params) : '';
		this.url = QueryCollection.baseUrl + query;
		return this.fetch({
			beforeSend: Auth.setHeader
		});
	}
}

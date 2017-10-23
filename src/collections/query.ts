import * as Backbone from 'backbone';
import { Result } from '../models/result';
import * as Auth from '../utils/auth';
import * as $ from 'jquery';

export class Query extends Backbone.Collection<Result> {

	private static baseUrl = 'https://cloudplatform.coveo.com/rest/search';
	public model = Result;

	public parse(response: any) {
		return response.results;
	}

	public search(params?): JQueryXHR {
		let query = (params) ? '?' + $.param(params) : '';
		this.url = Query.baseUrl + query;
		return this.fetch({
			beforeSend: Auth.setHeader
		});
	}
}

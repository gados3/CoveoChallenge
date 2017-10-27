import * as Backbone from 'backbone';
import * as $ from 'jquery';
import { CriteriaModel } from '../models/criteria';
import * as Auth from '../utils/auth';

export class CriteriaCollection extends Backbone.Collection<CriteriaModel> {

	private static baseUrl = 'https://cloudplatform.coveo.com/rest/search/values';
	private static maxValNbr = 25;
	public model = CriteriaModel;

	constructor(field: string) {
		super();
		this.url = CriteriaCollection.baseUrl + '?' + $.param({
			field,
			maximumNumberOfValues: CriteriaCollection.maxValNbr
			// sortCriteria: 'Score' creates a bad request even if specified in the official doc... is this a bug?
		});
	}

	public parse(response: any) {
		return response.values;
	}

	public fetch(options?: Backbone.CollectionFetchOptions | undefined) {
		return super.fetch({
			beforeSend: Auth.setHeader
		});
	}
}

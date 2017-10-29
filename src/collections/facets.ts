import * as Backbone from 'backbone';
import * as $ from 'jquery';
import { FacetModel } from '../models/facet';

export class FacetsCollection extends Backbone.Collection<FacetModel> {

	public static buildUrl(field: string) {
		return {
			field,
			maximumNumberOfValues: FacetsCollection.maxValNbr,
			sortCriteria: 'Score'
		};
	}

	private static maxValNbr = 10;
	public model = FacetModel;
	private _fieldName: string;
	get fieldName(): string {
		return this._fieldName;
	}

	constructor(fieldName: string, options?) {
		super(options);
		this._fieldName = fieldName;
	}
}

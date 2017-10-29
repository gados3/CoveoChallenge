import * as Backbone from 'backbone';
import * as $ from 'jquery';
import { ResultModel } from '../models/result';
import * as Auth from '../utils/auth';
import { FacetsCollection } from './facets';

export class ResultCollection extends Backbone.Collection<ResultModel> {

	private static baseUrl = 'https://cloudplatform.coveo.com/rest/search';
	public model = ResultModel;
	private excludedFields = [
		'@tpinventairetypenomsuccursalerawsplitgroup',
		'@tppagebody'
	];
	private _groupByFields = [
		{ title: 'Category', name: '@tpcategorie' },
		{ title: 'Price range', name: '@tpprixbande' },
		{ title: 'Region', name: '@tpregion' },
		{ title: 'Country', name: '@tppays' },
		{ title: 'Availability', name: '@tpdisponibilite' },
		{ title: 'Year', name: '@tpmillesime' },
		{ title: 'Size', name: '@tpformat' },
		{ title: 'Sub-region', name: '@tpsousregion' },
		{ title: 'Body', name: '@tpobservationsgustativescorps' },
		{ title: 'Texture', name: '@tpobservationsgustativestexture' },
		{ title: 'Aromas', name: '@tpobservationsolfactivesaromessplitgroup' },
		{ title: 'Acidity', name: '@tpobservationsgustativesacidite' },
		{ title: 'Tannins', name: '@tpobservationsgustativestannins' },
		{ title: 'Sweetness', name: '@tpobservationsgustativessucre' }
	];
	get groupByFields() {
		return this._groupByFields;
	}

	public parse(response: any) {
		return response.results;
	}

	public fetch(params?, options?: Backbone.CollectionFetchOptions | undefined): JQueryXHR {
		this.url = ResultCollection.baseUrl;
		return super.fetch($.extend(true, {
			beforeSend: Auth.setHeader,
			data: JSON.stringify($.extend(true, {
				fieldsToExclude: this.excludedFields,
				groupBy: this.groupByFields.map((field) => {
					return FacetsCollection.buildUrl(field.name);
				}),
			}, params)),
			dataType: 'json',
			type: 'POST'
		}, options));
	}
}

import * as Backbone from 'backbone';
import * as _ from 'underscore';
import { CriteriaCollection } from '../collections/criteria';

let tpl = require('../templates/criteria.html');

export class FacetView extends Backbone.View<Backbone.Model> {

	private static template = _.template(tpl);
	private fields = [
		'@tpcategorie',
		'@tpprixbande',
		'@tpregion',
		'@tppays',
		'@tpdisponibilite',
		'@tpmillesime',
		'@tpformat',
		'@tpsousregion',
		'@tpobservationsgustativescorps',
		'@tpobservationsgustativestexture',
		'@tpobservationsolfactivesaromessplitgroup',
		'@tpobservationsgustativesacidite',
		'@tpobservationsgustativestannins',
		'@tpobservationsgustativessucre'
	];
	private criterias: CriteriaCollection[] = [];

	constructor(options?) {
		super($.extend(true, { el: '#left-nav' }, options));
		this.fields.forEach((field) => {
			this.criterias.push(new CriteriaCollection(field));
		});
	}

	public render() {
		this.$el.html('');
		this.criterias.forEach((CriteriaListing) => {
			CriteriaListing.fetch().done((response) => {
				console.log(CriteriaListing.models);
				// this.$el.append(CriteriasView.template(CriteriaListing.models));
			});
		});
		return this;
	}
}
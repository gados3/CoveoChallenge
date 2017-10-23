import * as Backbone from 'backbone';
import * as _ from 'underscore';

let tpl = require('../templates/criterias.html');

export class CriteriasView extends Backbone.View<Backbone.Model> {

	private static template = _.template(tpl);

	constructor(options?) {
		super($.extend(true, { el: '#left-nav' }, options));
	}

	public render() {
		this.$el.html(CriteriasView.template());
		return this;
	}
}
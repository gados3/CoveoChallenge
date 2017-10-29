import * as Backbone from 'backbone';
import * as $ from 'jquery';
import * as _ from 'underscore';
import { ResultModel } from '../models/result';

let tpl: string = require('../templates/results.html');

export class ResultView extends Backbone.View<ResultModel> {

	private static template = _.template(tpl);

	constructor(options?) {
		super($.extend(true, {
			className: 'col s12 m6 l4 xl3 result',
		}, options));
	}

	public render() {
		this.$el.html(ResultView.template(this.model.attributes));
		return this;
	}

}
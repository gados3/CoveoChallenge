import * as Backbone from 'backbone';
import * as $ from 'jquery';
import * as _ from 'underscore';
import { Query } from '../collections/query';
import { Result } from '../models/result';

let tpl: string = require('../templates/result.html');

export class ResultView extends Backbone.View<Result> {

	private static template = _.template(tpl);

	constructor(options?) {
		super($.extend(true, {
			className: 'card horizontal small',
		}, options));
	}

	public render() {
		this.$el.html(ResultView.template(this.model.attributes));
		return this;
	}

}
import * as _ from "underscore";
import * as Backbone from "backbone";

let tpl: string = require('../templates/app.html');

export class AppView extends Backbone.View<Backbone.Model> {

    el = '#app'
    template = _.template(tpl);

    constructor() {
        super({ el: '#app' });
    }

    render(): AppView {
        this.$el.html(this.template());
        return this;
    }
}
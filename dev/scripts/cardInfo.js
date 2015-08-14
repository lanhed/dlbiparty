define([
	'jquery',
	'hasher',
	'handlebars', 
	'text!templates/cardInfo.hbs',
	'dataService'],

function(
	$,
	Hasher,
	Handlebars,
	template,
	dataService
){
	return {

		init: function(elem,data) {
			this.elem = elem;
			this.data = options.data;
			this.render();
		},
		render: function() {
			var compile = Handlebars.compile(template);
			var data = {};//dataService.getCities();
			var html = compile(data);
			
			this.elem.html(html);

			this.bindEvents();
		},
		destroy: function() {

		},
		bindEvents: function() {

		}
	}
});
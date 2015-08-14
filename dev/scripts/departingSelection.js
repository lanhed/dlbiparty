define([
	'jquery',
	'hasher',
	'handlebars', 
	'text!templates/departingSelection.hbs',
	'DataService'],
function(
	$,
	Hasher,
	Handlebars,
	template,
	DataService
) {

	return {
		init: function(elem, options) {
			this.elem = elem;
			this.data = options.data;
			this.render();
		},
		render: function() {
			var compile = Handlebars.compile(template);
			var data = DataService().getCities();
			var html = compile(data);
			//var html = compile({});
			
			this.elem.html(html);

			this.bindEvents();
		},
		destroy: function() {

		},
		bindEvents:function(){
			$(this.elem).find('select.city').on('change', function() {
				DataService().setDepartingCity(this.value);
				Hasher.setHash('pre');
			});
		}
	}
});
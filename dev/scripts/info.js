define([
	'jquery',
	'handlebars',
	'navbar',
	'text!templates/info.hbs',
	
	'DataService'],
function(
	$,
	Handlebars,
	navbar,
	template,

	DataService
){
	return {
		init:function(elem, id){
			this.elem = elem;
			this.id = id;
			if (!navbar.isInitiated()) {
				navbar.init($('.navbar-wrapper'));
			}
			var title = "Information";
			navbar.setPageHeader(title.toUpperCase());

			this.render();
		},
		render:function(){
			var compile = Handlebars.compile(template);
			var html = compile(DataService().getPerson());
			this.elem.html(html);
		},
		destroy: function() {}
	};
});
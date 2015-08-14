define([
	'jquery',
	'handlebars',
	'text!templates/desktopMsg.hbs'],
function(
	$,
	Handlebars,
	template
){
	return {
		init: function(elem) {
			this.elem = elem;
			this.render();
		},
		render: function(){
			var compile = Handlebars.compile(template);
			var html = compile({});
			this.elem.html(html);
		}
	}
});
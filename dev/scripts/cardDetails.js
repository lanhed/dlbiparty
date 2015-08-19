define([
	'jquery',
	'handlebars',
	'text!templates/cardDetails.hbs',
	
	'DataService'],
function(
	$,
	Handlebars,
	template,

	DataService
){
	return {
		init:function(elem, id, data){
			this.elem = elem;
			this.id = id;
			this.data = data;

			this.render();
		},
		render:function(){
			var compile = Handlebars.compile(template);

			// needs to be fixed, only return the detail data
			//var data = DataService().getCardDataFromId(this.id);
			
			var html = compile(this.data);
			this.elem.html(html);

			/*if (this.data.map) {
				var mapCanvas = $('<div id="map-canvas"></div>');
				var content = this.elem.find('.content');
				this.mapData = this.data.map;
				content.append(mapCanvas);
			}*/
		},
		destroy: function() {
			
		}
	};
});
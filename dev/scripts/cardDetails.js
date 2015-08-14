define([
	'jquery',
	//'google',
	'handlebars',
	'text!templates/cardDetails.hbs',
	
	'DataService'],
function(
	$,
	//Google,
	Handlebars,
	template,

	DataService
){
	return {
		init:function(elem, id){
			this.elem = elem;
			this.id = id;

			this.render();
		},
		render:function(){
			var compile = Handlebars.compile(template);
			var data = DataService().getCardDataFromId(this.id);
			var html = compile(data);
			this.elem.html(html);

			if (data.info.details.map) {
				var mapCanvas = $('<div id="map-canvas"></div>');
				var content = this.elem.find('.content');
				this.mapData = data.info.details.map;
				content.append(mapCanvas);

				//console.log(google);
				//google.maps.event.addDomListener(window, 'load', $.proxy(this.initializeMaps,this));
			}
		},
		destroy: function() {
			
		}
		/*,
		initializeMaps: function() {
			var map = new google.maps.Map(document.getElementById('map-canvas'), {
				zoom: this.mapData.zoom,
				center: { lat: this.mapData.lat, lng: this.mapData.lng }
			});
		}*/
	};
});
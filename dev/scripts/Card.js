define([
	'jquery',
	'handlebars',
	'hasher',
	'cardInfo',
	'text!templates/cardTravel.hbs',
	'text!templates/cardHotel.hbs'],
function(
	$,
	Handlebars,
	Hasher,
	cardInfo,
	cardTravelTemplate,
	hotelTemplate
){
	function Card(elem) {
		this.elem = elem;
	}

	Card.prototype.render = function(data) {
		var html = null
			d = data;

		this.id = d.id;
		this.elem.attr('id', this.id);
		
		if (d.type === 'travel') {
			var compileTravelCard = Handlebars.compile(cardTravelTemplate);
			html = compileTravelCard(d);
		} else if (d.type === 'hotel') {
			var compileHotelCard = Handlebars.compile(hotelTemplate);
			html = compileHotelCard(d);
		}

		this.elem.html(html);
		this.bindEvents(d);
	};

	Card.prototype.destroy = function() {
		this.unbindEvents();
		this.elem.remove();
	};

	Card.prototype.bindEvents = function(data) {
		if (data.info.details) {
			this.elem.find('.details').on('click', $.proxy(this.detailsClickHandler,this));
		}
	};

	Card.prototype.unbindEvents = function() {
		if (data.info.details) {
			this.elem.find('.details').off('click', $.proxy(this.detailsClickHandler,this));
		}
		this.elem.remove();
	};

	Card.prototype.detailsClickHandler = function(event) {
		Hasher.setHash('details/'+this.id);
	};

	return Card;

});
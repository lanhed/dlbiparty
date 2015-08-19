define([
	'jquery',
	'handlebars',
	'hasher',
	'cardInfo',
	'CardManager',
	'text!templates/cardTravel.hbs',
	'text!templates/cardCheckin.hbs',
	'text!templates/cardHotel.hbs',
	'text!templates/cardEvent.hbs'],
function(
	$,
	Handlebars,
	Hasher,
	cardInfo,
	CardManager,
	cardTravelTemplate,
	cardCheckinTemplate,
	hotelTemplate,
	eventTemplate
){
	function Card(elem,lifespanData) {
		this.elem = elem;
		this.lifespanData = lifespanData;
		this.interval = null;
	}

	Card.prototype.render = function(data) {
		var html = null
			d = data;

		this.id = d.id;
		this.elem.attr('id', this.id);
		
		var compileCard = null;
		if (d.type === 'travel') {
			compileCard = Handlebars.compile(cardTravelTemplate);
		} else if (d.type === 'checkin') {
			compileCard = Handlebars.compile(cardCheckinTemplate);
		} else if (d.type === 'hotel') {
			compileCard = Handlebars.compile(hotelTemplate);
		} else if (d.type === 'event') {
			compileCard = Handlebars.compile(eventTemplate);
		}
		html = compileCard(d);

		this.elem.html(html);
		this.bindEvents(d);
	};

	Card.prototype.activateCard = function() {
		var $cardElem = this.elem.find('.card');
		$cardElem.addClass('active');
		$cardElem.prepend('<div class="now">Next up:</div>');
	};

	Card.prototype.destroy = function() {
		this.unbindEvents();
		this.elem.remove();
	};

	Card.prototype.bindEvents = function(data) {
		var hasDetail = false;
		if (data.info.depart || data.info.arrive) {
			if (data.info.depart.details || data.info.arrive.details) {
				hasDetail = true;
			}
		} else {
			if (data.info.card.details) {
				hasDetail = true;
			}
		}
		if (hasDetail) {
			this.elem.find('.details').on('click', $.proxy(this.detailsClickHandler,this));
		}

		this.interval = window.setInterval($.proxy(this.onIntervalChange,this), 1000*60);
	};

	Card.prototype.unbindEvents = function() {
		clearInterval(this.interval);
		this.elem.find('.details').off('click', $.proxy(this.detailsClickHandler,this));
		this.elem.remove();
	};

	Card.prototype.onIntervalChange = function() {
		var now = new Date();
		var time = now.getTime();
		//console.log('checking interval for card', this.id);

		if (this.lifespanData.fromTime <= time && this.lifespanData.toTime <= time) {
			//console.log('remove card', this.id);
			clearInterval(this.interval);
			var e = new CustomEvent('remove-card', {'detail': { 'cardId': this.id }});
			window.dispatchEvent(e);
		}
	};

	Card.prototype.detailsClickHandler = function(event) {
		var type = $(event.currentTarget).data('type');
		var evt = new CustomEvent('details', {'detail':{'cardId': this.id, 'cardType':type}})
		window.dispatchEvent(evt);
		//Hasher.setHash('details/'+this.id);
	};

	return Card;

});
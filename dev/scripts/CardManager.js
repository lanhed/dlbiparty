//Singelton
define([
	'Card'
	],
function(
	Card
) {
	'use strict';
	var instance = null;

	function CardManager() {}

	CardManager.prototype.setup = function() {
		this.cardCounter = 0;
		this.cards = [];
		this.index = [];

		this.bindEvents();
	};

	CardManager.prototype.createCard = function(parent, data) {
		var elem = $('<li></li>');
		parent.append(elem);

		var now = new Date(); //new Date('2015-08-21T07:14').getTime(); //
		var timezone = now.getTimezoneOffset()/60;
		var nowTime = now.getTime();
		var lifespanData = {};

		var dateFrom = new Date(data.lifespan.from);
		dateFrom.setHours(dateFrom.getHours() + timezone);

		var dateTo = new Date(data.lifespan.to);
		dateTo.setHours(dateTo.getHours() + timezone);

		lifespanData.from = dateFrom;
		lifespanData.to = dateTo;

		dateFromTime = dateFrom.getTime();
		dateToTime = dateTo.getTime();

		lifespanData.fromTime = dateFromTime;
		lifespanData.toTime = dateToTime;

		// console.log('now', now);
		// console.log('from',dateFrom);
		// console.log('to',dateTo);

		var card = new Card(elem, lifespanData);
		if (this.cardExist(data.id)) {
			this.getCardFromId(data.id)
		} else {
			this.cards[data.id] = card;
			this.cardCounter++;
			this.index.push(data.id);
		}
		
		return card;
	};

	CardManager.prototype.bindEvents = function() {
		window.addEventListener('remove-card',$.proxy(this.removeCardEventListener,this));
	};

	CardManager.prototype.unbindEvents = function() {
		window.removeEventListener('remove-card',$.proxy(this.removeCardEventListener,this));	
	};

	CardManager.prototype.removeCardEventListener = function(event) {
		this.removeCard(null,event.detail.cardId);
		this.makeNextCardActive(event.detail.cardId);
	};

	CardManager.prototype.removeCard = function(parent,id) {
		var card = this.getCardFromId(id);
		if (card) {
			card.destroy();
			this.cards[id] = null;

			return true;
		} else {
			return false;
		}
	};

	CardManager.prototype.removeAllCards = function() {
		for (var i = this.index.length - 1; i >= 0; i--) {
			var cardId = this.index[i];
			var card = this.getCardFromId(cardId);
			card.destroy();
		};
	};

	CardManager.prototype.makeNextCardActive = function(prevId) {
		var index = 0;
		for (var i = 0; i < this.index.length; i++) {

			index = this.index[i];
			if (prevId == index) {
				if (!this.index[i+1]) {
					// there's no next index, route to next view.
					var evt = new Event('current_list');
					window.dispatchEvent(evt);
					break;
				}
				// make next card active
				var card = this.getCardFromId(this.index[i+1]);
				card.activateCard();
				break;
			}
		};
	};

	CardManager.prototype.getCardFromId = function(id) {
		return this.cards[id];
	};

	CardManager.prototype.getCardIndex = function() {
		return this.index;
	};

	CardManager.prototype.cardExist = function(id) {
		if (this.cards[id]) {
			return true;
		} else {
			return false;
		}
	};

	return function getInstance() {
		if (instance) {
			return instance;
		} else {
			instance = new CardManager();
			instance.setup();
		}
		return instance;
	}
});
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
	};

	CardManager.prototype.createCard = function(parent, data) {
		var elem = $('<li></li>');
		parent.append(elem);

		var now = new Date(); //new Date('2015-08-21T07:14').getTime(); //
		var timezone = now.getTimezoneOffset()/60;
		var nowTime = now.getTime();
		var dateData = {};

		var dateFrom = new Date(data.lifespan.from);
		dateFrom.setHours(dateFrom.getHours() + timezone);

		var dateTo = new Date(data.lifespan.to);
		dateTo.setHours(dateTo.getHours() + timezone);

		dateData.from = dateFrom;
		dateData.to = dateTo;

		dateFromTime = dateFrom.getTime();
		dateToTime = dateTo.getTime();

		dateData.fromTime = dateFromTime;
		dateData.toTime = dateToTime;

		console.log('from',dateFrom);
		console.log('to',dateTo);

		var card = new Card(elem);
		if (this.cardExist(data.id)) {
			this.getCardFromId(data.id)
		} else {
			this.cards[data.id] = card;
			this.cardCounter++;
			this.index.push(data.id);
		}

		//this.addEventListener()

		return card;
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
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

		var card = new Card(elem);
		if (this.cardExist(data.id)) {
			this.getCardFromId(data.id)
		} else {
			this.cards[data.id] = card;
			this.cardCounter++;
			this.index.push(data.id);
		}

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
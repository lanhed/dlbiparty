// Singelton
define([

	],
function(

){
	'use strict';
	var instance = null;

	function DataService() {}

	DataService.prototype.setup = function() {
		this.departingCity = null;
		this.data = null;
		this.cards = null;
		this.allCards = null;
		this.cardTypeIndex = null;
		this.dataLoaded = false;
		this.cardCount = 0;
		this.setings = null;

		return true;
	};

	DataService.prototype.loadData = function() {
		var that = this;
		var promise = $.Deferred();

		if (!localStorage.data) {

			$.getJSON('data/data.json', function(data) {
				that.data = data;
				console.log('data',data);
				that.settings = data.settings;
				var stringifiedData = JSON.stringify(that.data);
				try {
					localStorage.data = stringifiedData;
				} catch (e) {
					// TODO: handle the error...
				}

				that.indexCards(that.data);

				promise.resolve(that.data);
			});

		} else {
			this.data = JSON.parse(localStorage.data);

			this.settings = this.data.settings;

			this.indexCards(this.data);

			promise.resolve(this.data);
		}

		//console.log('departingCity',this.getDepartingCity());
		return promise;
	};

	DataService.prototype.getPartyDate = function() {
		return this.settings.partyDate;
	};


	DataService.prototype.getPostPartyDate = function() {
		return this.settings.postPartyDate;
	};

	DataService.prototype.indexCards = function() {
		this.cards = {
			"pre": [],
			"agenda": [],
			"post": []
		};
		this.allCards = [];
		this.cardTypeIndex = [];

		// loop through cities
		for (var i = 0; i < this.data.cities.length; i++) {
			var city = this.data.cities[i];
			var prePartyCards = this.data.travelPlans[i].pre;
			var postPartyCards = this.data.travelPlans[i].post;

			var i,j,
				cardData;

			for (j = 0; j < prePartyCards.length; j++) {
				cardData = prePartyCards[j];
				cardData.id = this.cardCount;
				this.cards.pre.push({"id":this.cardCount, "card": cardData});
				this.allCards.push({"id":this.cardCount, "card": cardData});
				this.cardTypeIndex.push({"id":this.cardCount, "type":"pre", "cityIndex":i});
				this.cardCount++;
			}

			for (j = 0; j < postPartyCards.length; j++) {
				cardData = postPartyCards[j];
				cardData.id = this.cardCount;
				this.cards.post.push({"id":this.cardCount, "card": cardData});
				this.allCards.push({"id":this.cardCount, "card": cardData});
				this.cardTypeIndex.push({"id":this.cardCount, "type":"post", "cityIndex":i});
				this.cardCount++;
			}
		};

		var agenda = this.data.agenda;
		for (i = 0; i < agenda.length; i++) {
			cardData = agenda[i];
			cardData.id = this.cardCount;
			this.cards.agenda.push({"id":this.cardCount, "card": cardData});
			this.allCards.push({"id":this.cardCount, "card": cardData});
			this.cardTypeIndex.push({"id":this.cardCount, "type":"agenda", "cityIndex":null});
			this.cardCount++;
		}
	};

	DataService.prototype.getData = function() {
		return this.data;
	};

	DataService.prototype.getCities = function() {
		return this.data.cities;
	};

	DataService.prototype.getPartyData = function() {
		return this.data.agenda;
	};

	DataService.prototype.getCardDataFromId = function(id) {
		/*
		Input parameters:
			id: Int

		allCards: Array
			card: Object { id, card }

		returns:
			Object, card
		*/

		var data = null;
		console.log('getCardDataFromId',id);
		for (var i = 0; i < this.allCards.length; i++) {
			var cardData = this.allCards[i];
			if (cardData.id === Number(id)) {
				return cardData.card;
			}
		}
	};

	DataService.prototype.getCardData = function(id, type) {
		/*
		Input parameters:
			id: Int
			type: String ('pre','during','post')

		cards: Array
			id: Int
			card: Object { id, card }

		returns:
			Object, card
		*/

		if (!type) {
			type = this.getDepartingCity();
		}

		var data = null;
		var cards = this.cards[type];
		for (var i = 0; i < cards.length; i++) {
			var cardData = cards[i];
			if (cardData.id === id) {
				return cardData.card;
			}
		}
	};

	DataService.prototype.getCardDataFromType = function(type) {
		/* 
		cardTypeIndex: Array
			cityIndex: Int
			id: String
			type: String

		returns:
			list of cards with the specified type and stored departing city
		*/

		var cards = [];
		var cardData = null;
		var cardIndex = 0;
		for (var i = 0; i < this.cardTypeIndex.length; i++) {
			cardIndex = this.cardTypeIndex[i];
			if (cardIndex.type === type && cardIndex.cityIndex === Number(this.getDepartingCity())) {
				cardData = this.getCardData(cardIndex.id, type);
				cards.push(cardData);
			} else if (type === 'agenda' && cardIndex.type === type) {
				cardData = this.getCardData(cardIndex.id, type);
				cards.push(cardData);
			}
		}
		return cards;
	};

	DataService.prototype.clearData = function() {
		this.data = null;
		this.cards = null;
		this.allCards = null;
		this.cardTypeIndex = null;
		this.dataLoaded = false;
		this.departingCity = null;
		this.cardCount = 0;
	};

	DataService.prototype.clearOfflineData = function() {
		
		try {
			localStorage.removeItem('departingCity');
			localStorage.removeItem('data');
			//console.log('localStorage',localStorage.departingCity, localStorage.data);
		} catch(e) {
			try {
				sessionStorage.removeItem('departingCity');
				sessionStorage.removeItem('data');
			} catch (e) {
				return;
			}
		}
	};

	DataService.prototype.setDepartingCity = function(index) {
		try {
			localStorage.departingCity = index;
			//console.log('departingCity stored in localStorage');
		} catch (e) {
			try {
				sessionStorage.setItem('departingCity', index);
				//console.log('departingCity stored in sessionStorage');
			} catch (e) {
				//console.log('sessionStorage not allowed');
			}
		}
		this.departingCity = index;
		//console.log('departingCity set to: ' + this.departingCity);
	};
	DataService.prototype.getDepartingCity = function() {
		if (!this.departingCity) {
			try {
				this.departingCity = localStorage.departingCity;
			} catch(e) {
				try {
					this.departingCity = sessionStorage.getItem('departingCity');
				} catch (e) {
					// departingCity has not been able to be stored. Reset app:
					Hasher.setHash('reset');
					return;
				}
			}
		}
		return this.departingCity;
	};

	DataService.prototype.getTypeFromTypeIndex = function(index) {
		var types = ['pre'];
		return; 
	};

	return function getInstance() {
		if (instance) {
			return instance;
		} else {
			instance = new DataService();
			instance.setup();
		}
		//instance = instance || new DataService();
		return instance;
	}
});
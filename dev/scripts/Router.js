define([
	'jquery',
	'signals',
	'crossroads',
	'hasher',

	'DataService',
	'CardManager',

	'departingSelection',
	'info',
	'agenda',
	'desktopMsg',
	'instagram',
	'navbar',
	'cardDetails'
], function(
	$,
	Signals,
	Crossroads,
	Hasher,

	DataService,
	CardManager,

	departingSelection,
	info,
	agenda,
	desktopMsg,
	instagram,
	navbar,
	cardDetails
) {
	'use strict';
	var instance = null;
	var dataService = DataService();

	var DEFAULT_HASH = 'home';

	function Router() {}

	Router.prototype.setup = function() {
		var that = this;
		this.hashHistory = [];
		this.prevHash = null;
		this.currentHash = null;

		var routeHome = Crossroads.addRoute(DEFAULT_HASH);
		routeHome.matched.add($.proxy(this.phoneHome,this));
		
		var routeInfo = Crossroads.addRoute('info');
		routeInfo.matched.add($.proxy(this.routeToInfo,this));
		
		var routePre = Crossroads.addRoute('pre');
		routePre.matched.add($.proxy(this.routeToPre,this));
		
		var routeParty = Crossroads.addRoute('during');
		routeParty.matched.add($.proxy(this.routeToParty,this));

		var routePost = Crossroads.addRoute('post');
		routePost.matched.add($.proxy(this.routeToPost,this));

		var routeInstagram = Crossroads.addRoute('instagram');
		routeInstagram.matched.add($.proxy(this.routeToInstagram,this));

		var detailsRoute = Crossroads.addRoute('/details/{id}', function(id) {
			Crossroads.parse('/details/'+id);
			var type = "";
			if (that.hashHistory.length > 0) {
				type = that.hashHistory[that.hashHistory.length - 1];
			}
		});
		
		this.bindEvents();

		//log all routes
		//Crossroads.routed.add(console.log, console);

		//parse initial hash
		Hasher.initialized.add($.proxy(this.parseHash,this));
		//parse hash changes
		Hasher.changed.add($.proxy(this.parseHash,this));
		//start listening for history change
		Hasher.init();
	};

	Router.prototype.bindEvents = function() {
		window.addEventListener('history_back', $.proxy(this.routeToPrevHash,this));
		window.addEventListener('current_list', $.proxy(this.routeToCurrentList,this));
		window.addEventListener('reset', $.proxy(this.routeToReset,this));
		window.addEventListener('details',$.proxy(this.routeToDetails,this));
	};

	Router.prototype.routeToDetails = function(event) {
		var id = event.detail.cardId;
		var cardType = event.detail.cardType;
		var cardData = DataService().getCardDataFromId(id);
		console.log(id, cardType, cardData);
		var data = null;
		if (cardType === 'depart') {
			data = cardData.info.depart.details;
		} else if (cardType === 'arrive') {
			data = cardData.info.arrive.details;
		} else  if (cardType === 'event') {
			data = cardData.info.card.details;
		}

		var oldHash = Hasher.getHash();
		Hasher.setHash('details/'+id);
		cardDetails.init($('.page-wrapper'), id, data);

		if (!navbar.isInitiated()) {
			navbar.init($('.navbar-wrapper'));
		}
		navbar.showBackButton();
	};

	Router.prototype.parseHash = function(newHash, oldHash) {
		this.currentHash = newHash;
		if (oldHash) {
			this.hashHistory.push(oldHash);

			if (oldHash === 'pre' || oldHash ==='post' || oldHash === 'during') {
				agenda.destroy();
			} else if (oldHash === 'instagram') {
				instagram.destroy();
			} else {
				cardDetails.destroy();
			}
		}

		Crossroads.parse(newHash);
	};

	Router.prototype.routeToDesktop = function() {
		desktopMsg.init($('.page-wrapper'));
	};

	Router.prototype.phoneHome = function() {
		var options = {};
		options.data = dataService.getData();
		Crossroads.parse(DEFAULT_HASH);
		departingSelection.init($('.page-wrapper'),options);
	};
	
	Router.prototype.routeToReset = function() {
		// what page is displaying?
		var hash = Hasher.getHash();
		if (hash === 'pre' || hash ==='post' || hash === 'during') {
			agenda.destroy();
		} else if (hash === 'instagram') {
			instagram.destroy();
		} else {
			cardDetails.destroy();
		}

		DataService().clearData();
		DataService().clearOfflineData();
		navbar.destroy();
		CardManager().removeAllCards();

		// force data reload
		window.app().forceDataReload();
	};

	Router.prototype.routeToInfo = function() {
		Crossroads.parse('info');
		info.init($('.page-wrapper'));
	};

	Router.prototype.routeToInstagram = function() {
		Crossroads.parse('instagram');
		instagram.init($('.page-wrapper'));
	};
	
	Router.prototype.routeToPre = function() {
		Crossroads.parse('pre');
		agenda.init($('.page-wrapper'),DataService().getCardDataFromType('pre'), 'Travel Info');
	};
	
	Router.prototype.routeToParty = function() {
		Crossroads.parse('during');
		agenda.init($('.page-wrapper'),DataService().getCardDataFromType('agenda'), 'Schedule');
	};
	Router.prototype.routeToPost = function() {
		Crossroads.parse('post');
		agenda.init($('.page-wrapper'),DataService().getCardDataFromType('post'), 'Homecoming');

	};
	Router.prototype.routeToPrevHash = function() {
		if (this.hashHistory.length === 0) {
			this.routeToCurrentList();
			return;
		}
		var prevHash = this.hashHistory.splice(this.hashHistory.length - 1);
		Hasher.setHash(prevHash);
	};
	
	Router.prototype.routeToCurrentList = function() {
		if (Hasher.getHash() === 'instagram') {
			if(DataService().getDepartingCity() && (DataService().getPerson() || !DataService().useIndividualData())) {
				Hasher.setHash('instagram');
				return;
			}
		}

		Hasher.setHash(this.getCurrentViewInTime());
	};

	Router.prototype.getCurrentViewInTime = function() {
		if (DataService().getDepartingCity()) {
			var nowDate = new Date();
			var timezone = nowDate.getTimezoneOffset()/60;
			var now = nowDate.getTime();
			var partyTime = new Date(DataService().getPartyDate()),
				postTime = new Date(DataService().getPostPartyDate());

			partyTime.setHours(partyTime.getHours() + timezone);
			postTime.setHours(postTime.getHours() + timezone);

			var partyDate = partyTime.getTime();
			var postDate = postTime.getTime();

			if (now < partyDate) {
				return 'pre';
			} else if (now >= partyDate && now < postDate) {
				return 'during';
			} else {
				return 'post';
			}
		} else {
			return 'home';
		}
	};

	return function getInstance() {
		if (instance) {
			return instance;
		} else {
			instance = new Router();
			instance.setup();
		}
		return instance;
	}

});
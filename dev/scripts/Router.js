define([
	'jquery',
	'signals',
	'crossroads',
	'hasher',

	'DataService',
	'CardManager',

	'departingSelection',
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

		var routeReset = Crossroads.addRoute('reset');
		routeReset.matched.add($.proxy(this.routeToReset,this));
		
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
			cardDetails.init($('.page-wrapper'), id);

			if (!navbar.isInitiated()) {
				navbar.init($('.navbar-wrapper'));
			}
			navbar.showBackButton();
		});
		
		this.bindEvents();

		//log all routes
		Crossroads.routed.add(console.log, console);

		//parse initial hash
		Hasher.initialized.add($.proxy(this.parseHash,this));
		//parse hash changes
		Hasher.changed.add($.proxy(this.parseHash,this));
		//start listening for history change
		Hasher.init();
	};

	Router.prototype.bindEvents = function() {
		window.addEventListener('history_back', $.proxy(this.routeToPrevHash,this));
	};

	Router.prototype.parseHash = function(newHash, oldHash) {
		this.currentHash = newHash;
		if (oldHash) {
			this.hashHistory.push(oldHash);

			if (oldHash === 'pre' || oldHash ==='post' || oldHash === 'during') {
				agenda.destroy();
			} else { // details
				//details.destroy();
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
		DataService().clearData();
		DataService().clearOfflineData();
		navbar.destroy();

		// what page is displaying?
		var hash = Hasher.getHash();
		if (hash === 'pre' || hash ==='post' || hash === 'during') {
			agenda.destroy();
		} else if (hash === 'reset') {
		} else {
			console.log('reset hash',hash);
			details.destroy();
		}

		// force data reload
		window.app().forceDataReload();
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
			return;
		}

		if (DataService().getDepartingCity()) {
			var now = Date.now(); //new Date('2015-08-21T07:14').getTime(); 
			var partyDate = '2015-08-21T13:00',
				postPartyDate = '2015-08-22T07:00';

			var partyTime = new Date(partyDate).getTime(),
				postTime = new Date(postPartyDate).getTime();

			if (now < partyTime) {
				Hasher.setHash('pre');
			} else if (now >= partyTime && now < postTime) {
				Hasher.setHash('during');
			} else {
				Hasher.setHash('post');
			}
		} else {
			Hasher.setHash('home');
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
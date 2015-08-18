define([
	'jquery',
	'handlebars',
	'text!templates/instagram.hbs',

	'navbar',

	'instafeed'
], function(
	$,
	Handlebars,
	template,

	navbar,

	Instafeed
) {

	return {
		CLIENT_ID: 'a90c4fd61c0c4d91be39b574b06fd562',
		TARGET_ID: 'instafeed',

		HASHTAG: 'dlbi',

		init: function($elem) {
			this.$elem = $elem;

			if (!navbar.isInitiated()) {
				navbar.init($('.navbar-wrapper'));
			}
			navbar.setPageHeader('INSTAGRAM');

			this.render();
			this.initInstafeed();
		},
		destroy: function() {},

		render: function() {
			var compiled = Handlebars.compile(template);

			var data = {
				targetId: this.TARGET_ID
			};

			this.$elem.html(compiled(data));
		},

		initInstafeed: function() {
			this.feed = new Instafeed({
				clientId: this.CLIENT_ID,
				target: this.TARGET_ID,

				tagName: this.HASHTAG,
				get: 'tagged',

				limit: 60
			});

			this.feed.run();
		}
	};
});
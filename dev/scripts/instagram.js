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

			window.instagram = this;
		},
		destroy: function() {},

		render: function() {
			var compiled = Handlebars.compile(template);

			var data = {
				targetId: this.TARGET_ID
			};

			this.$elem.html(compiled(data));

			this.bindEvents();
		},

		bindEvents: function() {
			this.$elem.find('.show-more').click($.proxy(this.onMoreClickHandler, this));
		},

		initInstafeed: function() {

			this.feed = new Instafeed({
				clientId: this.CLIENT_ID,
				target: this.TARGET_ID,

				tagName: this.HASHTAG,
				get: 'tagged',

				limit: 60,

				after: $.proxy(this.onFetchSuccess, this)
			});

			this.feed.run();
		},

		onFetchSuccess: function() {
			this.$elem.find('[data-fixed-loader]').hide();
			this.$elem.find('.show-more').removeClass('loading').toggleClass('visible', this.feed.hasNext());
		},

		onMoreClickHandler: function() {
			this.$elem.find('.show-more').addClass('loading');
			this.feed.next();
		}
	};
});
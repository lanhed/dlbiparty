define([
	'jquery',
	'handlebars',
	'text!templates/cardWrapper.hbs',
	'CardManager',
	'Card',
	'navbar'
],
function(
	$,
	Handlebars,
	template,
	CardManager,
	Card,
	navbar
){
	return {
		init: function(elem,data,title) {
			this.elem = elem;
			this.data = data;
			if (!navbar.isInitiated()) {
				navbar.init($('.navbar-wrapper'));
			}
			navbar.setPageHeader(title.toUpperCase());
			this.render();
		},
		render: function() {
			var compile = Handlebars.compile(template);

			var html = compile({});
			this.elem.html(html);
			this.cardsWrapper = this.elem.find('.card-wrapper');

			this.createCards();
		},
		destroy:function() {

		},
		createCards: function(){
			var cardData = null,
				d = null;

			var now = new Date('2015-08-21T07:14').getTime(); //Date.now().getTime();
			var foundActiveCard = false;

			for (var i = 0; i < this.data.length; i++) {
				d = this.data[i];

				var dateFrom = new Date(d.lifespan.from).getTime();
				var dateTo = new Date(d.lifespan.to).getTime();

				if(dateFrom <= now && dateTo >= now) {
					d.active = foundActiveCard = true;
				} else if (dateFrom <= now && dateTo <= now) {
					// remove data as well?!
					d.removed = true;
				}
			}

			if (!foundActiveCard) {
				this.data[0].active = true;
			}

			this.renderCard(this.data);
		},
		renderCard: function(data) {
			var cardData = null,
				card = null;

			for (var i = 0; i < data.length; i++) {
				cardData = data[i];
				card = CardManager().createCard(this.cardsWrapper,cardData);
				if (!cardData.removed) {
					card.render(cardData);
				}
			}
		}
	}
});
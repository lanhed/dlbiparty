define([
	'jquery',
	'handlebars',
	'text!templates/cardWrapper.hbs',
	'dataService',
	'Card'
],
function(
	$,
	Handlebars,
	template,
	dataService,
	Card
){
	return {
		init: function(elem,data) {
			this.elem = elem;
			this.render();
		},
		render: function() {
			var compile = Handlebars.compile(template);

			var html = compile({});
			this.elem.html(html);
			this.cardsWrapper = this.elem.find('.card-wrapper');

			this.createCards();
		},
		destroy: function() {

		},
		createCards: function(){
			var card = new Card(this.cardsWrapper);
		},
		renderCard: function(card,data) {
			var cardData = null;
			for (var i = 0; i < data.length; i++) {
				cardData = data[i];
				if (!cardData.removed) {
					card.render(cardData);
				}
			}
		}
	};
});
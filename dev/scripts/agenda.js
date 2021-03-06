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

			var now = new Date(); //new Date('2015-08-21T07:14').getTime(); //
			var timezone = now.getTimezoneOffset()/60;
			var nowTime = now.getTime();
			var foundActiveCard = false;

			var dateData = {};
			var deleteData = [];

			for (var i = 0; i < this.data.length; i++) {
				d = this.data[i];

				var dateFrom = new Date(d.lifespan.from);
				dateFrom.setHours(dateFrom.getHours() + timezone);
				var dateTo = new Date(d.lifespan.to);
				dateTo.setHours(dateTo.getHours() + timezone);

				dateData.from = dateFrom;
				dateData.to = dateTo;

				dateFromTime = dateFrom.getTime();
				dateToTime = dateTo.getTime();

				dateData.fromTime = dateFromTime;
				dateData.toTime = dateToTime;

				/*console.log((dateFromTime <= nowTime), (dateToTime >= nowTime),d);
				console.log(now, dateFrom, dateTo);
				console.log('');*/
				if(dateFromTime <= nowTime && dateToTime >= nowTime) {
					d.active = foundActiveCard = true;
				} else if (dateFromTime <= nowTime && dateToTime <= nowTime) {
					
					d.removed = true;
					deleteData.push(i);
				}
			}
			if (deleteData.length > 0) {
				for (var i = deleteData.length - 1; i >= 0; i--) {
					var key = deleteData[i];
					var deleted = this.data.splice(key,1);
				};
			}
			if (!foundActiveCard && this.data[0]) {
				this.data[0].active = true;
			}

			this.renderCard(this.data);
		},
		renderCard: function(data) {
			var cardData = null,
				card = null;

			if (data.length > 0) {
				this.elem.find('li.no-data').addClass('hide');
			} else {
				this.elem.find('li.no-data').removeClass('hide');
			}

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
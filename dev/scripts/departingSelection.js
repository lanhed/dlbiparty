define([
	'jquery',
	'hasher',
	'handlebars', 
	'text!templates/departingSelection.hbs',
	'text!templates/personSelection.hbs',
	'DataService'],
function(
	$,
	Hasher,
	Handlebars,
	template,
	personTemplate,
	DataService
) {

	return {
		init: function(elem, options) {
			this.elem = elem;
			this.data = options.data;
			this.cities = null;
			this.personData = null;
			this.render();
			this.useIndividualData = DataService().useIndividualData();
		},
		render: function() {
			var compile = Handlebars.compile(template);
			this.cities = DataService().getCities();
			var html = compile(this.cities);
			//var html = compile({});
			
			this.elem.html(html);

			this.bindEvents();
		},
		destroy: function() {

		},
		bindEvents:function(){
			this.elem.find('select.city').on('change', $.proxy(this.onCityChangeHandler, this));
		},

		onCityChangeHandler: function(event) {
			var selectedIndex = event.currentTarget.selectedIndex - 1;
			DataService().setDepartingCity(selectedIndex);
			if (this.useIndividualData) {
				var $el = this.elem.find('.start');
				var compile = Handlebars.compile(personTemplate);
				var people = this.cities[selectedIndex].people;
				
				var html = compile(people);
				$el.append(html);

				this.elem.find('select.person').on('change', $.proxy(this.onPersonChangeHandler, this));
			} else {
				this.showCurrentView();
			}
		},

		onPersonChangeHandler: function(event) {
			var selectedIndex = event.currentTarget.selectedIndex - 1;
			var cityIndex = DataService().getDepartingCity();
			var city = this.data.cities[cityIndex];
			this.personData = city.people[selectedIndex];
			DataService().setPerson(this.personData);
			this.showCurrentView();
		},

		showCurrentView: function() {
			var evt = new Event('current_list');
			window.dispatchEvent(evt);
		}
	}
});
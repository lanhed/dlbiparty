define([
	'jquery',
	'handlebars',
	'text!templates/navbar.hbs',
	
	'Router'],

function(
	$,
	Handlebars,
	template,

	Router
) {
	return {
		init: function(elem, data) {
			this.elem = elem;
			this.initiated = true;
			this.render();
		},
		
		render: function() {
			var compile = Handlebars.compile(template);
			var html = compile({});

			this.elem.html(html);

			this.bindEvents();
		},

		destroy: function() {
			this.initiated = false;
			this.elem.empty();
			$('li').off('click','a', $.proxy(this.onMenuClickHandler,this));
		},

		bindEvents: function(){
			$('li').on('click','a', $.proxy(this.onMenuClickHandler,this));
			this.icon = this.elem.find('.glyphicon-chevron-left');
			this.icon.click($.proxy(this.onBackButtonClickHandler, this));
		},

		onMenuClickHandler: function(event){
			var el = $(event.currentTarget).closest('li');
			var id = el.attr('id');
			if (id) {
				this.setActiveElement(id);
			}
			this.elem.find('.collapse').collapse('hide');
		},
		onBackButtonClickHandler: function(event) {
			var event = new Event('history_back');
			window.dispatchEvent(event);
		},
		isInitiated: function(){
			var children = this.elem == undefined ? [] : this.elem.children();
			var childCount = this.elem == undefined ? 0 : children.length;
			if (this.initiated && childCount > 0) {
				return this.initiated;
			} else {
				return false;
			}
		},
		setPageHeader: function(header) {
			var elem = this.elem.find('span.page-title');
			elem.html(header);
		},
		setActiveElement:function(name) {
			var activeElement = this.elem.find('li.active');
			activeElement.removeClass('active');

			var el = this.elem.find('#'+name);
			el.addClass('active');
		},
		showBackButton: function() {
			var icon = this.elem.find('.glyphicon-chevron-left');
			icon.addClass('active');
		},
		hideBackButton: function() {
			var icon = this.elem.find('.glyphicon-chevron-left');
			icon.removeClass('active');
		}
	};
});
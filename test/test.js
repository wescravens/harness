(function(root) {
	root.App = {};
	App.features = root.Harness;
})(this);

$(document).ready(function() {
	App.features.init();
});

App.features.testFeatureOne = (function(feat) {

	var el = {}, $el,

	setEls = function() {
		el.test = $el.find('p');
	};

	feat.events = {
		'click button': 'clickHandler'
	};

	feat.clickHandler = function() {
		console.log('feat', feat);
		var rootElClone = feat.offline();


		console.log('click');

		rootElClone.css({ 'background': 'red' }); // root el is still unchanged here

		this.$el.css({ 'background': 'blue' }); // root el is blue

		rootElClone.online(); // root el is red
	};

	feat.init = function(root) {
		$el = root;
		$el.find('ul').append('<li>testFeatureOne\'s root element class is ' + $el.attr('class') + '</li>');
		setEls();
	};

	return feat;

}(App.features.testFeatureOne || {}));

App.features.testFeatureTwo = (function(feat) {

	feat.doStuff = function() {
		// here is where I would put stuff to do... if I had something
	};

	feat.init = function($el) {
		this.doStuff();
		this.$('ul').append('<li>testFeatureTwo\'s root element class is ' + $el.attr('class') + '</li>');
	};

	return feat;

}(App.features.testFeatureTwo || {}));

App.features.testFeatureThree = {

	doStuff: function() {

	},

	init: function($el) {
		this.doStuff();
		this.$el.append('<li>testFeatureThree\'s root element class is ' + $el.attr('class') + '</li>');
	}

};

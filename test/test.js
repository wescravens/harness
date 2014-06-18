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
	},

	events = function() {
		$el.off('click').on('click', function() {
			console.log('$el', $el);
			console.log('p', el.test);
		});
	};

	feat.init = function(root) {
		console.log('root', root);
		$el = root;
		$el.find('ul').append('<li>testFeatureOne\'s root element class is ' + $el.attr('class') + '</li>');
		setEls();
		events();
	};

	return feat;

}(App.features.testFeatureOne || {}));

App.features.testFeatureTwo = (function(feat) {

	feat.doStuff = function() {
		console.log('this stuff', this);
	};

	feat.init = function($el) {
		this.doStuff();
		this.$('ul').append('<li>testFeatureTwo\'s root element class is ' + $el.attr('class') + '</li>');
	};

	return feat;

}(App.features.testFeatureTwo || {}));

App.features.testFeatureThree = {

	doStuff: function() {
		console.log('this', this);
	},

	init: function($el) {
		this.doStuff();
		this.$el.append('<li>testFeatureThree\'s root element class is ' + $el.attr('class') + '</li>');
	}

};

Harness.testFeatureOne = (function(feat) {

	feat.init = function($el) {
		this.$('ul').append('<li>testFeatureOne\'s root element class is ' + $el.attr('class') + '</li>');
	};

	return feat;

}(Harness.testFeatureOne || {}));

Harness.testFeatureTwo = (function(feat) {

	feat.init = function($el) {
		this.$('ul').append('<li>testFeatureTwo\'s root element class is ' + $el.attr('class') + '</li>');
	};

	return feat;

}(Harness.testFeatureTwo || {}));

Harness.testFeatureThree = (function(feat) {

	feat.init = function($el) {
		this.$el.append('<li>testFeatureThree\'s root element class is ' + $el.attr('class') + '</li>');
	};

	return feat;

}(Harness.testFeatureThree || {}));

$(document).ready(function() {
	window.App = {};
	App.features = Harness;
	App.features.init();
});

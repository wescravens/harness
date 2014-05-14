//    Harness.js 0.0.1

//     Forked by Wes Cravens from https://gist.github.com/erikakers/6241813
//     Harness may be freely distributed under the MIT license.
//     Harness is a simple way to initialize and bind logic to DOM elements
//     For more details and documentation:
//     https://github.com/wescravens/harness

(function(root, build) {

	root.Harness = build(root, {}, (root.jQuery || root.$));

}(this, function(root, Harness, $) {

	// Create $ under Harness namespace
	Harness.$ = $;

	var setupFeature = function(func, elem) {
		var fn = Harness[func];
		if ( fn && typeof fn.init === 'function' ) {
			// set the feature's $ variable to traverse from the root element of the feature
			// it will be accessible via this.$ and does not interfere with global $
			fn.$ = function(el) {
				return Harness.$(elem).find(el);
			};

			// cache the root element as this.$el
			fn.$el = Harness.$(elem);
		}
		return fn;
	};

	var init = Harness.init = function() {
		// cache the features
		var features = Harness.$('[data-features]');

		// if no features exist, break the operation
		if ( !features.length ) { return false; }

		// loop through the features and call its init function if it exists
		features.each(function() {
			var func = Harness.$(this).data('features');
			// if the data-features string contains multiple features, init each of them
			var _this = this,
			tmp = func.split(/\s*[\s,]\s*/);

			tmp.forEach(function(fn){
				// call the setup function that adds utility functions and
				// init the function passing in the jQuery root element
				setupFeature(fn, _this).init($(_this));
			});
		});
	};

	return Harness;

}));

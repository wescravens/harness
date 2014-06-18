//    Harness.js 0.0.1

//     Forked by Wes Cravens from https://gist.github.com/erikakers/6241813
//     Harness may be freely distributed under the MIT license.
//     Harness is a simple way to initialize and bind logic to DOM elements
//     For more details and documentation:
//     https://github.com/wescravens/harness

(function(root, factory) {

	// AMD support
	if ( typeof define === 'function' && define.amd ) {
		define(['underscore', 'jquery', 'exports'], function(_, $, exports) {
			return factory(root, exports, _, $);
		})
	} 
	// expose global
	else {
		root.Harness = factory(root, {}, root._, (root.jQuery || root.$));
	}

}(this, function(root, Harness, _, $) {

	// Reference $ under Harness namespace
	Harness.$ = $;

	/**
	 * Function to inject default properties
	 * @private
	 * @param  {String} func The function name to be initialized
	 * @param  {Object} elem The root DOM node of the feature
	 * @return {Object} The feature object to be initialized
	 */
	function setupFeature(func, elem) {
		var fn = this[func];
		
		// set the feature's $ variable to traverse from the root element of the feature
		// it will be accessible via this.$ and does not interfere with global $
		fn.$ = function(el) {
			return Harness.$(elem).find(el);
		};

		// cache the root element as this.$el
		fn.$el = Harness.$(elem);
		return fn;
	}

	Harness.init = function() {
		// cache the features
		var $featureElements = Harness.$('[data-features]'),
			_this = this;

		// if no features exist, no need to move on
		if ( !$featureElements.length ) { return false; }

		// Create an array of objects storing the function name and root DOM node of the feature (_.map)
		// Remove the array nesting created by splitting the data-features string (_.flatten)
		// Loop through the array, setup, and initialize the features (_.each)
		_.each(_.flatten(_.map($featureElements, function(element) {
			var funcArray = $(element).data('features').split(/\s*[\s,]\s*/);
			return _.map(funcArray, function(func) {
				return { func: func, element: element };
			});
		})), function(feature) {
			if ( _this[feature.func] && typeof _this[feature.func].init === 'function' ) {
				_.bind(setupFeature, _this)(feature.func, feature.element).init($(feature.element));
			}
		});
	};

	return Harness;

}));

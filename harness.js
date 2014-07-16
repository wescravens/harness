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
		});
	} 
	// expose global
	else {
		root.Harness = factory(root, {}, root._, (root.jQuery || root.$));
	}

}(this, function(root, Harness, _, $) {

	// Reference $ under Harness namespace
	Harness.$ = $;

	var eventSplitter = /^(\S+)\s*(.*)$/,
		featureSplitter = /\s*[\s]\s*/g;

	/**
	 * Creates a collection of objects mapping feature function names to their DOM elements
	 *
	 * @private
	 * @param  {object} $els 
	 * @return {[type]}      [description]
	 */
	function mapFeaturesToElements(elements) {
		var functionMap = _.map(elements, function(element) {
			var $element = $(element),
				funcNames = $element.data('features').split(featureSplitter),
				collection = [];

			_.forEach(funcNames, function(funcName) {
				collection.push({
					funcName: funcName,
					$element: $element
				});
			});
			return collection;
		});

		// remove nested arrays before returning
		return _.flatten(functionMap);
	}

	/**
	 * Function to inject default properties
	 * @private
	 * @param  {String} func The function name to be initialized
	 * @param  {Object} elem The root DOM node of the feature
	 * @return {Object} The feature object to be initialized
	 */
	function setupFeature(func, $elem) {
		var fn = this[func];

		var defaults = {

			// Create a unique id for the feature
			_id: _.uniqueId('feature_'),

			// cache the root element
			$el: $elem,

			// set the feature's $ variable to traverse from the root element of the feature
			// it will be accessible via this.$ and does not interfere with global $
			$: function(child) {
				return this.$el.find(child);
			},

			init: function() {},

			// function that clones the root node and
			// creates a render function that, when called, will replace
			// the root node with the modified clone
			// dependent on jQuery.replaceWith
			offline: function() {
				var $clone = this.$el.clone(),
					_this = this;

				$clone.online = function() {
					_this.$el.replaceWith($clone);
					_this.$el = $clone;
				};

				return $clone;
			},

			util: {
				_createEventData: function(key, _this) {
					var match = key.match(eventSplitter);
					return {
						callback: _this.events[key],
						eventName: match[1] + '.' + _this._id,
						selector: match[2]
					}
				}
			},

			events: {},

			// attach event listeners based on the feature's events object
			// Events are delegated via jQuery's 'on' function
			// The 'on' function will scope the function passed in to
			// the element the event is attached to, so $.proxy is
			// used to retain the View scope within the function
			listen: function() {
				// unbind previously bound events to prevent multiple bindings
				this.ignoreAll();
				for (var key in this.events) {
					var _event = this.util._createEventData(key, this);

					if ( _event.selector === '' ) {
						this.$el.on(_event.eventName, $.proxy(this[_event.callback], this));
					} else {
						this.$el.on(_event.eventName, _event.selector, $.proxy(this[_event.callback], this));
					}
				}
				return this;
			},

			// Ignores the event name passed in ie: 'click .button'
			// within the scope of this feature
			ignore: function(eventString) {
				var _event = this.util._createEventData(key, this);
				if (_event.selector === '') {
					this.$el.off(_event.eventName);
				} else {
					this.$el.off(_event.eventName, _event.selector);
				}

				return this;
			},

			// unbinds all events within the scope of this feature
			ignoreAll: function() {
				for (var key in this.events) {
					var _event = this.util._createEventData(key, this);

					if (_event.selector === '') {
						this.$el.off(_event.eventName);
					} else {
						this.$el.off(_event.eventName, _event.selector);
					}
				}

				return this;
			},

			destroy: function() {
				this.$el.remove();
				this.ignoreAll();
				return this;
			}
		};

		_.extend(defaults, fn);

		return defaults;
	}

	Harness.init = function() {
		// cache the features
		var _this = this;
		var $featureElements = Harness.$('[data-features]');

		// if no features exist, no need to move on
		if ( !$featureElements.length ) { return false; }

		var featureCollection = mapFeaturesToElements($featureElements);

		// Loop through the array, setup, and initialize the features
		_.forEach(featureCollection, function(feature) {
			var featureObj = _.bind(setupFeature, _this)(feature.funcName, feature.$element);
			_.extend(_this[feature.funcName], featureObj);
			_this[feature.funcName].listen().init(feature.$element);
		});
	};

	return Harness;

}));

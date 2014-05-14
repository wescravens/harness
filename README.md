#Harness.js
_A simple way to initialize and bind logic to DOM elements_

###Install with Bower

```
bower install harness
```

###Getting Started
Initialize Harness at the time of your choosing.  I prefer to do so on DOM ready.

```
$(document).ready(function() {
	Harness.init();
});
```
You can also change the namespace where your functions are stored if you prefer.
```
$(document).ready(function() {
	window.App = {};
	App.features = Harness;
	App.features.init();
});
```
Create some logic by assigning the feature to an object with a public init function in whatever format you desire.
```
// Module pattern
Harness.testFeature = (function(feature) {

	feature.doStuff = function() {
		console.log('this element', this.$el);
	};

	feature.init = function($el) {
		// the first parameter passed into the init function
		// is the root jQuery element the logic is bound to
		console.log('initialized');
	};

	return feature;

}(Harness.testFeature || {}));

// Object notation
Harness.testFeatureTwo = {

	doStuff: function() {
		console.log('this stuff', this);
	},

	init: function($el) {
		this.doStuff();
	}

};
```
Use the `data-features` attribute on a DOM element to bind the function to that element and initialize the function when `Harness.init()` is called.
```
<div class="my-feature" data-features="testFeature"></div>
```
Also, you can assign as many features to a single DOM element as you would like.
```
<div class="my-feature" data-features="testFeature testFeatureTwo"></div>
```
###Additional Features
Aside from passing the jQuery root element of the feature to the init function,
Harness also binds a `$` function to the object, as well as, the `$el` variable.
These are accessible in the init function or any other publicly accessible function within the object.
The `$` function is local to the object (accessible via `this.$`).  It does not interfere with the global `$` used by jQuery or any other library.

Calling `this.$('.my-selector')` would traverse all of the root's child elements for an element with the `my-selector` class and return the jQuery object.
This essentially just returns `$(<root element>).find(<parameter>);`

`this.$el` will return the jQuery representation of the root element.

Please email me with any bugs, comments, suggestions, etc.

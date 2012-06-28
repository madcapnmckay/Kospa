	exports.start = function(pageModel, debug) {
		
		exports.debug = debug || exports.debug;			
		
		ko.applyBindings(pageModel);		

		exports.publish("AppStart", pageModel || {});

		defaults.routeProvider.init();
	};

	exports.publish = function(name) {
		var args = [].slice.apply(arguments);
		ko.postbox.publish(name, args.slice(1));
	};

	exports.subscribeTo = function(topic, callback, target) {
		ko.postbox.subscribe(topic, function (args) {
			callback.apply(this, args);
		}, target || exports);
	};

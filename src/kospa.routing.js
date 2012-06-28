
	exports.systemEvents = ["AppStart", "AppRoute", "AppDispatch"];

	exports.Route = function (config) {
		var r = {};
		
		r.name = config.name;
		r.url = config.url;

		defaults.routeProvider.register(r.url, function () {
			var params = [].slice.apply(arguments);
			exports.publish.apply(exports, [ "AppRoute", r.name ].concat(params));
			exports.publish.apply(exports, [ r.name ].concat(params));
		});

		return r;
	};

	exports.routes = [];

	routeMapping = {
		names: {},
		urls: {}
	}

	exports.clearRoutes = function() {
		routeMapping.names = {};
		routeMapping.urls = {};
		exports.routes = [];
	};

	exports.getUrl = function (name) {
		if (!routeMapping.names[name]) {
			throw new Error(utils.format.call("A route with the name {0} does not exist", name));
		}
		return routeMapping.names[name].url;
	};

	exports.route = function (name, url) {
		if (routeMapping.names[name] !== undefined) {
			throw new Error(utils.format.call("A route with the name {0} already exists", name));
		}
		if (routeMapping.urls[url] !== undefined) {
			throw new Error(utils.format.call("A route with the url {0} already exists", url));
		}
		if (exports.systemEvents.indexOf(name) !== -1) {
			throw new Error(utils.format.call("{0} is a reserved event name, please choose a different name", name));
		}
		// create the handler
		var route = exports.Route({ name: name, url: url });
		routeMapping.names[name] = route;
		routeMapping.urls[url] = route;
		exports.routes.push(route);

		return exports;
	};

	exports.navigate = function (name, data) {
		defaults.routeProvider.navigate(exports.getUrl(name), data);
	};

	exports.resolve = function (name, data) {
		defaults.routeProvider.resolve(exports.getUrl(name), data);
	};

	ko.subscribable.fn.bindTo = function(topicAndParam) {
	    
	    var self = this,
	    	parts = topicAndParam.split("."),
	    	topic = parts[0],
	    	param = parts[1];

	    this.subscribeTo(topic, true, function (newValue) {
	    	return newValue && newValue[param];
	    });

	    return this;
	};

	ko.bindingHandlers.route = {
	    update: function (element, valueAccessor, allbindingsAccesor, viewModel) {
	        var value = ko.utils.unwrapObservable(valueAccessor()),
	        	name = value.name || value,
	        	data = value.data || {};

	    	href = defaults.resolve(getUrl(name), data);

	    	var newValueAccessor = function () {
	            var result = {};
	            result["href"] = href;
	            result["title"] = routeName;
	            return result;
	        };
	    	ko.bindingHandlers["attr"]["update"].call(this, element, newValueAccessor, allbindingsAccesor, viewModel);
	    }
	};
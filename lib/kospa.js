"use strict";

!(function(factory) {

    //CommonJS
    if (typeof require === "function" && typeof exports === "object" && typeof module === "object") {
        factory(require("knockout"), exports);
    //AMD
    } else if (typeof define === "function" && define.amd) {
        define(["knockout", "exports"], factory);
    //normal script tag
    } else {
        kospa = "undefined" === typeof kospa ? {} : kospa;
        factory(ko, kospa);
    }
}(function(ko, exports) {
    
    var utils = { }, log = { }, panes = {}, emptyModel = {}, routeMapping, defaults, animations, 

    context = "undefined" === typeof window ? global : window,

    features = { };
    features.vendor = /webkit/i.test(navigator.appVersion) ? 'webkit' : /firefox/i.test(navigator.userAgent) ? 'Moz' : 'opera' in context ? 'O' : '';
    features.isAndroid = /android/gi.test(navigator.appVersion);
    features.useCssTransform = (!features.isAndroid) && (features.vendor + 'Transform' in document.documentElement.style);
    features.cssTransformPrefix = "-" + features.vendor.toLowerCase() + "-";
    features.transitionEndEvent = features.vendor === 'webkit' ? 'webkitTransitionEnd' : features.vendor === 'O' ? 'oTransitionEnd' : 'transitionend';

    utils.log =function () {
        if (!exports.debug) {
            return;
        }

        log.history = log.history || [];  // store logs to an array for reference
        log.history.push(arguments);
        if (typeof console.log == 'function') {
            if ((Array.prototype.slice.call(arguments)).length == 1 && typeof Array.prototype.slice.call(arguments)[0] == 'string') {
              console.log( (Array.prototype.slice.call(arguments)).toString() );
            }
            else {
              console.log( Array.prototype.slice.call(arguments) );
            }
        }
    };
    // string formatting
    utils.format = function(input) {
        var args = arguments;
        return this.replace(/{(\d+)}/g, function(match, number) { 
            return typeof args[number] != 'undefined'
              ? args[number]
              : match
            ;
        });
    };

    exports.providers = exports.providers || {};

    exports.defaults = defaults = {
        routeProvider: exports.providers.RouterJs
    };

    exports.setOptions = function () {

    };
    

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
	exports.animations = animations = {};
	

	animations.show = {
		run : function (incoming, outgoing, container, complete) {
			incoming.element.addClass("active");
			if (outgoing) {
				outgoing.element.removeClass("active");
			}
			complete();
		}
	};

	animations.fadeIn = function(duration) {

		this.run = function (incoming, outgoing, container, complete) {
			if (outgoing) {
				outgoing.element.removeClass("active");
			}
			incoming.element.hide().addClass("active");
			incoming.element.fadeIn(duration, function () {
				complete();
			});			
		}
	};

	animations.slide = function(config) {

		var duration = config.duration || 500;

		var animate = function (element, pos, complete) {
			if (features.useCssTransform) {
				var handlerWrapper, transform = {};
				transform[features.cssTransformPrefix + "transform"] = utils.format("translate({0}px, {1}px)", pos.left, pos.top);
				transform[features.cssTransformPrefix + "transition"] = utils.format("{0}transform {1}ms ease-out", features.cssTransformPrefix, duration);
				handlerWrapper = function() {
					complete();
					element.unbind(features.transitionEndEvent, handlerWrapper);
				};
				element.bind(features.transitionEndEvent, handlerWrapper);
				element.css(transform);
			} else {
				element.animate(pos, duration, 'swing', complete);
			}
		};

		this.run = function (incoming, outgoing, container, complete) {
			var destination  = { left: 0, top: 0 },
				start = { left: 0, top : 0},
				from = config.from,
				horizontal = from === "left" || from === "right",
				coordinate = horizontal ? "left" : "top",
				direction =  from === "right" || from === "bottom" ? -1 : 1,
				multiplier = horizontal ? container.width() : container.height();
				
			destination[coordinate] = direction * multiplier;
			start[coordinate] = -destination[coordinate];
			
			incoming.element.css(start);
			animate(container, destination, function() {
				if (outgoing) {
					outgoing.element.removeClass("active");
				}
				incoming.element.attr("style", "").addClass("active");
				container.attr("style", "");
				complete();
			});
			
		}
	};

	exports.panes = {};

	exports.Pane = function (container) {
		var p = {}, templateMap = {}, views = [],

		callHandler = function (view, handler) {
			if (view && view.model[handler]) {
				view.model[handler].call(view.model, view.element);
			}
		};

		p.find = function (template, model) {
			for (var i = 0; i < views.length; i += 1) {
				var def = views[i];
				if (def.template === template && def.model === model) {
					return def;
				};
			}
			return null;
		};

		p.createView = function(viewDefinition) {
			var element = $("<div></div>").addClass("kospa-view").appendTo(container),
				view = $.extend({}, viewDefinition, { element: element });

			ko.renderTemplate(view.template, view.model, { }, view.element.get(0), "replaceChildren");
			views.push(view);
			return view;
		};

		p.render =  function (viewDefinition) {
			if (!viewDefinition.template) { 
				throw new Error("A view template must be supplied");
			}
			viewDefinition.model = viewDefinition.model || emptyModel;

			var incoming = p.find(viewDefinition.template, viewDefinition.model);
			incoming = incoming || p.createView(viewDefinition);

			// decide whether anything has changed
			var engine = this,
			outgoing = p.current;

			if (outgoing !== incoming) {
				var animation = incoming.animation || defaults.animation || exports.animations.show;
				callHandler(incoming, "beforeShow");
				callHandler(outgoing, "beforeHide");
				animation.run(incoming, outgoing, container, function () {
					callHandler(incoming, "afterShow");
					callHandler(outgoing, "afterHide");
				});
			}
			p.current = incoming;
			
		};

		return p;
	};

	exports.createPane = function (name, element) {
		if (exports.panes[name]) {
			throw new Error("A pane with the same name has already been registered");
		}
		if (!element) {
			throw new Error("A dom element must be supplied");
		}

		element = $(element).empty().addClass("kospa-pane");
		var container = $("<div></div>").addClass("kospa-slider").appendTo(element);
		exports.panes[name] = exports.Pane(container);
	};

	ko.bindingHandlers.pane = {
		init : function (element, valueAccessor, allbindingsAccesor, viewModel) {
			exports.createPane(valueAccessor(), element);
		}
	};

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


}));
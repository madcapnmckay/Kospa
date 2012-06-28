!(function(factory) {

    //CommonJS
    if (typeof require === "function" && typeof exports === "object" && typeof module === "object") {
        factory(require("routerjs"), exports);
    //AMD
    } else if (typeof define === "function" && define.amd) {
        define(["routerjs", "exports"], factory);
    //normal script tag
    } else {
        kospa = "undefined" === typeof kospa ? {} : kospa;
        factory(ko, kospa);
    }
}(function(ko, exports) {

	exports.providers = exports.providers || {};

	exports.providers.RouterJs = (function () {
		var r, router;

		router = new Router(),
		r = {};

		// any setup needed
		// returns the root url
		r.init = function () {
			// call the initial route handler
			router.checkRoutes(History.getState());
			return History.getRootUrl();
		};

		// should returns a params object of matched values
		r.register = function (url, callback) {
			// since routerjs passes the params in the arguments, we must reparse
			var params = {};
			router.route(url, function() {
				var parts = url.match(/[\*|:][^\/]+/g);
				if (parts) {
					for (var i = 0; i < parts.length; i += 1) {
						params[parts[i].substring(1)] = arguments[i];
					}
				}
				callback(params);
			});
		};

		// the resolve method must replace the url with any data passed in
		r.resolve = function (url, data) {
			var result = url, prop, params = [":", "*"], p = 0;
			for (p = 0; p < params.length; p += 1) {
		        if (url.indexOf(params[p]) !== -1) {
		            for (prop in data) {
		                if (url.indexOf(params[p] + prop) !== -1) {
		                    result = result.replace(params[p] + prop, data[prop]);
		                }
		            }
		        }
			}
	        return result;
		};

		// 
		r.navigate = function (url, data) {
			var result = r.resolve(url, data);
	        router.navigate.call(router, result, true);
		};
		
		r.handleLinkNavigate = function (event) {
			var
	          $this = $(this),
	          url = $this.attr('href'),
	          title = $this.attr('title');

	        if (event.which == 2 || event.metaKey) { 
	        	return true; 
	        }

	        History.pushState(null, title ,url);
	        event.preventDefault();
	        return false;
		};

		r.routeParamIndexOf = function () {

		};

		r.reset = function() {
			router = new Router();
		};

		return r;
	})();

}));
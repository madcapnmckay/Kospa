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
    
// import("kospa.routing.js");
// import("kospa.animations.js");
// import("kospa.panes.js");\
// import("kospa.application.js");\

}));
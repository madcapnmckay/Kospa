
describe("Kospa Routing", function() {


	describe("When instantiating of kospa.RouteFactory", function () { 
	  	var factory;

		beforeEach(function () {
		});

		it("should have a public route function", function() {
			expect(typeof kospa.route).toEqual("function");
		});

		it("should have a public navigate function", function() {
			expect(typeof kospa.navigate).toEqual("function");
		});

		it("should have a public resolve function", function() {
			expect(typeof kospa.resolve).toEqual("function");
		});
	});

	describe("When instantiating a kospa.Route", function () { 
	  	var factory, route, provider;

		beforeEach(function () {
		    route = kospa.Route({ url: "/someurl", name: "RouteName" });
		});
		
		it("should have a public url property", function() {
		    expect(route.url).toBeDefined();
		    expect(route.url).toEqual("/someurl");
		});

		it("should have a public name property", function() {
		    expect(route.name).toBeDefined();
		    expect(route.name).toEqual("RouteName");
		});

		it("should call the providers register method", function() {
		    spyOn(kospa.defaults.routeProvider, 'register');
		    var route2 = kospa.Route({ url: "/someurl2", name: "RouteName2" });

		    expect(kospa.defaults.routeProvider.register).toHaveBeenCalled();
		    expect(kospa.defaults.routeProvider.register.mostRecentCall.args[0]).toEqual("/someurl2");
		}); 
	});

	describe("When adding a route", function () { 

		beforeEach(function () {    
			kospa.clearRoutes();
		});

		it("should throw an error when a duplicate name is passed", function() {
		    kospa.route("RouteName4", "/someroute4");

		    expect(function(){ kospa.route("RouteName4", "/somedifferenturl"); })
		    	.toThrow(new Error("A route with the name RouteName4 already exists"));
		});

		it("should throw an error when a duplicate url is passed", function() {
		    kospa.route("RouteName5", "/someroute5");

		    expect(function(){ kospa.route("RouteDifferentRouteName", "/someroute5"); })
		    	.toThrow(new Error("A route with the url /someroute5 already exists"));
		});


		it("should throw an error when an invalid route name is used", function() {

		    expect(function(){ kospa.route("AppRoute", "/someroute5"); })
		    	.toThrow(new Error("AppRoute is a reserved event name, please choose a different name"));
		    expect(function(){ kospa.route("AppDispatch", "/someroute5"); })
		    	.toThrow(new Error("AppDispatch is a reserved event name, please choose a different name"));
		   	expect(function(){ kospa.route("AppStart", "/someroute5"); })
		    	.toThrow(new Error("AppStart is a reserved event name, please choose a different name"));
		});
	});

	describe("When navigating to a route that doesn't exist", function () { 
		var service;

	  	beforeEach(function () {
		    kospa.clearRoutes();
		    kospa.route("RouteName", "/routename/:id");
		});


		it("should throw an error when navigating to a route that doesn't exist", function() {

		    expect(function(){ kospa.navigate("NonexistentRoute", { id : 555 }); })
		    	.toThrow(new Error("A route with the name NonexistentRoute does not exist"));
		});
	});

	describe("When navigating to a route", function () { 
	  	var service;

	  	beforeEach(function () {
		    kospa.clearRoutes();
		    kospa.route("RouteName", "/routename/:id");
		    kospa.route("RouteName2", "/routename2/:id");
		});

		it("should dispatch the AppRoute handlers", function() {
			var spy = jasmine.createSpy();
		    kospa.subscribeTo("AppRoute", spy);


		    var data = { id: 666 };
			kospa.navigate("RouteName", data);
			expect(spy).toHaveBeenCalled();
			expect(spy.mostRecentCall.args[0]).toEqual("RouteName");
			expect(spy.mostRecentCall.args[1].id).toEqual("666");
			expect(spy.mostRecentCall.args.length).toEqual(2);
			History.back();
		});

		it("should call subscribing handler", function() {
			var spy = jasmine.createSpy();
		    kospa.subscribeTo("RouteName2", spy);


		    var data = { id: 666 };
			kospa.navigate("RouteName2", data);
			expect(spy).toHaveBeenCalled();
		    expect(spy.mostRecentCall.args[0].id).toEqual("666");
		    expect(spy.mostRecentCall.args.length).toEqual(1);
		    History.back();
		});
	});

	describe("When binding to a postbox value", function () { 
	  	var model, topic = "someTopic";

	  	beforeEach(function () {
	  		delete ko.postbox.topicCache[topic];
		    model = (function() {
		    	var m = {};
		    	m.target = ko.observable().bindTo("someTopic.target");
		    	return m;
		    }());
		});

		it("should result in a falsy value if the param does not exist", function() {
			ko.postbox.publish(topic, { notTarget: 555 });
			expect(ko.utils.unwrapObservable(model.target)).toBeFalsy();			
		});

		it("should bind the correct value", function() {
			ko.postbox.publish(topic, { target: 555 });
			expect(ko.utils.unwrapObservable(model.target)).toEqual(555);	
		});
	});
});
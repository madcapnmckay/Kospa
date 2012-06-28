
/*var expect = require('expect.js');
var sinon = require('sinon');
var ko = require('knockout');
var kospa = require(__dirname + "/../lib/kospa");
*/
describe("Kospa Application", function() {

	describe("When instantiation", function() {
		beforeEach(function () {
			delete ko.postbox.topicCache["AppStart"];
		});

		it("should have a public start function", function() {
			expect(typeof kospa.start).toEqual("function");
		});

		it("should have a public route function", function() {
			expect(typeof kospa.route).toEqual("function");
		});

		it("should have a public publish function", function() {
			expect(typeof kospa.publish).toEqual("function");
		});

		it("should have a public subscribeTo function", function() {
			expect(typeof kospa.subscribeTo).toEqual("function");
		});

		it("should have a public navigate function", function() {
			expect(typeof kospa.navigate).toEqual("function");
		});
	});

	describe("When starting the application", function () { 
		var model, mockFactory;

	  	beforeEach(function () {
			delete ko.postbox.topicCache["AppStart"];
		    model = {};
		});

		it("should call ko applyBindings with parent model", function() {
			spyOn(ko, "applyBindings");
			kospa.start(model);

			expect(ko.applyBindings).toHaveBeenCalledWith(model);
		});

		it("should call the providers init method", function() {
			spyOn(kospa.defaults.routeProvider, "init");

			kospa.start(model);

			expect(kospa.defaults.routeProvider.init).toHaveBeenCalled();
		});

		it("should publish the AppStart event", function() {
			var spy = jasmine.createSpy();
			kospa.subscribeTo("AppStart", spy);
			kospa.start(model);

			expect(spy).toHaveBeenCalledWith(model);
		});

		it("should set the debug flag correctly", function() {		
			expect(kospa.debug).toBeFalsy();
			kospa.start(model, true);
			expect(kospa.debug).toBeTruthy();
		});
	});
});
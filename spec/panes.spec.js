describe("Kospa Panes", function() {


	describe("When instantiating of kospa.panes.PaneFactory", function () { 
	  	var service, target;

		beforeEach(function () {
		});

		it("should have a public createPane method", function() {
			expect(kospa.createPane).toBeDefined();
			expect(typeof kospa.createPane).toEqual("function");
		});
	});

	describe("When configuring a pane", function () { 
	  	var pane, dom;

		beforeEach(function () {
			kospa.panes = {};
			dom = document.createElement("div")
		    ko.bindingHandlers.pane.init(dom, function() { return "paneName" });
		    pane = kospa.panes.paneName;
		});
		
		it("should create a pane object with the same name", function() {
			expect(pane).toBeDefined();
		});

		it("should have a public render method", function() {
			expect(pane.render).toBeDefined();
			expect(typeof pane.render).toEqual("function");
		});

		it("should have a public createView method", function() {
			expect(pane.createView).toBeDefined();
			expect(typeof pane.createView).toEqual("function");
		});

		it("should have a public find method", function() {
			expect(pane.find).toBeDefined();
			expect(typeof pane.find).toEqual("function");
		});

		it("the container should get the correct css class", function() {
			expect($(dom).hasClass("kospa-pane")).toBeTruthy();
		});

		it("the container should get a child element with class kospa-slider", function() {
			expect($(dom).find(".kospa-slider").length === 1).toBeTruthy();
		});

		it("should throw an error when the same pane is registered again", function() {
		    expect(function(){  ko.bindingHandlers.pane.init(document.createElement("div"), function() { return "paneName" }); })
		    	.toThrow(new Error("A pane with the same name has already been registered"));
		});
	});

	describe("When calling render on a pane", function () { 
	  	var pane, element;

		beforeEach(function () {
		    kospa.panes = {};
			element = document.createElement("div");
			var script= document.createElement('script');
			script.type='text/html';
			script.id = "some_template";
			$("body").append(script);

		    ko.bindingHandlers.pane.init(element, function() { return "left" });
		    pane = kospa.panes.left;
		});
		
		it("should add a view entry to the views collection with the correct values", function() {			
			var model = {}, found, template = "some_template";
			found = pane.find(template, model);
			expect(found).toBeFalsy();

			pane.render({ template: template, model: model });
			found = pane.find(template, model);

			expect(found).toBeDefined();
			expect(found.template).toEqual(template);
			expect(found.model === model).toBeTruthy();
		});

		it("should throw an error when the no template is supplied", function() {
		    expect(function(){  pane.render({}); })
		    	.toThrow(new Error("A view template must be supplied"));
		});

		it("should append a div to the containing pane element", function() {	
			var model = {};
			var def = { template: "some_template", model: model };
			pane.render(def);
			var div = $(element).find(".kospa-slider div");

			expect(div).toBeDefined();
			expect(div.length).toEqual(1);
		});

		it("should call the supplied animation's run method", function() {	
			var animation = {};
			var model = {};
			animation.run = jasmine.createSpy();
			var def = { template: "some_template", model: model, animation: animation };
			pane.render(def);

			expect(animation.run).toHaveBeenCalled();
		});

		it("should call the default animation run if none is supplied", function() {	
			var model = {};
			spyOn(kospa.animations.show, "run");
			var def = { template: "some_template", model: model };
			pane.render(def);

			expect(kospa.animations.show.run).toHaveBeenCalled();
		});

		it("the beforeShow handler should be called on the viewmodel", function() {	
			var model = {}, template = "some_template";
			model.beforeShow = jasmine.createSpy();
			var def = { template: template, model: model };
			pane.render(def);
			var view = pane.find(def.template, def.model);

			expect(model.beforeShow.mostRecentCall.args[0]).toEqual(view.element);
		});

		it("the afterShow handler should be called on the viewmodel", function() {	
			var model = {};
			model.afterShow = jasmine.createSpy();
			var def = { template: "some_template", model: model };
			pane.render(def);
			var view = pane.find(def.template, def.model);

			expect(model.afterShow.mostRecentCall.args[0]).toEqual(view.element);
		});

		it("the beforeHide handler should be called on the viewmodel", function() {	
			var model1 = {};
			model1.beforeHide = jasmine.createSpy();
			var def1 = { template: "some_template", model: model1 };
			pane.render(def1);
			var view = pane.find(def1.template, def1.model);

			var model2 = {};
			var def2 = { template: "some_template", model: model2 };
			pane.render(def2);

			expect(model1.beforeHide.mostRecentCall.args[0]).toEqual(view.element);
		});

		it("the afterHide handler should be called on the viewmodel", function() {	
			var model1 = {};
			model1.afterHide = jasmine.createSpy();
			var def1 = { template: "some_template", model: model1 };
			pane.render(def1);

			var view = pane.find(def1.template, def1.model);

			var model2 = {};
			var def2 = { template: "some_template", model: model2 };
			pane.render(def2);

			expect(model1.afterHide.mostRecentCall.args[0]).toEqual(view.element);
		});

		it("should call ko.renderTemplate", function() {	
			var model = {};
			spyOn(ko, "renderTemplate");

			var def = { template: "some_template", model: model };
			pane.render(def);

			expect(ko.renderTemplate).toHaveBeenCalled();
			expect(ko.renderTemplate.mostRecentCall.args[0]).toEqual("some_template");
			expect(ko.renderTemplate.mostRecentCall.args[1]).toEqual(model);
		});


		afterEach(function () {
		    $("#some_template").remove();
		});
	});
});
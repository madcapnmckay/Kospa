describe("Kospa Routerjs", function() {

	describe("When instantiating of RouterJs provider", function () { 
	  	var provider = kospa.providers.RouterJs;

		beforeEach(function () {
			provider.reset();
		});

		it("should have a public init method", function() {
			expect(provider.init).toBeDefined();
			expect(typeof provider.init).toEqual("function");
		});

		it("should have a public register method", function() {
			expect(provider.register).toBeDefined();
			expect(typeof provider.register).toEqual("function");
		});

		it("should have a public resolve method", function() {
			expect(provider.resolve).toBeDefined();
			expect(typeof provider.resolve).toEqual("function");
		});

		it("should have a public navigate method", function() {
			expect(provider.navigate).toBeDefined();
			expect(typeof provider.navigate).toEqual("function");
		});

		it("should have a public handleLinkNavigate method", function() {
			expect(provider.handleLinkNavigate).toBeDefined();
			expect(typeof provider.handleLinkNavigate).toEqual("function");
		});

		it("should have a public routeParamIndexOf method", function() {
			expect(provider.routeParamIndexOf).toBeDefined();
			expect(typeof provider.routeParamIndexOf).toEqual("function");
		});
	});

	describe("When resolving a url", function () { 
	  	var provider = kospa.providers.RouterJs;

		beforeEach(function () {
			provider.reset();
		});

		it("it should return the correct value", function() {
			expect(provider.resolve("/someurl/:param1", { param1: "foo" }))
				.toEqual("/someurl/foo");
			expect(provider.resolve("/someurl/:param1/:param2", { param1: "foo", param2: "bar" }))
				.toEqual("/someurl/foo/bar");
			expect(provider.resolve("/someurl/:param1/:param2", { param1: 56, param2: "bar" }))
				.toEqual("/someurl/56/bar");
			expect(provider.resolve("/someurl/*param1", { param1: "catchall" }))
				.toEqual("/someurl/catchall");
		});
	});

});
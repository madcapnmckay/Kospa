
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

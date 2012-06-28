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
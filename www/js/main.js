/**
 * Copyleft Will Morgan
 * Just some hand written JS to show I know more than jQuery...
 * Hey you just read this but this is crazy, but if you like it, then hire me maybe?
 */
(function() {
	var DOMTools = {
		/**
		 * @param string selector (like .der-really-cool-klass-ja)
		 * @return []<DOMElement>
		 */
		find: document.querySelectorAll,
		/**
		 * @param DOMElement element
		 * @param string selector (like .der-really-cool-klass-ja)
		 * @return boolean
		 */
		matches: function(element, selector) {
			var matches, i;
			if('matches' in element) {
				return element.matches(selector);
			}
			return DOMTools._oldMatches(element, selector);
		},
		/**
		 * Fallback for browsers that don't support DOMElement.matches
		 * @param DOMElement element
		 * @param string selector (like .der-really-cool-klass-ja)
		 * @return boolean
		 */
		_oldMatches: function(element, selector) {
			var owner = element.document || element.ownerDocument || document;
			var matches = owner.querySelectorAll(selector);
			var i = 0;

			while(matches[i] && matches[i] !== element) {
				++i;
			}
			return !!matches[i];
		},
		/**
		 * Delegates events, and looks up the node chain to do so if needed.
		 * Basically like jQuery.delegate, except not massive.
		 * {@see DOMTools._delegateListener}
		 * @param string target
		 * @param string ev
		 * @param function callback (takes the event and matching node as args)
		 * @return void
		 */
		delegate: function(target, ev, callback) {
			document.addEventListener(
				ev,
				DOMTools._delegateListener(
					callback,
					target
				)
			);
		},
		/**
		 * @param function callback (takes the event and matching node as args)
		 * @param string target
		 * @return function
		 */
		_delegateListener: function(callback, target) {
			return function(event) {
				var currentNode = event.target,
					nodeMatches;

				// Visit the ancestors in case we're inside a nested child
				while(
					!(nodeMatches = DOMTools.matches(currentNode, target)) &&
					currentNode.parentNode && currentNode != document
				) {
					currentNode = currentNode.parentNode;
					if(!currentNode) {
						break;
					}
				}

				if(nodeMatches) {
					callback(event, currentNode);
				}
			};
		},
	};
	/**
	 * Enlarge the portfolio item, or something.
	 */
	var triggerPortfolioFullscreen = function(event, currentNode) {

	};
	DOMTools.delegate(
		'.js-trigger-portfolio-fullscreen',
		'click',
		triggerPortfolioFullscreen
	);
}());

/**
 * Copyleft Will Morgan
 * Just some hand written JS to show I know more than jQuery...
 * Hey you just read this but this is crazy, but if you like it, then hire me maybe?
 */
(function() {
	var DOMTools = {
		/**
		 * @param string selector (like .der-really-cool-klass-ja)
		 * @param DOMElement scope (leave null for document)
		 * @return NodeList
		 */
		find: function(selector, scope) {
			scope = scope || document;
			return scope.querySelectorAll(selector);
		},
		/**
		 * {@see DOMTools.find}
		 * @return DOMElement|null the first element
		 */
		findOne: function(selector, scope) {
			var results = DOMTools.find(selector, scope);
			return (results && results.item(0)) || null;
		},
		closest: function(selector, scope) {
			var currentScope = scope;
			do {
				if(currentScope.matches(selector)) {
					return currentScope;
				}
				currentScope = currentScope.parentNode;
			}
			while(
				currentScope.parentNode && currentScope != document
			);
		},
		/**
		 * @param string selector (like .der-really-cool-klass-ja)
		 * @param DOMElement element
		 * @return boolean
		 */
		matches: function(selector, element) {
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
				var delegator = DOMTools.closest(target, event.target);
				if(delegator) {
					callback(event, delegator);
				}
			};
		},
	};
	/**
	 * Enlarge the portfolio item, or something.
	 */
	var triggerPortfolioFullscreen = function(event, currentNode) {
		var figure = DOMTools.findOne('figure', currentNode);
		var container = DOMTools.closest('.js-portfolio-container', currentNode);
		var frame = DOMTools.findOne('.js-portfolio-fullscreen', container);
		frame.innerHTML = figure.outerHTML;
		frame.offsetHeight;
		container.classList.add('state-portfolio--fullscreen');
	};
	/**
	 * Hide the portfolio item
	 */
	var hidePortfolioFullscreen = function(event, currentNode) {
		var container = DOMTools.closest('.js-portfolio-container', currentNode);
		if(event.target != currentNode) {
			return;
		}
		container.classList.remove('state-portfolio--fullscreen');
	};
	DOMTools.delegate(
		'.js-trigger-portfolio-fullscreen',
		'click',
		triggerPortfolioFullscreen
	);
	DOMTools.delegate(
		'.state-portfolio--fullscreen .js-portfolio-fullscreen',
		'click',
		hidePortfolioFullscreen
	);
}());

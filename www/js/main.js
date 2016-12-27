'use strict';

var Blazy = require('./blazy.min');
var FastClick = require('./fastclick-1.0.3');

require('../css/normalize.css');
require('../css/all.css');
require('../css/devicons.css');
require('../css/stripes.css');
require('../css/spinner.css');

/* global ga, Blazy, FastClick */
(function() {
	var DOMTools = {
		/**
		 * @param string selector (like .der-really-cool-klass-ja)
		 * @param DOMElement scope (leave null for document)
		 * @return NodeList
		 */
		find: function(selector, scope) {
			scope = scope || document;
			return [].slice.call(scope.querySelectorAll(selector));
		},
		/**
		 * {@see DOMTools.find}
		 * @return DOMElement|null the first element
		 */
		findOne: function(selector, scope) {
			var results = DOMTools.find(selector, scope);
			return (results && results[0]) || null;
		},
		closest: function(selector, scope) {
			var currentScope = scope;
			do {
				if(DOMTools.matches(selector, currentScope)) {
					return currentScope;
				}
			}
			while(
				(currentScope = currentScope.parentNode) && currentScope != document
			);
		},
		/**
		 * @param string selector (like .der-really-cool-klass-ja)
		 * @param DOMElement element
		 * @return boolean
		 */
		matches: function(selector, element) {
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
			var events = ev.split(' ');
			var i;
			if(events.length > 1) {
				for(i in events) {
					DOMTools.delegate(target, events[i], callback);
				}
				return;
			}
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
		/**
		 * @param string html
		 * @return Node
		 */
		createFromHTML: function(html) {
			var fragment = document.createElement('div');
			fragment.innerHTML = html;
			return fragment.firstChild;
		}
	};
    /**
     * Analytics tracking
     */
    var trackEvent = function(eventType, category, label, value) {
        ga('send', 'event', category, eventType, label, value);
        console.log('trackEvent', [].slice.call(arguments));
    };
    DOMTools.delegate(
        '.js-ga-event',
        'click',
        function(event, element) {
            var category = element.getAttribute('data-ga-category');
            var label = element.getAttribute('data-ga-label') || '';
            var value = element.getAttribute('data-ga-value') || '';
            trackEvent(event.type, category, label, value);
        }
    );
	/**
	 * Enlarge the portfolio item, or something.
	 */
	var triggerPortfolioFullscreen = function(event, currentNode) {
        ++triggerPortfolioFullscreen.invokeCount;
		var figure = DOMTools.findOne('figure', currentNode);
		var image = DOMTools.findOne('img', figure);
		var container = DOMTools.closest('.js-portfolio-container', currentNode);
		var frame = DOMTools.findOne('.js-portfolio-fullscreen', container);
		var target = DOMTools.findOne('.js-portfolio-fullscreen-target', frame);
		var large = DOMTools.createFromHTML('<img src="'+image.getAttribute('data-large')+'" class="img--large" />');
		target.innerHTML = figure.outerHTML;
		var targetImage = DOMTools.findOne('img', target);
		large.onload = function() {
			this.classList.add('b-loaded');
		};
		targetImage.parentNode.insertBefore(large, targetImage.nextSibling);

		target.offsetHeight;
		container.classList.add('state-portfolio--fullscreen');
        trackEvent('click', 'portfolio-screenshot', image.getAttribute('alt'), triggerPortfolioFullscreen.invokeCount);
	};
    triggerPortfolioFullscreen.invokeCount = 0;
	/**
	 * Hide the portfolio item
	 */
	var backgroundHide = function(event, currentNode) {
		if(event.target != currentNode) {
			return;
		}
		hidePortfolioFullscreen(event, currentNode);
	};
	var hidePortfolioFullscreen = function(event, currentNode) {
		var container = DOMTools.closest('.js-portfolio-container', currentNode);
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
		backgroundHide
	);
	DOMTools.delegate(
		'.js-portfolio-close',
		'click',
		hidePortfolioFullscreen
	);
	/**
	 * Lazy loading (using Blazy)
	 */
	var images = DOMTools.find('.portfolio__screens img'),
		image,
		panel,
		i;

	var loaderHTML = '<div class="loader"></div>';

	for(i in images) {
		image = images[i];
		image.setAttribute('data-src', image.getAttribute('src'));
		image.removeAttribute('srcset');
		image.classList.add('img--loading');
		image.setAttribute(
			'src',
			'data:image/gif;base64,R0lGODlhAQABAIAAAP///wAAACwAAAAAAQABAAACAkQBADs='
		);
		image.parentNode.insertBefore(
			DOMTools.createFromHTML(loaderHTML),
			image.nextSibling
		);
	}

	var panels = DOMTools.find('.ui-background-cover');
	for(i in panels) {
		panel = panels[i];
		panel.setAttribute('data-src', panel.style.backgroundImage);
	}

	new Blazy({
		selector: '.portfolio__screens img'
	});

	/**
	 * Smooth scrolling
	 */
	DOMTools.delegate('.js-smoothscroll', 'click', function(ev, element) {
		if (!element.scrollIntoView) {
			return;
		}
		document.getElementById(element.href.split('#').pop()).scrollIntoView({
			behavior: 'smooth',
			block: 'start'
		});
		ev.preventDefault();
	});

	FastClick.attach(document.body);

}());

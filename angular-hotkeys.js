(function() {
	'use strict';

	var hotKeys = angular.module('drahak.hotkeys', []);

	hotKeys.directive('hotkey', ['$parse', '$hotkey', 'HotKeys', function($parse, $hotkey, HotKeys) {
		return {
			restrict: 'AE',
			link: function(scope, element, attrs) {
				var invoker = $parse(attrs.invoke);

				var entityManager = $hotkey;
				var hotKey = attrs.bind;
				if (element[0].nodeName.toLowerCase() !== 'hotkey') {
					entityManager = HotKeys(element);
					hotKey = attrs.hotkey;
				}

				entityManager.bind(hotKey, function(e) {
					invoker(scope, { $event: e });
				});
			}
		}
	}]);

	hotKeys.factory('HotKeys', ['ParseKey', '$rootScope', '$window', function(ParseKey, $rootScope, $window) {

		/**
		 * @param {HTMLElement} element
		 * @constructor
		 */
		var HotKeys = function(element) {
			this._hotKeys = {};
			var keys = [];

			angular.element($window).bind('blur', function() { keys = []; });
			element.bind('keydown', function(e) {
				if (keys.indexOf(e.keyCode) === -1) keys.push(e.keyCode);
				this.trigger(keys, [e]);
			}.bind(this));

			element.bind('keyup', function(e) {
				keys.splice(keys.indexOf(e.keyCode), 1);
			}.bind(this));
		};

		/**
		 * Get hot key index
		 * @param {String|Array.<Number>} hotKeyExpr
		 * @returns {String}
		 * @private
		 */
		HotKeys.prototype._getHotKeyIndex = function(hotKeyExpr) {
			var hotKey;
			if (angular.isString(hotKeyExpr)) {
				hotKey = ParseKey(hotKeyExpr);
			} else if (angular.isArray(hotKeyExpr)) {
				hotKey = hotKeyExpr;
			} else {
				throw new Error('HotKey expects hot key to be string expression or key codes array, ' + typeof(hotKeyExpr) + ' given.');
			}
			return hotKey.sort().join('+');
		};

		/**
		 * Register hot key handler
		 * @param {String|Array.<Number>} hotKey
		 * @param {Function} callback
		 * @returns this
		 */
		HotKeys.prototype.bind = function(hotKey, callback) {
			hotKey = this._getHotKeyIndex(hotKey);
			if (!this._hotKeys[hotKey]) {
				this._hotKeys[hotKey] = [];
			}
			this._hotKeys[hotKey].push(callback);
			return this;
		};

		/**
		 * Remove registered hot key handlers
		 * @param {String|Array.<Number>} hotKey
		 * @returns this
		 */
		HotKeys.prototype.unbind = function(hotKey) {
			hotKey = this._getHotKeyIndex(hotKey);
			this._hotKeys[hotKey] = [];
			return this;
		};

		/**
		 * Trigger hot key handlers
		 * @param {String|Array.<Number>} hotKey
		 * @param {Array} [args]
		 */
		HotKeys.prototype.trigger = function(hotKey, args) {
			args = args || [];
			hotKey = this._getHotKeyIndex(hotKey);
			angular.forEach(this._hotKeys[hotKey], function(callback) {
				callback.apply(callback, args);
			});

			if (!$rootScope.$$phase) {
				$rootScope.$apply();
			}
		};

		return function(element) {
			return new HotKeys(element);
		}
	}]);

	hotKeys.factory('$hotkey', ['$window', 'HotKeys', function($window, HotKeys) {
		return HotKeys(angular.element($window));
	}]);

	hotKeys.service('ParseKey', function() {
		var lexer = {
			'backspace': 8,
			'return': 8,
			'tab': 9,
			'tabulator': 9,
			'enter': 13,
			'shift': 16,
			'ctrl': 17,
			'control': 17,
			'alt': 18,
			'esc': 27,
			'escape': 27,
			'left': 37,
			'up': 38,
			'right': 39,
			'down': 40,
			'insert': 45,
			'del': 46,
			'delete': 46
		};

		return function(expression) {
			var keys = [];
			var expressions = expression.split('+');
			
			angular.forEach(expressions, function(expr) {
				expr = expr.trim().toLowerCase();
				if (lexer[expr]) {
					keys.push(lexer[expr]);
				} else if (expr.length === 1) {
					keys.push(expr.toUpperCase().charCodeAt(0));
				} else {
					throw new Error('ParseKey expects one character or special expression like "Tab" or "Control", "' + expr + '" given');
				}
			});

			return keys;
		};
	});

})();
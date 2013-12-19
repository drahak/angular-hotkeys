'use strict';

(function() {

	var hotkeys = angular.module('drahak.hotkeys', []);

	hotkeys.service('HotkeyParse', function() {
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
				expr = expr.trim();
				if (lexer[expr.toLowerCase()]) {
					keys.push(lexer[expr.toLowerCase()]);
				} else if (expr.length === 1) {
					keys.push(expr.charCodeAt(0));
				} else {
					throw new Error('HotkeyParse expects one character or special expression like "Tab" or "Control", "' + expr + '" given');
				}
			});

			return keys;
		};
	});

})();
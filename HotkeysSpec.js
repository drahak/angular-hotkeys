'use strict';

describe('ParseKey expression parser', function() {

	var parse;
	beforeEach(module('drahak.hotkeys'));
	beforeEach(inject(function(ParseKey) {
		parse = ParseKey;
	}));

	it('parses string into keycodes array', function() {
		var keys = parse('B + A');
		expect(keys).toEqual([66, 65]);
	});

	it('parses control key', function() {
		var ctrl = parse('Ctrl');
		var control = parse('Control');
		expect(ctrl).toEqual([17]);
		expect(control).toEqual([17]);
	});

	it('parses shift key', function() {
		var shift = parse('Shift');
		var lowercase = parse('shift');
		expect(shift).toEqual([16]);
		expect(lowercase).toEqual([16]);
	});

	it('parses alt key', function() {
		var alt = parse('Alt');
		var lowercase = parse('alt');
		expect(alt).toEqual([18]);
		expect(lowercase).toEqual([18]);
	});

	it('parses escape key', function() {
		var esc = parse('Esc');
		var escape = parse('Escape');
		expect(esc).toEqual([27]);
		expect(escape).toEqual([27]);
	});

	it('parses enter key', function() {
		var enter = parse('Enter');
		expect(enter).toEqual([13]);
	});

	it('parses tab key', function() {
		var tab = parse('Tab');
		var tabulator = parse('Tabulator');
		expect(tab).toEqual([9]);
		expect(tabulator).toEqual([9]);
	});

	it('parses delete key', function() {
		var del = parse('Del');
		var deleteKey = parse('Delete');
		expect(del).toEqual([46]);
		expect(deleteKey).toEqual([46]);
	});

	it('parses insert key', function() {
		var insert = parse('Insert');
		expect(insert).toEqual([45]);
	});

	it('parses arrow keys', function() {
		var arrows = parse('left + up + right + down');
		expect(arrows).toEqual([37, 38, 39, 40]);
	});

});

describe('HotKey event manager', function() {

	var hotKey;
	beforeEach(module('drahak.hotkeys'));
	beforeEach(inject(function(HotKey) {
		var elementFake = {
			bind: function() {}
		};
		hotKey = HotKey(elementFake);
	}));

	it('triggers registered event handler', function() {
		var handler = jasmine.createSpy();
		hotKey.on('Ctrl + S', handler);
		hotKey.trigger('Ctrl + S');

		expect(handler).toHaveBeenCalled();
	});

	it('removes registered event handler', function() {
		var handler = jasmine.createSpy();
		hotKey.on('Ctrl + S', handler);
		hotKey.off('S + Ctrl');
		hotKey.trigger('Ctrl + S');
		expect(handler).not.toHaveBeenCalled();
	});

	it('registers hot key using key codes array', function() {
		var handler = jasmine.createSpy();
		hotKey.on([13], handler);
		hotKey.trigger('Enter');
		expect(handler).toHaveBeenCalled();
	});

	it('throws error if invalid hot key is given', function() {
		var callback = function() {
			hotKey.on(13, function(){});
		};
		expect(callback).toThrow();
	});

});
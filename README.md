AngularJS hotkeys [![Build status](https://api.travis-ci.org/drahak/angular-hotkeys.png)](https://travis-ci.org/drahak/angular-hotkeys)
=================

Installation & setup
--------------------
Add dependency to your angular module.

```js
angular.module('myAwesomeApp', ['drahak.hotkeys']);
```

Hot keys expression & events
----------------------------
To register hot key use `$hotkey` service e.g. include it as dependency in your controller. The `$hotkey` service is instance of `HotKey` using $window element as its scope. You can also use `HotKey(Element)` factory to observe hot keys just in scope of the element.

```js
$hotkey.bind('Ctrl + B', function(event) {
    // your handler here
});
```

Note the string expression in first argument. Service (namely `ParseKey`) parses it into key codes array. As you can see it uses `+` sign to separate keys. There are some special expressions like Ctrl, Shift, Up, Left, Esc or even Escape. It's **not** case sensitive.

```
Ctrl + Shift + E
Control + escape + a
Shift + A
A+B
E +r
```

Directive
---------
You can also use it as directive. Simply define hot key expression in `hotkey` attribute and action in `invoke` attribute. As in any AngularJS event you can use `$event` variable to access Event object.

```html
<div hotkey="Esc" invoke="close($event)"></div>
<hotkey bind="Esc" invoke="close($event)"  />
```

**Note:*** the hotkey directive can be used as element or attribute. If it's used as attribute, it will observe key events **only on given element**. Otherwise it will use `$window` element.
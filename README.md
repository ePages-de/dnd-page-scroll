# Use case
If you are using HTML5 drag and want to drop into an element not visible in the viewport,
it is not possible on most browsers. On Google Chrome you can. Moving the dragged element
near the top or bottom of the viewport will scroll the page. But other browsers don't do
that. With this library, you now can.

## [Demo](http://ePages-de.github.io/dnd-page-scroll/demo.html)

# How to use
```html
<script src="lib/dnd-page-scroll.js"></script>
<script>dndPageScroll.default(/*{...options}*/)</script>
```

This is a [UMD](https://github.com/umdjs/umd) module.

## How it works
The library creates invisible elements top and bottom of the viewport.
These bind the dragover event to scroll the page.

## Options
- `height`: Height of the invisible elements. Defaults to `'50px'`.
- `scrollBy`: Scoll by `x` pixels. Defaults to `50`.
- `delay`: Scroll every `x` milliseconds. Defaults to `25`.
- `topId`: Id attribute of the top invisible element. Defaults to `'dnd-page-scroll-top'`.
- `bottomId`: Id attribute of the bottom invisible element. Defaults to `'dnd-page-scroll-bottom'`.
- `namespace`: A string appended to the above ids. Defaults to an empty string. Required for having multiple plugin instances.
- `node`: The scrollable area. Defaults to `document.body`.
- `listenGlobally`: When set to `false`, only listen to drag events within `node`. Useful when having multiple plugin instances. Defaults to `true`.

# Browser support
Tested in latest Firefox, Edge, IE, Safari, and Chrome

## Original idea
[Martin Drapeau](https://github.com/martindrapeau/jQueryDndPageScroll)

License: [MIT](http://en.wikipedia.org/wiki/MIT_License)

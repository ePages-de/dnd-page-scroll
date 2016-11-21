(function (global, factory) {
  if (typeof define === "function" && define.amd) {
    define(['exports'], factory);
  } else if (typeof exports !== "undefined") {
    factory(exports);
  } else {
    var mod = {
      exports: {}
    };
    factory(mod.exports);
    global.dndPageScroll = mod.exports;
  }
})(this, function (exports) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });

  exports.default = function () {
    var _options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

    var defaults = {
      node: document.body,
      topId: 'dnd-page-scroll-top',
      bottomId: 'dnd-page-scroll-bottom',
      namespace: '',
      delay: 25,
      scrollBy: 50,
      height: '50px',
      listenGlobally: true
    };
    var options = _extends({}, defaults, _options);
    options.topId += options.namespace;
    options.bottomId += options.namespace;

    var eventDelegate = options.listenGlobally ? document : options.node;

    var topElement = document.getElementById(options.topId) || appendElementWithId(options.topId);
    var bottomElement = document.getElementById(options.bottomId) || appendElementWithId(options.bottomId);

    hide(topElement, bottomElement);

    css({
      // backgroundColor: 'yellow',
      position: 'fixed',
      left: 0,
      right: 0,
      height: options.height,
      zIndex: 999999
    }, topElement, bottomElement);
    topElement.style.top = 0;
    bottomElement.style.bottom = 0;

    // When DnD occurs over a scroll area - scroll the page!
    var triggerScroll = options.node === document.body ? function (amount) {
      return window.scrollBy(0, amount);
    } : function (amount) {
      options.node.scrollTop += amount;
    };
    var throttledScroll = throttle(function (e) {
      return triggerScroll(e.target === topElement ? -options.scrollBy : options.scrollBy);
    }, options.delay);[topElement, bottomElement].forEach(function (el) {
      return el.addEventListener('dragover', throttledScroll);
    });

    // When a DND drag event starts, show the scroll areas
    eventDelegate.addEventListener('dragover', function (e) {
      // Don't allow dropping on scroll areas
      if (e.target === topElement || e.target === bottomElement) {
        e.dataTransfer.dropEffect = 'none';
        e.preventDefault();
      }

      return show(topElement, bottomElement);
    });

    // When DND ends, hide it.
    eventDelegate.addEventListener('dragend', function () {
      return hide(topElement, bottomElement);
    })

    // When dragging files from Explorer/Finder dragend is not triggered.
    // Work around this by hiding areas when the mouse enters one.
    ;[topElement, bottomElement].forEach(function (el) {
      return el.addEventListener('mouseover', function () {
        return hide(topElement, bottomElement);
      });
    });
  };

  var _extends = Object.assign || function (target) {
    for (var i = 1; i < arguments.length; i++) {
      var source = arguments[i];

      for (var key in source) {
        if (Object.prototype.hasOwnProperty.call(source, key)) {
          target[key] = source[key];
        }
      }
    }

    return target;
  };

  // Forked from https://github.com/martindrapeau/jQueryDndPageScroll
  // - removed jQuery dependency
  // - added possibility to scroll multiple different elements

  // Add support scrolling of page durign drag and drop (DnD) when not supported by the browser.
  // Adds invisible scroll areas top and bottom the viewport.
  // When a dragged element enters either area, scroll programmatically.

  // small DOM helpers (poor man's jQuery/lodash)
  var appendElementWithId = function appendElementWithId(id) {
    var tagName = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'div';

    var element = document.createElement(tagName);
    element.setAttribute('id', id);
    document.body.appendChild(element);

    return element;
  };
  var hide = function hide() {
    for (var _len = arguments.length, elements = Array(_len), _key = 0; _key < _len; _key++) {
      elements[_key] = arguments[_key];
    }

    return elements.forEach(function (element) {
      element.style.display = 'none';
    });
  };
  var show = function show() {
    for (var _len2 = arguments.length, elements = Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
      elements[_key2] = arguments[_key2];
    }

    return elements.forEach(function (element) {
      element.style.display = 'block';
    });
  };
  var css = function css(styles) {
    for (var _len3 = arguments.length, elements = Array(_len3 > 1 ? _len3 - 1 : 0), _key3 = 1; _key3 < _len3; _key3++) {
      elements[_key3 - 1] = arguments[_key3];
    }

    var styleAttributes = Object.keys(styles);
    elements.forEach(function (element) {
      styleAttributes.forEach(function (attr) {
        element.style[attr] = styles[attr];
      });
    });
  };
  var throttle = function throttle(fn, delay) {
    var go = true;

    return function () {
      if (!go) return;

      fn.apply(undefined, arguments);
      go = false;
      setTimeout(function () {
        go = true;
      }, delay);
    };
  };
});
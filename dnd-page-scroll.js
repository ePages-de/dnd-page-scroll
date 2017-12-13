// Forked from https://github.com/martindrapeau/jQueryDndPageScroll
// - removed jQuery dependency
// - added possibility to scroll multiple different elements

// Add support scrolling of page durign drag and drop (DnD) when not supported by the browser.
// Adds invisible scroll areas top and bottom the viewport.
// When a dragged element enters either area, scroll programmatically.

// small DOM helpers (poor man's jQuery/lodash)
const appendElementWithId = (id, tagName = 'div') => {
  const element = document.createElement(tagName)
  element.setAttribute('id', id)
  document.body.appendChild(element)

  return element
}
const hide = (...elements) => elements.forEach(element => { element.style.display = 'none' })
const show = (...elements) => elements.forEach(element => { element.style.display = 'block' })
const css = (styles, ...elements) => {
  const styleAttributes = Object.keys(styles)
  elements.forEach(element => {
    styleAttributes.forEach(attr => { element.style[attr] = styles[attr] })
  })
}

export default function (_options = {}) {
  const defaults = {
    node: document.body,
    topId: 'dnd-page-scroll-top',
    bottomId: 'dnd-page-scroll-bottom',
    namespace: '',
    delay: 25,
    scrollBy: 50,
    height: '50px',
    listenGlobally: true
  }
  const options = {...defaults, ..._options}
  options.topId += options.namespace
  options.bottomId += options.namespace

  const eventDelegate = options.listenGlobally ? document : options.node

  const topElement = document.getElementById(options.topId) || appendElementWithId(options.topId)
  const bottomElement = document.getElementById(options.bottomId) || appendElementWithId(options.bottomId)

  hide(topElement, bottomElement)

  css({
    // backgroundColor: 'yellow',
    position: 'fixed',
    left: 0,
    right: 0,
    height: options.height,
    zIndex: 999999
  }, topElement, bottomElement)
  topElement.style.top = 0
  bottomElement.style.bottom = 0

  // When DnD occurs over a scroll area - scroll the page!
  const triggerScroll = options.node === document.body
    ? amount => window.scrollBy(0, amount)
    : amount => { options.node.scrollTop += amount }

  let doScroll = null

  const clearScrollInterval = () => {
    clearInterval(doScroll)
    doScroll = null
  }

  ;[topElement, bottomElement].forEach(el => el.addEventListener('dragover', e => {
    if (doScroll == null) {
      doScroll = setInterval(() => triggerScroll(e.target === topElement ? -options.scrollBy : options.scrollBy), options.delay)
    }

    // Don't allow dropping on scroll areas
    e.dataTransfer.dropEffect = 'none'
    e.preventDefault()
  }))

  ;[topElement, bottomElement].forEach(el => el.addEventListener('dragleave', () => clearScrollInterval()))

  // When a DND drag event starts, show the scroll areas
  eventDelegate.addEventListener('dragover', e => show(topElement, bottomElement))

  // When DND ends, hide it.
  eventDelegate.addEventListener('dragend', () => {
    clearScrollInterval()
    hide(topElement, bottomElement)
  })

  // When dragging files from Explorer/Finder dragend is not triggered.
  // Work around this by hiding areas when the mouse enters one.
  ;[topElement, bottomElement].forEach(el => el.addEventListener('mouseover', () => {
    clearScrollInterval()
    hide(topElement, bottomElement)
  }))
}

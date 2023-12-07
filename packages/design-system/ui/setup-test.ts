import "@testing-library/jest-dom"
import { JSDOM } from "jsdom"
import ResizeObserver from "resize-observer-polyfill"

const { window } = new JSDOM()

window.ResizeObserver = ResizeObserver
global.ResizeObserver = ResizeObserver
window.Element.prototype.scrollTo = () => {
  // no-op
}
window.requestAnimationFrame = (cb) => setTimeout(cb, 1000 / 60)

Object.assign(global, { window, document: window.document })

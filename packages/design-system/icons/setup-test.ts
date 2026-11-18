import "@testing-library/jest-dom/vitest"
import ResizeObserver from "resize-observer-polyfill"

window.ResizeObserver = ResizeObserver
global.ResizeObserver = ResizeObserver
window.Element.prototype.scrollTo = () => {
  // no-op
}
window.requestAnimationFrame = (cb) => setTimeout(cb, 1000 / 60)

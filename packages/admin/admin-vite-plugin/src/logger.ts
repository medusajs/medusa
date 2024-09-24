import type * as Vite from "vite"

let logger: Vite.Logger = {
  warn(msg, _options) {
    console.warn(msg)
  },
  info(msg) {
    console.info(msg)
  },
  error(msg) {
    console.error(msg)
  },
  clearScreen() {
    console.clear()
  },
  hasErrorLogged() {
    return false
  },
  hasWarned: false,
  warnOnce(msg, _options) {
    if (!this.hasWarned) {
      console.warn(msg)
      this.hasWarned = true
    }
  },
}

function setLogger(l: Vite.Logger) {
  logger = l
}

export { logger, setLogger }

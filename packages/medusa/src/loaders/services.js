import { BaseService, PaymentService } from "medusa-interfaces"
import glob from "glob"
import path from "path"
import { Lifetime, asFunction } from "awilix"

/**
 * Registers all services in the services directory
 */
export default ({ container, configModule }) => {
  const isTest = process.env.NODE_ENV === "test"

  const corePath = isTest ? "../services/__mocks__/*.js" : "../services/*.js"
  const coreFull = path.join(__dirname, corePath)

  const core = glob.sync(coreFull, { cwd: __dirname })
  core.forEach(fn => {
    const loaded = require(fn).default
    const name = formatRegistrationName(fn)
    container.register({
      [name]: asFunction(
        cradle => new loaded(cradle, configModule)
      ).singleton(),
    })
  })
}

function formatRegistrationName(fn) {
  const offset = process.env.NODE_ENV === "test" ? 3 : 2

  const descriptorIndex = fn.split(".").length - 2
  const descriptor = fn.split(".")[descriptorIndex]
  const splat = descriptor.split("/")
  const rawname = splat[splat.length - 1]
  const namespace = splat[splat.length - offset]
  const upperNamespace =
    namespace.charAt(0).toUpperCase() + namespace.slice(1, -1)

  const parts = rawname.split("-").map((n, index) => {
    if (index !== 0) {
      return n.charAt(0).toUpperCase() + n.slice(1)
    }
    return n
  })
  return parts.join("") + upperNamespace
}

import { BaseService, PaymentService } from "medusa-interfaces"
import glob from "glob"
import path from "path"
import { Lifetime } from "awilix"
import { asFunction } from "awilix"

/**
 * Registers all services in the services directory
 */
export default ({ container }) => {
  let corePath = "../services/*.js"
  let appPath = "src/services/*.js"

  if (process.env.NODE_ENV === "test") {
    corePath = "../services/__mocks__/*.js"
    appPath = "src/services/__mocks__/*.js"
  }

  const corefull = path.resolve(corePath)
  const appfull = path.resolve(corePath)

  const core = glob.sync(corePath, { cwd: __dirname })
  core.forEach(fn => {
    const loaded = require(fn).default
    const name = formatRegistrationName(fn)
    container.register({
      [name]: asFunction(cradle => new loaded(cradle)),
    })
  })

  if (corefull !== appfull) {
    const files = glob.sync(appPath)
    files.forEach(fn => {
      const loaded = require(fn).default

      if (!(loaded.prototype instanceof BaseService)) {
        const logger = container.resolve("logger")
        const message = `Models must inherit from BaseModel, please check ${fn}`
        logger.error(message)
        throw new Error(message)
      }

      if (loaded.prototype instanceof PaymentService) {
        // Register our payment providers to paymentProviders
        container.registerAdd(
          "paymentProviders",
          asFunction(cradle => new loaded(cradle))
        )

        // Add the service directly to the container in order to make simple
        // resolution if we already know which payment provider we need to use
        container.register({
          [`pp_${loaded.identifier}`]: asFunction(cradle => new loaded(cradle)),
        })
      } else {
        const name = formatRegistrationName(fn)
        container.register({
          [name]: asFunction(cradle => new loaded(cradle)),
        })
      }
    })
  }
}

function formatRegistrationName(fn) {
  const descriptorIndex = fn.split(".").length - 2
  const descriptor = fn.split(".")[descriptorIndex]
  const splat = descriptor.split("/")
  const rawname = splat[splat.length - 1]
  const namespace = splat[splat.length - 2]
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

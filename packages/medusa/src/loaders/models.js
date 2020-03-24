import { BaseModel } from "medusa-interfaces"
import { Lifetime } from "awilix"
import glob from "glob"
import path from "path"
import { asFunction } from "awilix"

/**
 * Registers all models in the model directory
 */
export default ({ container }) => {
  let corePath = "../models/*.js"
  let appPath = "src/models/*.js"

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

      if (!(loaded.prototype instanceof BaseModel)) {
        const logger = container.resolve("logger")
        const message = `Models must inherit from BaseModel, please check ${fn}`
        logger.error(message)
        throw new Error(message)
      }

      const name = formatRegistrationName(fn)
      container.register({
        [name]: asFunction(cradle => new loaded(cradle)),
      })
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

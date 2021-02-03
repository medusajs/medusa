import glob from "glob"
import path from "path"
import { BaseModel } from "medusa-interfaces"
import { EntitySchema } from "typeorm"
import { Lifetime, asClass, asValue } from "awilix"

/**
 * Registers all models in the model directory
 */
export default ({ container }, config = { register: true }) => {
  let corePath = "../models/*.js"
  const coreFull = path.join(__dirname, corePath)

  const toReturn = []

  const core = glob.sync(coreFull, { cwd: __dirname })
  core.forEach(fn => {
    const loaded = require(fn)

    Object.entries(loaded).map(([key, val]) => {
      if (typeof val === "function" || val instanceof EntitySchema) {
        if (config.register) {
          const name = formatRegistrationName(fn)
          container.register({
            [name]: asClass(val),
          })

          container.registerAdd("db_entities", asValue(val))
        }

        toReturn.push(val)
      }
    })
  })

  return toReturn
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

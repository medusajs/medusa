import { asClass, asValue } from "awilix"
import glob from "glob"
import path from "path"
import { EventSubscriber } from "typeorm"
import formatRegistrationName from "../utils/format-registration-name"

export default ({ container }, config = { register: true }) => {
  const corePath = "../db-subscribers/*.js"
  const coreFull = path.join(__dirname, corePath)

  const toReturn = []

  const core = glob.sync(coreFull, { cwd: __dirname })
  core.forEach((fn) => {
    const loaded = require(fn)

    Object.entries(loaded).map(([key, val]) => {
      if (typeof val === "function" || val instanceof EventSubscriber) {
        if (config.register) {
          const name = formatRegistrationName(fn)
          container.register({
            [name]: asClass(val),
          })

          container.registerAdd("db_subscribers", asValue(val))
        }

        toReturn.push(val)
      }
    })
  })

  return toReturn
}

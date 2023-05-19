import { asValue } from "awilix"

import { EntitySchema } from "@mikro-orm/core"
import { MikroORM, PostgreSqlDriver } from "@mikro-orm/postgresql"

import * as ProductModels from "../models"
import {
  ProductServiceInitializeCustomDataLayerOptions,
  ProductServiceInitializeOptions,
} from "../types"
import { MedusaError } from "../utils"

export default async (
  { options, container },
  moduleDeclaration?: any
): Promise<void> => {
  if (
    moduleDeclaration?.scope === `internal` &&
    moduleDeclaration.resources === `shared`
  ) {
    return
  }

  const customManager = (
    options as ProductServiceInitializeCustomDataLayerOptions
  )?.manager
  const dbData = (options as ProductServiceInitializeOptions)?.database

  if (!customManager) {
    await loadDefault({ database: dbData, container })
  } else {
    container.register({
      manager: asValue(customManager),
    })
  }
}

/*async function getEntities(): Promise<any[]> {
  /!*if (process.env.WEBPACK) {
    const modules = require.context("../models", true, /\.ts$/)

    return modules
      .keys()
      .map((r) => modules(r))
      .flatMap((mod) => Object.keys(mod).map((className) => mod[className]))
  }*!/
  /!*const ignoreFiles = ["index.js", "index.ts", "index.d.ts", "index.js.map"]

  const promises = fs
    .readdirSync(__dirname + "/../models")
    .map((file) => !ignoreFiles.includes(file) && import(`../models/${file}`))
    .filter((v) => v)

  const modules = await Promise.all(promises)

  return modules.flatMap((mod) =>
    Object.keys(mod).map((className) => mod[className])
  )*!/
}*/

async function loadDefault({ database, container }) {
  if (!database) {
    throw new MedusaError(
      MedusaError.Types.INVALID_ARGUMENT,
      `Database config is not present at module config "options.database"`
    )
  }

  const entities = Object.values(ProductModels) as unknown as EntitySchema[]

  const orm = await MikroORM.init<PostgreSqlDriver>({
    entities: entities,
    discovery: { disableDynamicFileAccess: true },
    /*entities: await getEntities(),*/
    debug: process.env.NODE_ENV === "development",
    baseDir: process.cwd(),
    clientUrl: database.clientUrl,
    schema: database.schema ?? "public",
    driverOptions: database.driverOptions ?? {
      connection: { ssl: true },
    },
    tsNode: process.env.APP_ENV === "development",
    type: "postgresql",
  })

  container.register({
    manager: asValue(orm.em.fork()),
  })
}

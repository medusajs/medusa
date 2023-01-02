import path from "path"
import fs from "fs"
import express from "express"
import { createConnection } from "typeorm"
import { sync as existsSync } from "fs-exists-cached"
import { getConfigFile } from "medusa-core-utils"
import { track } from "medusa-telemetry"

import { handleConfigError } from "../loaders/config"
import Logger from "../loaders/logger"
import loaders from "../loaders"

import featureFlagLoader from "../loaders/feature-flags"

import getMigrations from "./utils/get-migrations"

const t = async function ({ directory, migrate, seedFile }) {
  track("CLI_SEED")
  let resolvedPath = seedFile

  // If we are already given an absolute path we can skip resolution step
  if (!existsSync(resolvedPath)) {
    resolvedPath = path.resolve(path.join(directory, seedFile))

    if (!existsSync(resolvedPath)) {
      console.error(`Could not find a seed file at: ${seedFile}`)
      console.error(`Resolved path: ${resolvedPath}`)

      process.exit(1)
    }
  }

  const { configModule, error } = getConfigFile(directory, `medusa-config`)

  if (error) {
    handleConfigError(error)
  }

  const featureFlagRouter = featureFlagLoader(configModule)

  const dbType = configModule.projectConfig.database_type
  if (migrate && dbType !== "sqlite") {
    const migrationDirs = await getMigrations(directory, featureFlagRouter)
    const connection = await createConnection({
      type: configModule.projectConfig.database_type,
      database: configModule.projectConfig.database_database,
      schema: configModule.projectConfig.database_schema,
      url: configModule.projectConfig.database_url,
      extra: configModule.projectConfig.database_extra || {},
      migrations: migrationDirs,
      logging: true,
    })

    await connection.runMigrations()
    await connection.close()
    Logger.info("Migrations completed.")
  }

  const app = express()
  const { container } = await loaders({
    directory,
    expressApp: app,
  })

  const manager = container.resolve("manager")

  const storeService = container.resolve("storeService")
  const userService = container.resolve("userService")
  const regionService = container.resolve("regionService")
  const productService = container.resolve("productService")
  const productVariantService = container.resolve("productVariantService")
  const shippingOptionService = container.resolve("shippingOptionService")
  const shippingProfileService = container.resolve("shippingProfileService")

  await manager.transaction(async (tx) => {
    const { store, regions, products, shipping_options, users } = JSON.parse(
      fs.readFileSync(resolvedPath, `utf-8`)
    )

    const gcProfile = await shippingProfileService.retrieveGiftCardDefault()
    const defaultProfile = await shippingProfileService.retrieveDefault()

    if (store) {
      await storeService.withTransaction(tx).update(store)
    }

    for (const u of users) {
      const pass = u.password
      if (pass) {
        delete u.password
      }
      await userService.withTransaction(tx).create(u, pass)
    }

    const regionIds = {}
    for (const r of regions) {
      let dummyId
      if (!r.id || !r.id.startsWith("reg_")) {
        dummyId = r.id
        delete r.id
      }

      const reg = await regionService.withTransaction(tx).create(r)

      if (dummyId) {
        regionIds[dummyId] = reg.id
      }
    }

    for (const so of shipping_options) {
      if (regionIds[so.region_id]) {
        so.region_id = regionIds[so.region_id]
      }

      so.profile_id = defaultProfile.id
      if (so.is_giftcard) {
        so.profile_id = gcProfile.id
        delete so.is_giftcard
      }

      await shippingOptionService.withTransaction(tx).create(so)
    }

    for (const p of products) {
      const variants = p.variants
      delete p.variants

      // default to the products being visible
      p.status = p.status || "published"

      p.profile_id = defaultProfile.id
      if (p.is_giftcard) {
        p.profile_id = gcProfile.id
      }

      const newProd = await productService.withTransaction(tx).create(p)

      if (variants && variants.length) {
        const optionIds = p.options.map(
          (o) => newProd.options.find((newO) => newO.title === o.title).id
        )

        for (const v of variants) {
          const variant = {
            ...v,
            options: v.options.map((o, index) => ({
              ...o,
              option_id: optionIds[index],
            })),
          }

          await productVariantService
            .withTransaction(tx)
            .create(newProd.id, variant)
        }
      }
    }
  })

  track("CLI_SEED_COMPLETED")
}

export default t

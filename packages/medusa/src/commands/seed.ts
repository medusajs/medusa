import express from "express"
import fs from "fs"
import { sync as existsSync } from "fs-exists-cached"
import { getConfigFile } from "medusa-core-utils"
import { track } from "medusa-telemetry"
import path from "path"
import { ConnectionOptions, createConnection } from "typeorm"

import loaders from "../loaders"
import { handleConfigError } from "../loaders/config"
import Logger from "../loaders/logger"

import featureFlagLoader from "../loaders/feature-flags"

import {
  ProductService,
  ProductVariantService,
  RegionService,
  ShippingOptionService,
  ShippingProfileService,
  StoreService,
  UserService,
} from "../services"
import { ConfigModule } from "../types/global"
import { CreateProductInput } from "../types/product"
import getMigrations, { getModuleSharedResources } from "./utils/get-migrations"

type SeedOptions = {
  directory: string
  migrate: boolean
  seedFile: string
}

const seed = async function ({ directory, migrate, seedFile }: SeedOptions) {
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

  const { configModule, error }: { configModule: ConfigModule; error?: any } =
    getConfigFile(directory, `medusa-config`)

  if (error) {
    handleConfigError(error)
  }

  const featureFlagRouter = featureFlagLoader(configModule)

  const dbType = configModule.projectConfig.database_type
  if (migrate && dbType !== "sqlite") {
    const { coreMigrations } = getMigrations(directory, featureFlagRouter)

    const { migrations: moduleMigrations } = getModuleSharedResources(
      configModule,
      featureFlagRouter
    )

    const connectionOptions = {
      type: configModule.projectConfig.database_type,
      database: configModule.projectConfig.database_database,
      schema: configModule.projectConfig.database_schema,
      url: configModule.projectConfig.database_url,
      extra: configModule.projectConfig.database_extra || {},
      migrations: coreMigrations.concat(moduleMigrations),
      logging: true,
    } as ConnectionOptions

    const connection = await createConnection(connectionOptions)

    await connection.runMigrations()
    await connection.close()
    Logger.info("Migrations completed.")
  }

  const app = express()
  const { container } = await loaders({
    directory,
    expressApp: app,
    isTest: false,
  })

  const manager = container.resolve("manager")

  const storeService: StoreService = container.resolve("storeService")
  const userService: UserService = container.resolve("userService")
  const regionService: RegionService = container.resolve("regionService")
  const productService: ProductService = container.resolve("productService")
  /* eslint-disable */
  const productVariantService: ProductVariantService = container.resolve(
    "productVariantService"
  )
  const shippingOptionService: ShippingOptionService = container.resolve(
    "shippingOptionService"
  )
  const shippingProfileService: ShippingProfileService = container.resolve(
    "shippingProfileService"
  )
  /* eslint-enable */

  await manager.transaction(async (tx) => {
    const {
      store: seededStore,
      regions,
      products,
      shipping_options,
      users,
    } = JSON.parse(fs.readFileSync(resolvedPath, `utf-8`))

    const gcProfile = await shippingProfileService.retrieveGiftCardDefault()
    const defaultProfile = await shippingProfileService.retrieveDefault()

    if (seededStore) {
      await storeService.withTransaction(tx).update(seededStore)
    }

    const store = await storeService.retrieve()

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

      so.profile_id = defaultProfile!.id
      if (so.is_giftcard) {
        so.profile_id = gcProfile!.id
        delete so.is_giftcard
      }

      await shippingOptionService.withTransaction(tx).create(so)
    }

    for (const p of products) {
      const variants = p.variants
      delete p.variants

      // default to the products being visible
      p.status = p.status || "published"

      p.sales_channels = [{ id: store.default_sales_channel_id }]

      p.profile_id = defaultProfile!.id
      if (p.is_giftcard) {
        p.profile_id = gcProfile!.id
      }

      const newProd = await productService
        .withTransaction(tx)
        .create(p as CreateProductInput)

      if (variants && variants.length) {
        const optionIds = p.options.map(
          (o) => newProd.options.find((newO) => newO.title === o.title)?.id
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

export default seed

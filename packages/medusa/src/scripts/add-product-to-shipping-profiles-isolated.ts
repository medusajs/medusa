import express from "express"
import loaders from "../loaders"
import { FlagRouter, MedusaV2Flag } from "@medusajs/utils"
import { ShippingProfileService } from "../services"
import { Workflows } from "@medusajs/core-flows"

async function addProductToShippingProfilesIsolated({ directory }) {
  const app = express()
  const { container } = await loaders({
    directory,
    expressApp: app,
    isTest: false,
  })

  const featureFlagRouter: FlagRouter = container.resolve("featureFlagRouter")

  const manager = container.resolve("manager")

  await manager.transaction(async (transaction) => {
    const productModuleService = container.resolve("productModuleService")
    const shippingProfileService = container.resolve(
      "shippingProfileService"
    ) as ShippingProfileService
    const shippingProfileServiceTx =
      shippingProfileService.withTransaction(transaction)

    const isProductIsolatedEnabled = featureFlagRouter.isFeatureEnabled(
      MedusaV2Flag.key
    )

    if (!isProductIsolatedEnabled) {
      throw new Error(
        `Cannot run script 'seed-isolated-product without the '${MedusaV2Flag.key}' feature flag enabled`
      )
    }

    const isWorkflowEnabled = featureFlagRouter.isFeatureEnabled({
      workflows: Workflows.CreateProducts,
    })

    if (!isWorkflowEnabled) {
      throw new Error(
        `Cannot run script 'seed-isolated-product without the '${Workflows.CreateProducts}' workflow enabled`
      )
    }

    if (!productModuleService) {
      throw new Error(
        `Cannot run ${Workflows.CreateProducts} workflow without '@medusajs/product' installed`
      )
    }

    let skip = 0
    let take = 500

    let products = await productModuleService.list(
      {},
      {
        select: ["id"],
        skip,
        take,
      }
    )

    const defaultProfile = await shippingProfileServiceTx.retrieveDefault()

    while (products.length > 0) {
      const productIds = products.map((p) => p.id)
      await shippingProfileServiceTx.addProducts(defaultProfile!.id, productIds)

      skip += products.length

      products = await productModuleService.list(
        {},
        {
          select: ["id"],
          skip,
          take,
        }
      )
    }
  })
}

addProductToShippingProfilesIsolated({
  directory: process.cwd(),
})
  .then(() => {
    process.exit()
  })
  .catch((err) => {
    console.error(err)
    process.exit(1)
  })

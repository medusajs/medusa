import { FlagRouter, MedusaV2Flag } from "@medusajs/utils"
import { WorkflowTypes } from "@medusajs/types"
import { EntityManager } from "typeorm"
import express from "express"
import loaders from "../loaders"
import { createProducts, Workflows } from "@medusajs/core-flows"

const seedProducts = [
  {
    title: "Test Product",
    description: "Test Product Description",
    handle: "test-product",
    is_giftcard: false,
    thumbnail:
      "https://medusa-public-images.s3.eu-west-1.amazonaws.com/tee-black-front.png",
    status: "published",
    variants: [
      {
        title: "Test Variant",
        sku: "test-variant",
        ean: "test-variant",
        upc: "test-variant",
        barcode: "test-variant",
        inventory_quantity: 10,
        manage_inventory: false,
        prices: [
          {
            amount: 100,
            currency_code: "eur",
          },
          {
            amount: 100,
            currency_code: "usd",
          },
        ],
      },
    ],
  },
  {
    title: "Test Product 2",
    description: "Test Product Description 2",
    handle: "test-product-2",
    is_giftcard: false,
    thumbnail:
      "https://medusa-public-images.s3.eu-west-1.amazonaws.com/tee-black-front.png",
    status: "published",
    variants: [
      {
        title: "Test Variant 2",
        sku: "test-variant 2",
        ean: "test-variant 2",
        upc: "test-variant 2",
        barcode: "test-variant 2",
        inventory_quantity: 10,
        manage_inventory: false,
        prices: [
          {
            amount: 100,
            currency_code: "eur",
          },
          {
            amount: 100,
            currency_code: "usd",
          },
        ],
      },
    ],
  },
  {
    title: "Test Product 3",
    description: "Test Product Description 3",
    handle: "test-product-3",
    is_giftcard: false,
    thumbnail:
      "https://medusa-public-images.s3.eu-west-1.amazonaws.com/tee-black-front.png",
    status: "published",
    variants: [
      {
        title: "Test Variant 3",
        sku: "test-variant 3",
        ean: "test-variant 3",
        upc: "test-variant 3",
        barcode: "test-variant 3",
        inventory_quantity: 10,
        manage_inventory: false,
        prices: [
          {
            amount: 100,
            currency_code: "eur",
          },
          {
            amount: 100,
            currency_code: "usd",
          },
        ],
      },
    ],
  },
]

async function seedIsolatedProduct({ directory }) {
  const app = express()
  const { container } = await loaders({
    directory,
    expressApp: app,
    isTest: false,
  })

  const featureFlagRouter: FlagRouter = container.resolve("featureFlagRouter")

  const entityManager: EntityManager = container.resolve("manager")
  const productModuleService = container.resolve("productModuleService")
  const logger = container.resolve("logger")

  const isWorkflowEnabled = featureFlagRouter.isFeatureEnabled({
    workflows: Workflows.CreateProducts,
  })

  const isProductIsolatedEnabled = featureFlagRouter.isFeatureEnabled(
    MedusaV2Flag.key
  )

  if (!isProductIsolatedEnabled) {
    throw new Error(
      `Cannot run script 'seed-isolated-product without the '${MedusaV2Flag.key}' feature flag enabled`
    )
  }

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

  const createProductWorkflow = createProducts(container)

  const input = {
    products:
      seedProducts as WorkflowTypes.ProductWorkflow.CreateProductInputDTO[],
  }

  const { result: products } = await createProductWorkflow.run({
    input,
    context: {
      manager: entityManager,
    },
  })

  const createdVariants = products.flatMap((p) => p.variants)

  logger.info(
    `Created ${products.length} products with the following ids: [${products
      .map((p) => p.id)
      .join(", ")}]`
  )
  logger.info(
    `Created ${
      createdVariants.length
    } variants with the following ids: [${createdVariants
      .map((v) => v.id)
      .join(", ")}]`
  )
}

seedIsolatedProduct({ directory: process.cwd() })
  .then(() => {
    process.exit()
  })
  .catch((err) => {
    console.error(err)
    process.exit(1)
  })

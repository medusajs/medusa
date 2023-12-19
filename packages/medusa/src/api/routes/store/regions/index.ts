import { PaginatedResponse } from "@medusajs/types"
import { TaxInclusivePricingFeatureFlag, wrapHandler } from "@medusajs/utils"
import { Router } from "express"
import { transformQuery } from "../../../middlewares"
import { Region } from "./../../../../"
import getRegion from "./get-region"
import listRegions, { StoreGetRegionsParams } from "./list-regions"

const route = Router()

export default (app, featureFlagRouter) => {
  if (featureFlagRouter.isFeatureEnabled(TaxInclusivePricingFeatureFlag.key)) {
    defaultStoreRegionFields.push("includes_tax")
  }

  const retrieveTransformQueryConfig = {
    defaultFields: defaultStoreRegionFields,
    defaultRelations: defaultStoreRegionRelations,
    allowedRelations: defaultStoreRegionRelations,
    isList: false,
  }

  const listTransformQueryConfig = {
    ...retrieveTransformQueryConfig,
    isList: true,
  }

  app.use("/regions", route)

  route.get(
    "/",
    transformQuery(StoreGetRegionsParams, listTransformQueryConfig),
    wrapHandler(listRegions)
  )

  route.get(
    "/:region_id",
    transformQuery(StoreGetRegionsParams, retrieveTransformQueryConfig),
    wrapHandler(getRegion)
  )

  return app
}

export const defaultStoreRegionRelations = [
  "countries",
  "payment_providers",
  "fulfillment_providers",
  "currency",
]

export const defaultStoreRegionFields = [
  "id",
  "name",
  "currency_code",
  "tax_rate",
  "tax_code",
  "gift_cards_taxable",
  "automatic_taxes",
  "tax_provider_id",
  "metadata",
  "created_at",
  "updated_at",
  "deleted_at",
]

/**
 * @schema StoreRegionsListRes
 * type: object
 * description: "The list of regions with pagination fields."
 * x-expanded-relations:
 *   field: regions
 *   relations:
 *     - countries
 *     - payment_providers
 *     - fulfillment_providers
 *   eager:
 *     - payment_providers
 *     - fulfillment_providers
 * required:
 *   - regions
 * properties:
 *   regions:
 *     type: array
 *     description: "An array of regions details."
 *     items:
 *       $ref: "#/components/schemas/Region"
 *   count:
 *     type: integer
 *     description: The total number of items available
 *   offset:
 *     type: integer
 *     description: The number of regions skipped when retrieving the regions.
 *   limit:
 *     type: integer
 *     description: The number of items per page
 */
export type StoreRegionsListRes = PaginatedResponse & {
  regions: Region[]
}

/**
 * @schema StoreRegionsRes
 * type: object
 * description: "The region's details."
 * x-expanded-relations:
 *   field: region
 *   relations:
 *     - countries
 *     - payment_providers
 *     - fulfillment_providers
 *   eager:
 *     - payment_providers
 *     - fulfillment_providers
 * required:
 *   - region
 * properties:
 *   region:
 *     description: "Region details."
 *     $ref: "#/components/schemas/Region"
 */
export type StoreRegionsRes = {
  region: Region
}

export * from "./get-region"
export * from "./list-regions"

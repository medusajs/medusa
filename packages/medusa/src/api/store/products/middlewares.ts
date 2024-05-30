import { isPresent, ProductStatus } from "@medusajs/utils"
import { MiddlewareRoute } from "../../../loaders/helpers/routing/types"
import { MedusaRequest } from "../../../types/routing"
import { maybeApplyLinkFilter } from "../../utils/maybe-apply-link-filter"
import {
  applyDefaultFilters,
  filterByValidSalesChannels,
  setPricingContext,
} from "../../utils/middlewares"
import { setContext } from "../../utils/middlewares/common/set-context"
import { refetchEntities } from "../../utils/refetch-entity"
import { validateAndTransformQuery } from "../../utils/validate-query"
import * as QueryConfig from "./query-config"
import {
  StoreGetProductsParams,
  StoreGetProductsParamsType,
} from "./validators"

export const storeProductRoutesMiddlewares: MiddlewareRoute[] = [
  {
    method: ["GET"],
    matcher: "/store/products",
    middlewares: [
      validateAndTransformQuery(
        StoreGetProductsParams,
        QueryConfig.listProductQueryConfig
      ),
      filterByValidSalesChannels(),
      setContext({
        with_inventory_quantity: async (req: MedusaRequest) => {
          const withInventoryQuantity = req.remoteQueryConfig.fields.some(
            (field) => field.includes("variants.inventory_quantity")
          )

          req.remoteQueryConfig.fields = req.remoteQueryConfig.fields.filter(
            (field) => !field.includes("variants.inventory_quantity")
          )

          return withInventoryQuantity
        },
        stock_location_id: async (req: MedusaRequest, ctx) => {
          if (!ctx.with_inventory_quantity) {
            return
          }

          const salesChannelId = req.filterableFields.sales_channel_id || []

          const entities = await refetchEntities(
            "sales_channel_location",
            { sales_channel_id: salesChannelId },
            req.scope,
            ["stock_location_id"]
          )

          return entities.map((entity) => entity.stock_location_id)
        },
      }),
      maybeApplyLinkFilter({
        entryPoint: "product_sales_channel",
        resourceId: "product_id",
        filterableField: "sales_channel_id",
      }),
      applyDefaultFilters({
        status: ProductStatus.PUBLISHED,
        categories: (filters: StoreGetProductsParamsType, fields: string[]) => {
          const categoryIds = filters.category_id
          delete filters.category_id

          if (!isPresent(categoryIds)) {
            return
          }

          return { id: categoryIds, is_internal: false, is_active: true }
        },
      }),
      setPricingContext(),
    ],
  },
  {
    method: ["GET"],
    matcher: "/store/products/:id",
    middlewares: [
      validateAndTransformQuery(
        StoreGetProductsParams,
        QueryConfig.retrieveProductQueryConfig
      ),
      filterByValidSalesChannels(),
      setContext({
        with_inventory_quantity: async (req: MedusaRequest) => {
          const withInventoryQuantity = req.remoteQueryConfig.fields.some(
            (field) => field.includes("inventory_quantity")
          )

          req.remoteQueryConfig.fields = req.remoteQueryConfig.fields.filter(
            (field) => !field.includes("inventory_quantity")
          )

          return withInventoryQuantity
        },
        stock_location_id: async (req: MedusaRequest, ctx) => {
          if (!ctx.with_inventory_quantity) {
            return
          }

          const salesChannelId = req.filterableFields.sales_channel_id || []

          const entities = await refetchEntities(
            "sales_channel_location",
            { sales_channel_id: salesChannelId },
            req.scope,
            ["stock_location_id"]
          )

          return entities.map((entity) => entity.stock_location_id)
        },
      }),
      maybeApplyLinkFilter({
        entryPoint: "product_sales_channel",
        resourceId: "product_id",
        filterableField: "sales_channel_id",
      }),
      applyDefaultFilters({
        status: ProductStatus.PUBLISHED,
        categories: (_filters, fields: string[]) => {
          if (!fields.some((field) => field.startsWith("categories"))) {
            return
          }

          return { is_internal: false, is_active: true }
        },
      }),
      setPricingContext(),
    ],
  },
]

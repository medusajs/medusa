import { ProductStatus } from "@medusajs/utils"
import { MiddlewareRoute } from "../../../loaders/helpers/routing/types"
import { maybeApplyLinkFilter } from "../../utils/maybe-apply-link-filter"
import { applyDefaultFilters, setPricingContext } from "../../utils/middlewares"
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
      // TODO: Do we still do default sales channels? Apply middleware
      maybeApplyLinkFilter({
        entryPoint: "product_sales_channel",
        resourceId: "product_id",
        filterableField: "sales_channel_id",
      }),
      applyDefaultFilters<StoreGetProductsParamsType>({
        status: ProductStatus.PUBLISHED,
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
      // TODO: Do we still do default sales channels? Apply middleware
      maybeApplyLinkFilter({
        entryPoint: "product_sales_channel",
        resourceId: "product_id",
        filterableField: "sales_channel_id",
      }),
      applyDefaultFilters<StoreGetProductsParamsType>({
        status: ProductStatus.PUBLISHED,
      }),
      setPricingContext(),
    ],
  },
]

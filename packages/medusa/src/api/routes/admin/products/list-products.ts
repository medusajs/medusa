import { IsNumber, IsOptional, IsString } from "class-validator"
import {
  PriceListService,
  PricingService,
  ProductService,
  ProductVariantInventoryService,
  SalesChannelService,
} from "../../../../services"

import { FilterableProductProps } from "../../../../types/product"
import { IInventoryService } from "@medusajs/types"
import IsolateProductDomainFeatureFlag from "../../../../loaders/feature-flags/isolate-product-domain"
import { PricedProduct } from "../../../../types/pricing"
import { Product } from "../../../../models"
import { Type } from "class-transformer"
import { defaultAdminProductRemoteQueryObject } from "./index"
import IsolateSalesChannelDomain from "../../../../loaders/feature-flags/isolate-sales-channel-domain"
import { promiseAll } from "@medusajs/utils"

/**
 * @oas [get] /admin/products
 * operationId: "GetProducts"
 * summary: "List Products"
 * description: "Retrieve a list of products. The products can be filtered by fields such as `q` or `status`. The products can also be sorted or paginated."
 * x-authenticated: true
 * parameters:
 *   - (query) q {string} term to search products' title, description, variants' title and sku, and collections' title.
 *   - (query) discount_condition_id {string} Filter by the ID of a discount condition. Only products that this discount condition is applied to will be retrieved.
 *   - in: query
 *     name: id
 *     style: form
 *     explode: false
 *     description: Filter by product IDs.
 *     schema:
 *       oneOf:
 *         - type: string
 *           description: ID of the product.
 *         - type: array
 *           items:
 *             type: string
 *             description: ID of a product.
 *   - in: query
 *     name: status
 *     style: form
 *     explode: false
 *     description: Filter by status.
 *     schema:
 *       type: array
 *       items:
 *         type: string
 *         enum: [draft, proposed, published, rejected]
 *   - in: query
 *     name: collection_id
 *     style: form
 *     explode: false
 *     description: Filter by product collection IDs. Only products that are associated with the specified collections will be retrieved.
 *     schema:
 *       type: array
 *       items:
 *         type: string
 *   - in: query
 *     name: tags
 *     style: form
 *     explode: false
 *     description: Filter by product tag IDs. Only products that are associated with the specified tags will be retrieved.
 *     schema:
 *       type: array
 *       items:
 *         type: string
 *   - in: query
 *     name: price_list_id
 *     style: form
 *     explode: false
 *     description: Filter by IDs of price lists. Only products that these price lists are applied to will be retrieved.
 *     schema:
 *       type: array
 *       items:
 *         type: string
 *   - in: query
 *     name: sales_channel_id
 *     style: form
 *     explode: false
 *     description: Filter by sales channel IDs. Only products that are available in the specified sales channels will be retrieved.
 *     schema:
 *       type: array
 *       items:
 *         type: string
 *   - in: query
 *     name: type_id
 *     style: form
 *     explode: false
 *     description: Filter by product type IDs. Only products that are associated with the specified types will be retrieved.
 *     schema:
 *       type: array
 *       items:
 *         type: string
 *   - in: query
 *     name: category_id
 *     style: form
 *     explode: false
 *     description: Filter by product category IDs. Only products that are associated with the specified categories will be retrieved.
 *     schema:
 *       type: array
 *       x-featureFlag: "product_categories"
 *       items:
 *         type: string
 *   - in: query
 *     name: include_category_children
 *     style: form
 *     explode: false
 *     description: whether to include product category children when filtering by `category_id`
 *     schema:
 *       type: boolean
 *       x-featureFlag: "product_categories"
 *   - (query) title {string} Filter by title.
 *   - (query) description {string} Filter by description.
 *   - (query) handle {string} Filter by handle.
 *   - (query) is_giftcard {boolean} Whether to retrieve gift cards or regular products.
 *   - in: query
 *     name: created_at
 *     description: Filter by a creation date range.
 *     schema:
 *       type: object
 *       properties:
 *         lt:
 *            type: string
 *            description: filter by dates less than this date
 *            format: date
 *         gt:
 *            type: string
 *            description: filter by dates greater than this date
 *            format: date
 *         lte:
 *            type: string
 *            description: filter by dates less than or equal to this date
 *            format: date
 *         gte:
 *            type: string
 *            description: filter by dates greater than or equal to this date
 *            format: date
 *   - in: query
 *     name: updated_at
 *     description: Filter by an update date range.
 *     schema:
 *       type: object
 *       properties:
 *         lt:
 *            type: string
 *            description: filter by dates less than this date
 *            format: date
 *         gt:
 *            type: string
 *            description: filter by dates greater than this date
 *            format: date
 *         lte:
 *            type: string
 *            description: filter by dates less than or equal to this date
 *            format: date
 *         gte:
 *            type: string
 *            description: filter by dates greater than or equal to this date
 *            format: date
 *   - in: query
 *     name: deleted_at
 *     description: Filter by a deletion date range.
 *     schema:
 *       type: object
 *       properties:
 *         lt:
 *            type: string
 *            description: filter by dates less than this date
 *            format: date
 *         gt:
 *            type: string
 *            description: filter by dates greater than this date
 *            format: date
 *         lte:
 *            type: string
 *            description: filter by dates less than or equal to this date
 *            format: date
 *         gte:
 *            type: string
 *            description: filter by dates greater than or equal to this date
 *            format: date
 *   - (query) offset=0 {integer} The number of products to skip when retrieving the products.
 *   - (query) limit=50 {integer} Limit the number of products returned.
 *   - (query) expand {string} Comma-separated relations that should be expanded in the returned products.
 *   - (query) fields {string} Comma-separated fields that should be included in the returned products.
 *   - (query) order {string} A product field to sort-order the retrieved products by.
 * x-codegen:
 *   method: list
 *   queryParams: AdminGetProductsParams
 * x-codeSamples:
 *   - lang: JavaScript
 *     label: JS Client
 *     source: |
 *       import Medusa from "@medusajs/medusa-js"
 *       const medusa = new Medusa({ baseUrl: MEDUSA_BACKEND_URL, maxRetries: 3 })
 *       // must be previously logged in or use api token
 *       medusa.admin.products.list()
 *       .then(({ products, limit, offset, count }) => {
 *         console.log(products.length);
 *       })
 *   - lang: Shell
 *     label: cURL
 *     source: |
 *       curl '{backend_url}/admin/products' \
 *       -H 'x-medusa-access-token: {api_token}'
 * security:
 *   - api_token: []
 *   - cookie_auth: []
 *   - jwt_token: []
 * tags:
 *   - Products
 * responses:
 *   200:
 *     description: OK
 *     content:
 *       application/json:
 *         schema:
 *           $ref: "#/components/schemas/AdminProductsListRes"
 *   "400":
 *     $ref: "#/components/responses/400_error"
 *   "401":
 *     $ref: "#/components/responses/unauthorized"
 *   "404":
 *     $ref: "#/components/responses/not_found_error"
 *   "409":
 *     $ref: "#/components/responses/invalid_state_error"
 *   "422":
 *     $ref: "#/components/responses/invalid_request_error"
 *   "500":
 *     $ref: "#/components/responses/500_error"
 */
export default async (req, res) => {
  const productService: ProductService = req.scope.resolve("productService")
  const inventoryService: IInventoryService | undefined =
    req.scope.resolve("inventoryService")
  const productVariantInventoryService: ProductVariantInventoryService =
    req.scope.resolve("productVariantInventoryService")
  const salesChannelService: SalesChannelService = req.scope.resolve(
    "salesChannelService"
  )
  const featureFlagRouter = req.scope.resolve("featureFlagRouter")
  const pricingService: PricingService = req.scope.resolve("pricingService")

  const { skip, take, relations } = req.listConfig

  let rawProducts
  let count

  if (featureFlagRouter.isFeatureEnabled(IsolateProductDomainFeatureFlag.key)) {
    const [products, count_] =
      await listAndCountProductWithIsolatedProductModule(
        req,
        req.filterableFields,
        req.listConfig
      )

    rawProducts = products
    count = count_
  } else {
    const [products, count_] = await productService.listAndCount(
      req.filterableFields,
      req.listConfig
    )

    rawProducts = products
    count = count_
  }

  let products: (Product | PricedProduct)[] = rawProducts

  // We only set prices if variants.prices are requested
  const shouldSetPricing = ["variants", "variants.prices"].every((relation) =>
    relations?.includes(relation)
  )

  if (shouldSetPricing) {
    products = await pricingService.setAdminProductPricing(rawProducts)
  }

  // We only set availability if variants are requested
  const shouldSetAvailability = relations?.includes("variants")

  if (inventoryService && shouldSetAvailability) {
    const [salesChannelsIds] = await salesChannelService.listAndCount(
      {},
      { select: ["id"] }
    )

    products = await productVariantInventoryService.setProductAvailability(
      products,
      salesChannelsIds.map((salesChannel) => salesChannel.id)
    )
  }

  res.json({
    products,
    count,
    offset: skip,
    limit: take,
  })
}

async function listAndCountProductWithIsolatedProductModule(
  req,
  filterableFields,
  listConfig
) {
  // TODO: Add support for fields/expands

  const remoteQuery = req.scope.resolve("remoteQuery")
  const featureFlagRouter = req.scope.resolve("featureFlagRouter")
  const isSalesChannelModuleIsolationFFOn = featureFlagRouter.isFeatureEnabled(
    IsolateSalesChannelDomain.key
  )

  const productIdsFilter: Set<string> = new Set()
  const variantIdsFilter: Set<string> = new Set()

  const promises: Promise<void>[] = []

  // This is not the best way of handling cross filtering but for now I would say it is fine
  const salesChannelIdFilter = filterableFields.sales_channel_id
  delete filterableFields.sales_channel_id

  if (salesChannelIdFilter && !isSalesChannelModuleIsolationFFOn) {
    const salesChannelService = req.scope.resolve(
      "salesChannelService"
    ) as SalesChannelService

    promises.push(
      salesChannelService
        .listProductIdsBySalesChannelIds(salesChannelIdFilter)
        .then((productIdsInSalesChannel) => {
          let filteredProductIds =
            productIdsInSalesChannel[salesChannelIdFilter]

          if (filterableFields.id) {
            filterableFields.id = Array.isArray(filterableFields.id)
              ? filterableFields.id
              : [filterableFields.id]

            const salesChannelProductIdsSet = new Set(filteredProductIds)

            filteredProductIds = filterableFields.id.filter((productId) =>
              salesChannelProductIdsSet.has(productId)
            )
          }

          filteredProductIds.map((id) => productIdsFilter.add(id))
        })
    )
  }

  const priceListId = filterableFields.price_list_id
  delete filterableFields.price_list_id

  if (priceListId) {
    // TODO: it is working but validate the behaviour.
    // e.g pricing context properly set.
    // At the moment filtering by price list but not having any customer id or
    // include discount forces the query to filter with price list id is null
    const priceListService = req.scope.resolve(
      "priceListService"
    ) as PriceListService
    promises.push(
      priceListService
        .listPriceListsVariantIdsMap(priceListId)
        .then((priceListVariantIdsMap) => {
          priceListVariantIdsMap[priceListId].map((variantId) =>
            variantIdsFilter.add(variantId)
          )
        })
    )
  }

  const discountConditionId = filterableFields.discount_condition_id
  delete filterableFields.discount_condition_id

  if (discountConditionId) {
    // TODO implement later
  }

  await promiseAll(promises)

  if (productIdsFilter.size > 0) {
    filterableFields.id = Array.from(productIdsFilter)
  }

  if (variantIdsFilter.size > 0) {
    filterableFields.variants = { id: Array.from(variantIdsFilter) }
  }

  const variables = {
    filters: filterableFields,
    order: listConfig.order,
    skip: listConfig.skip,
    take: listConfig.take,
  }

  const query = {
    product: {
      __args: variables,
      ...defaultAdminProductRemoteQueryObject,
    },
  }

  // TODO: Change when support for fields/expands is added
  if (isSalesChannelModuleIsolationFFOn) {
    query.product["sales_channels"] = {
      fields: [
        "id",
        "name",
        "description",
        "is_disabled",
        "created_at",
        "updated_at",
        "deleted_at",
      ],
    }
    if (salesChannelIdFilter) {
      query.product["sales_channels"]["__args"] = {
        filters: { id: salesChannelIdFilter },
      }
    }
  }

  let {
    rows: products,
    metadata: { count },
  } = await remoteQuery(query)

  products.forEach((product) => {
    product.profile_id = product.profile?.id
  })

  if (salesChannelIdFilter) {
    products = products.filter((product) => product.sales_channels?.length)
  }

  return [products, count]
}

/**
 * Parameters used to filter and configure the pagination of the retrieved products.
 */
export class AdminGetProductsParams extends FilterableProductProps {
  /**
   * {@inheritDoc FindPaginationParams.offset}
   * @defaultValue 0
   */
  @IsNumber()
  @IsOptional()
  @Type(() => Number)
  offset?: number = 0

  /**
   * {@inheritDoc FindPaginationParams.limit}
   * @defaultValue 50
   */
  @IsNumber()
  @IsOptional()
  @Type(() => Number)
  limit?: number = 50

  /**
   * {@inheritDoc FindParams.expand}
   */
  @IsString()
  @IsOptional()
  expand?: string

  /**
   * {@inheritDoc FindParams.fields}
   */
  @IsString()
  @IsOptional()
  fields?: string

  /**
   * The field to sort the data by. By default, the sort order is ascending. To change the order to descending, prefix the field name with `-`.
   */
  @IsString()
  @IsOptional()
  order?: string
}

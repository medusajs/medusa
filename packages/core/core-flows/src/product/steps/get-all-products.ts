import { FilterableProductProps } from "@medusajs/framework/types"
import { ContainerRegistrationKeys } from "@medusajs/framework/utils"
import { createStep, StepResponse } from "@medusajs/framework/workflows-sdk"

/**
 * The configuration to retrieve the products.
 */
export type GetAllProductsStepInput = {
  /**
   * The fields to select. These fields will be passed to
   * [Query](https://docs.medusajs.com/learn/fundamentals/module-links/query), so you can
   * pass product properties or any relation names, including custom links.
   */
  select: string[]
  /**
   * The filters to select which products to retrieve.
   */
  filter?: FilterableProductProps & { sales_channel_id?: string | string[] }
}

export const getAllProductsStepId = "get-all-products"
/**
 * This step retrieves all products matching a set of filters.
 *
 * @example
 * To retrieve all products:
 *
 * ```ts
 * const data = getAllProductsStep({
 *   select: ["*"],
 * })
 * ```
 *
 * To retrieve all products matching a filter:
 *
 * ```ts
 * const data = getAllProductsStep({
 *   select: ["*"],
 *   filter: {
 *     collection_id: "collection_123"
 *   }
 * })
 */
export const getAllProductsStep = createStep(
  getAllProductsStepId,
  async (data: GetAllProductsStepInput, { container }) => {
    const query = container.resolve(ContainerRegistrationKeys.QUERY)

    const allProducts: any[] = []
    const pageSize = 200
    let page = 0

    const { sales_channel_id, ..._filters } = data.filter ?? {}

    // We intentionally fetch the products serially here to avoid putting too much load on the DB
    while (true) {
      let linkPageLength: number | undefined

      if (!!sales_channel_id) {
        const { data: salesChannelProducts } = await query.graph({
          entity: "product_sales_channel",
          filters: {
            sales_channel_id,
          },
          fields: ["product_id"],
          pagination: {
            skip: page * pageSize,
            take: pageSize,
          },
        })

        linkPageLength = salesChannelProducts.length
        _filters.id = salesChannelProducts.map((product) => product.product_id)

        if (linkPageLength === 0) {
          break
        }
      }

      const { data: products } = await query.graph({
        entity: "product",
        filters: _filters,
        fields: data.select,
        // If sales channel is specified, we already paginated
        pagination: sales_channel_id ? undefined : {
          skip: page * pageSize,
          take: pageSize,
        },
      })

      allProducts.push(...products)

      // When a sales channel is given, the cursor above advances over the
      // product_sales_channel link table, so its page length is what says
      // whether another page exists. The product query is filtered and
      // de-duplicated, so it can return fewer rows than the link page
      // without the channel being exhausted.
      if ((linkPageLength ?? products.length) < pageSize) {
        break
      }

      page += 1
    }

    return new StepResponse(allProducts, allProducts)
  }
)

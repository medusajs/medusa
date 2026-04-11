import { ContainerRegistrationKeys } from "@medusajs/framework/utils"
import { createStep, StepResponse } from "@medusajs/framework/workflows-sdk"
import type {
  ComputeActionContext,
  OrderDTO,
  OrderPreviewDTO,
  ProductDTO,
  ShippingOptionDTO,
} from "@medusajs/framework/types"

/**
 * The details of the order to prepare compute actions for.
 */
export interface PrepareOrderComputeActionContextStepInput {
  /**
   * The order.
   */
  order: OrderDTO
  /**
   * The previewed order after applying the order change.
   */
  previewedOrder: OrderPreviewDTO
}

type ProductContext = Pick<
  ProductDTO,
  "id" | "collection_id" | "tags" | "categories" | "type_id"
>

type ShippingOptionContext = Pick<
  ShippingOptionDTO,
  "id" | "shipping_option_type_id"
>

type Adjustment = {
  id: string
  code: string
}

const normalizeProductContext = (
  product?: ProductContext | { id: string }
) => {
  if (!product) {
    return undefined
  }

  const data = product as Partial<ProductContext>

  return {
    id: product.id,
    collection_id: data.collection_id ?? undefined,
    tags: data.tags ?? undefined,
    categories: data.categories ?? undefined,
    type_id: data.type_id ?? undefined,
  }
}

const filterAdjustments = (adjustments: any[] = []): Adjustment[] => {
  return adjustments
    .filter((adj) => adj?.id && adj?.code)
    .map((adj) => ({ id: adj.id, code: adj.code }))
}

export const prepareOrderComputeActionContextStepId =
  "prepare-order-compute-action-context"

/**
 * This step prepares the compute action context for an order by enriching
 * previewed items and shipping methods with external entities.
 *
 * Order `preview` doesn't return related entities from external modules
 * and order itself could have stale entitites depending on the change action
 * so we need to prepare some data "manually" to make sure the compute action context is correct
 */
export const prepareOrderComputeActionContextStep = createStep(
  prepareOrderComputeActionContextStepId,
  async (
    { order, previewedOrder }: PrepareOrderComputeActionContextStepInput,
    { container }
  ): Promise<StepResponse<ComputeActionContext>> => {
    const query = container.resolve(ContainerRegistrationKeys.QUERY)

    const items = previewedOrder.items ?? order.items ?? []
    const shippingMethods =
      previewedOrder.shipping_methods ?? order.shipping_methods ?? []

    const productIds = [
      ...new Set(
        items.map((item) => item.product_id).filter((id): id is string => !!id)
      ),
    ]

    const shippingOptionIds = [
      ...new Set(
        shippingMethods
          .map((method) => method.shipping_option_id)
          .filter((id): id is string => !!id)
      ),
    ]

    const [productsResult, shippingOptionsResult] = await Promise.all([
      productIds.length
        ? query.graph({
          entity: "product",
          fields: [
            "id",
            "collection_id",
            "tags.id",
            "categories.id",
            "type_id",
          ],
          filters: { id: productIds },
        })
        : { data: [] },
      shippingOptionIds.length
        ? query.graph({
          entity: "shipping_option",
          fields: ["id", "shipping_option_type_id"],
          filters: { id: shippingOptionIds },
        })
        : { data: [] },
    ])

    const products = (productsResult.data ?? []) as ProductContext[]
    const shippingOptions = (shippingOptionsResult.data ??
      []) as ShippingOptionContext[]

    const productMap = new Map(products.map((p) => [p.id, p]))
    const shippingOptionMap = new Map(shippingOptions.map((o) => [o.id, o]))

    const computedItems = items.map((item) => {
      const product = normalizeProductContext(
        (item as any).product ?? (item.product_id && productMap.get(item.product_id))
      )

      const adjustments = filterAdjustments(item.adjustments)

      return {
        ...item,
        adjustments: adjustments.length ? adjustments : undefined,
        product: product ?? (item.product_id ? { id: item.product_id } : undefined),
      }
    })

    const computedShippingMethods = shippingMethods.map((method) => {
      const shippingOption = method.shipping_option_id
        ? shippingOptionMap.get(method.shipping_option_id)
        : undefined

      const adjustments = filterAdjustments(method.adjustments)

      const shippingOptionTypeId =
        (method as any).shipping_option?.shipping_option_type_id ??
        shippingOption?.shipping_option_type_id

      return {
        ...method,
        adjustments: adjustments.length ? adjustments : undefined,
        shipping_option: shippingOptionTypeId
          ? { shipping_option_type_id: shippingOptionTypeId }
          : undefined,
      }
    })

    const previewCustomer = (previewedOrder as any).customer
    const orderCustomer = (order as any).customer

    const customer =
      previewCustomer?.id || orderCustomer?.id || order.customer_id
        ? {
          id: previewCustomer?.id ?? orderCustomer?.id ?? order.customer_id!,
          groups: (previewCustomer?.groups ?? orderCustomer?.groups)?.map(
            (group: any) => ({ id: group.id })
          ),
        }
        : undefined

    const previewRegion = (previewedOrder as any).region
    const orderRegion = (order as any).region

    const region =
      previewRegion?.id || orderRegion?.id || order.region_id
        ? { id: previewRegion?.id ?? orderRegion?.id ?? order.region_id! }
        : undefined

    const shippingAddress =
      (previewedOrder as any).shipping_address ??
      (order as any).shipping_address

    const shipping_address = shippingAddress?.country_code
      ? { country_code: shippingAddress.country_code }
      : undefined

    return new StepResponse({
      currency_code: previewedOrder.currency_code ?? order.currency_code,
      customer,
      region,
      shipping_address,
      sales_channel_id:
        previewedOrder.sales_channel_id ?? order.sales_channel_id,
      email: previewedOrder.email ?? order.email,
      items: computedItems,
      shipping_methods: computedShippingMethods,
    })
  }
)

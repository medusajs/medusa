import {
  CartLineItemDTO,
  CartShippingMethodDTO,
  CartWorkflowDTO,
  ITaxModuleService,
  ItemTaxLineDTO,
  OrderLineItemDTO,
  OrderShippingMethodDTO,
  OrderWorkflowDTO,
  ShippingTaxLineDTO,
  TaxableItemDTO,
  TaxableShippingDTO,
  TaxCalculationContext,
} from "@medusajs/framework/types"
import { isDefined, MedusaError, Modules } from "@medusajs/framework/utils"
import { createStep, StepResponse } from "@medusajs/framework/workflows-sdk"

/**
 * The data to retrieve tax lines for an order or cart's line items and shipping methods.
 */
export interface GetItemTaxLinesStepInput {
  /**
   * The order or cart details.
   */
  orderOrCart: OrderWorkflowDTO | CartWorkflowDTO
  /**
   * The order or cart's items.
   */
  items: OrderLineItemDTO[] | CartLineItemDTO[]
  /**
   * The order or cart's shipping methods.
   */
  shipping_methods: OrderShippingMethodDTO[] | CartShippingMethodDTO[]
  /**
   * Whether to re-calculate taxes. Enabling this may require sending
   * requests to third-party services, depending on the implementation of the
   * tax provider associated with the cart or order's region.
   */
  force_tax_calculation?: boolean
  /**
   * Whether the tax lines are for an order return.
   */
  is_return?: boolean
  /**
   * The shipping address of the order.
   */
  shipping_address?: OrderWorkflowDTO["shipping_address"]
}

function normalizeTaxModuleContext(
  orderOrCart: OrderWorkflowDTO | CartWorkflowDTO,
  forceTaxCalculation: boolean,
  isReturn?: boolean,
  shippingAddress?: OrderWorkflowDTO["shipping_address"]
): TaxCalculationContext | null {
  const address = shippingAddress ?? orderOrCart.shipping_address
  const shouldCalculateTax =
    forceTaxCalculation || orderOrCart.region?.automatic_taxes

  if (!shouldCalculateTax) {
    return null
  }

  if (forceTaxCalculation && !address?.country_code) {
    throw new MedusaError(
      MedusaError.Types.INVALID_DATA,
      `country code is required to calculate taxes`
    )
  }

  if (!address?.country_code) {
    return null
  }

  const customer = orderOrCart.customer && {
    id: orderOrCart.customer.id,
    email: orderOrCart.customer.email,
    customer_groups: orderOrCart.customer.groups?.map((g) => g.id) || [],
    metadata: orderOrCart.customer.metadata,
  }

  return {
    address: {
      country_code: address.country_code,
      province_code: address.province,
      address_1: address.address_1,
      address_2: address.address_2,
      city: address.city,
      postal_code: address.postal_code,
      metadata: address.metadata,
    },
    customer,
    is_return: isReturn ?? false,
    locale: orderOrCart.locale,
    shipping_methods: orderOrCart.shipping_methods?.map((method) => ({
      id: method.id,
      name: method.name,
      shipping_option_id: method.shipping_option_id,
      amount: method.amount,
    })),
  }
}

function normalizeLineItemsForTax(
  orderOrCart: OrderWorkflowDTO | CartWorkflowDTO,
  items: OrderLineItemDTO[] | CartLineItemDTO[]
): TaxableItemDTO[] {
  return items.map(
    (item) =>
      ({
        id: item.id,
        product_id: item.product_id!,
        product_type_id: item.product_type_id,
        quantity: item.quantity,
        unit_price: item.unit_price,
        currency_code: orderOrCart.currency_code,
      } as TaxableItemDTO)
  )
}

function normalizeLineItemsForShipping(
  orderOrCart: OrderWorkflowDTO | CartWorkflowDTO,
  shippingMethods: OrderShippingMethodDTO[] | CartShippingMethodDTO[]
): TaxableShippingDTO[] {
  return shippingMethods.map(
    (shippingMethod) =>
      ({
        id: shippingMethod.id,
        shipping_option_id: shippingMethod.shipping_option_id!,
        unit_price: shippingMethod.amount,
        currency_code: orderOrCart.currency_code,
      } as TaxableShippingDTO)
  )
}

export const getItemTaxLinesStepId = "get-item-tax-lines"
/**
 * This step retrieves the tax lines for an order or cart's line items and shipping methods.
 *
 * :::note
 *
 * You can retrieve an order, cart, item, shipping method, and address details using [Query](https://docs.medusajs.com/learn/fundamentals/module-links/query),
 * or [useQueryGraphStep](https://docs.medusajs.com/resources/references/medusa-workflows/steps/useQueryGraphStep).
 *
 * :::
 *
 * @example
 * const data = getItemTaxLinesStep({
 *   orderOrCart: {
 *     id: "order_123",
 *     // other order details...
 *   },
 *   items: [
 *     {
 *       id: "orli_123",
 *       // other order item details...
 *     }
 *   ],
 *   shipping_methods: [
 *     {
 *       id: "osm_213",
 *       // other shipping method details...
 *     }
 *   ],
 * })
 */
export const getItemTaxLinesStep = createStep(
  getItemTaxLinesStepId,
  async (data: GetItemTaxLinesStepInput, { container }) => {
    const {
      orderOrCart,
      items = [],
      shipping_methods: shippingMethods = [],
      force_tax_calculation: forceTaxCalculation = false,
      is_return: isReturn = false,
      shipping_address: shippingAddress,
    } = data

    const filteredItems = items.filter(
      (item) => !item.is_giftcard || !isDefined(item.is_giftcard)
    ) as OrderLineItemDTO[] | CartLineItemDTO[]

    const taxService = container.resolve<ITaxModuleService>(Modules.TAX)

    const taxContext = normalizeTaxModuleContext(
      orderOrCart,
      forceTaxCalculation,
      isReturn,
      shippingAddress
    )

    const stepResponseData = {
      lineItemTaxLines: [] as ItemTaxLineDTO[],
      shippingMethodsTaxLines: [] as ShippingTaxLineDTO[],
    }

    if (!taxContext) {
      return new StepResponse(stepResponseData)
    }

    if (items.length) {
      stepResponseData.lineItemTaxLines = (await taxService.getTaxLines(
        normalizeLineItemsForTax(orderOrCart, filteredItems),
        taxContext
      )) as ItemTaxLineDTO[]
    }

    if (shippingMethods.length) {
      stepResponseData.shippingMethodsTaxLines = (await taxService.getTaxLines(
        normalizeLineItemsForShipping(orderOrCart, shippingMethods),
        taxContext
      )) as ShippingTaxLineDTO[]
    }

    return new StepResponse(stepResponseData)
  }
)

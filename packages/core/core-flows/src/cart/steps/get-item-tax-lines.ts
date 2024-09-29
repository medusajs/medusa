import {
  CartLineItemDTO,
  CartShippingMethodDTO,
  CartWorkflowDTO,
  ITaxModuleService,
  ItemTaxLineDTO,
  ShippingTaxLineDTO,
  TaxCalculationContext,
  TaxableItemDTO,
  TaxableShippingDTO,
} from "@medusajs/framework/types"
import { MedusaError, Modules } from "@medusajs/framework/utils"
import { StepResponse, createStep } from "@medusajs/framework/workflows-sdk"

export interface GetItemTaxLinesStepInput {
  cart: CartWorkflowDTO
  items: CartLineItemDTO[]
  shipping_methods: CartShippingMethodDTO[]
  force_tax_calculation?: boolean
  is_return?: boolean
}

function normalizeTaxModuleContext(
  cart: CartWorkflowDTO,
  forceTaxCalculation: boolean,
  isReturn?: boolean
): TaxCalculationContext | null {
  const address = cart.shipping_address
  const shouldCalculateTax = forceTaxCalculation || cart.region?.automatic_taxes

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

  const customer = cart.customer
    ? {
        id: cart.customer.id,
        email: cart.customer.email,
        customer_groups: cart.customer.groups?.map((g) => g.id) || [],
      }
    : undefined

  return {
    address: {
      country_code: address.country_code,
      province_code: address.province,
      address_1: address.address_1,
      address_2: address.address_2,
      city: address.city,
      postal_code: address.postal_code,
    },
    customer,
    is_return: isReturn ?? false,
  }
}

function normalizeLineItemsForTax(
  cart: CartWorkflowDTO,
  items: CartLineItemDTO[]
): TaxableItemDTO[] {
  return items.map((item) => ({
    id: item.id,
    product_id: item.product_id!,
    product_name: item.variant_title,
    product_sku: item.variant_sku,
    product_type: item.product_type,
    product_type_id: item.product_type,
    quantity: item.quantity,
    unit_price: item.unit_price,
    currency_code: cart.currency_code,
  }))
}

function normalizeLineItemsForShipping(
  cart: CartWorkflowDTO,
  shippingMethods: CartShippingMethodDTO[]
): TaxableShippingDTO[] {
  return shippingMethods.map((shippingMethod) => ({
    id: shippingMethod.id,
    shipping_option_id: shippingMethod.shipping_option_id!,
    unit_price: shippingMethod.amount,
    currency_code: cart.currency_code,
  }))
}

export const getItemTaxLinesStepId = "get-item-tax-lines"
/**
 * This step retrieves the tax lines of the specified line items in a cart.
 */
export const getItemTaxLinesStep = createStep(
  getItemTaxLinesStepId,
  async (data: GetItemTaxLinesStepInput, { container }) => {
    const {
      cart,
      items,
      shipping_methods: shippingMethods,
      force_tax_calculation: forceTaxCalculation = false,
      is_return: isReturn = false,
    } = data

    const taxService = container.resolve<ITaxModuleService>(Modules.TAX)

    const taxContext = normalizeTaxModuleContext(
      cart,
      forceTaxCalculation,
      isReturn
    )

    if (!taxContext) {
      return new StepResponse({
        lineItemTaxLines: [],
        shippingMethodsTaxLines: [],
      })
    }

    const lineItemTaxLines = (await taxService.getTaxLines(
      normalizeLineItemsForTax(cart, items),
      taxContext
    )) as ItemTaxLineDTO[]

    const shippingMethodsTaxLines = (await taxService.getTaxLines(
      normalizeLineItemsForShipping(cart, shippingMethods),
      taxContext
    )) as ShippingTaxLineDTO[]

    return new StepResponse({
      lineItemTaxLines,
      shippingMethodsTaxLines,
    })
  }
)

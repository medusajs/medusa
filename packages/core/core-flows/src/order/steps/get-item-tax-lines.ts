import {
  ITaxModuleService,
  ItemTaxLineDTO,
  OrderLineItemDTO,
  OrderShippingMethodDTO,
  OrderWorkflowDTO,
  ShippingTaxLineDTO,
  TaxableItemDTO,
  TaxableShippingDTO,
  TaxCalculationContext,
} from "@medusajs/types"
import { MedusaError, ModuleRegistrationName } from "@medusajs/utils"
import { createStep, StepResponse } from "@medusajs/workflows-sdk"

interface StepInput {
  order: OrderWorkflowDTO
  items: OrderLineItemDTO[]
  shipping_methods: OrderShippingMethodDTO[]
  force_tax_calculation?: boolean
}

function normalizeTaxModuleContext(
  order: OrderWorkflowDTO,
  forceTaxCalculation: boolean
): TaxCalculationContext | null {
  const address = order.shipping_address
  const shouldCalculateTax =
    forceTaxCalculation || order.region?.automatic_taxes

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

  const customer = order.customer && {
    id: order.customer.id,
    email: order.customer.email,
    customer_groups: order.customer.groups?.map((g) => g.id) || [],
  }

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
    is_return: false,
  }
}

function normalizeLineItemsForTax(
  order: OrderWorkflowDTO,
  items: OrderLineItemDTO[]
): TaxableItemDTO[] {
  return items.map(
    (item) =>
      ({
        id: item.id,
        product_id: item.product_id!,
        product_name: item.variant_title,
        product_sku: item.variant_sku,
        product_type: item.product_type,
        product_type_id: item.product_type,
        quantity: item.quantity,
        unit_price: item.unit_price,
        currency_code: order.currency_code,
      } as TaxableItemDTO)
  )
}

function normalizeLineItemsForShipping(
  order: OrderWorkflowDTO,
  shippingMethods: OrderShippingMethodDTO[]
): TaxableShippingDTO[] {
  return shippingMethods.map(
    (shippingMethod) =>
      ({
        id: shippingMethod.id,
        shipping_option_id: shippingMethod.shipping_option_id!,
        unit_price: shippingMethod.amount,
        currency_code: order.currency_code,
      } as TaxableShippingDTO)
  )
}

export const getOrderItemTaxLinesStepId = "get-order-item-tax-lines"
export const getOrderItemTaxLinesStep = createStep(
  getOrderItemTaxLinesStepId,
  async (data: StepInput, { container }) => {
    const {
      order,
      items = [],
      shipping_methods: shippingMethods = [],
      force_tax_calculation: forceTaxCalculation = false,
    } = data
    const taxService = container.resolve<ITaxModuleService>(
      ModuleRegistrationName.TAX
    )

    const taxContext = normalizeTaxModuleContext(order, forceTaxCalculation)

    const stepResponseData = {
      lineItemTaxLines: [] as ItemTaxLineDTO[],
      shippingMethodsTaxLines: [] as ShippingTaxLineDTO[],
    }

    if (!taxContext) {
      return new StepResponse(stepResponseData)
    }

    if (items.length) {
      stepResponseData.lineItemTaxLines = (await taxService.getTaxLines(
        normalizeLineItemsForTax(order, items),
        taxContext
      )) as ItemTaxLineDTO[]
    }

    if (shippingMethods.length) {
      stepResponseData.shippingMethodsTaxLines = (await taxService.getTaxLines(
        normalizeLineItemsForShipping(order, shippingMethods),
        taxContext
      )) as ShippingTaxLineDTO[]
    }

    return new StepResponse(stepResponseData)
  }
)

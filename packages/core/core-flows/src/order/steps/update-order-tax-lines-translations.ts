import { createStep, StepResponse } from "@medusajs/framework/workflows-sdk"
import {
  applyTranslations,
  ContainerRegistrationKeys,
  FeatureFlag,
  Modules,
} from "@medusajs/framework/utils"

export const updateOrderTaxLinesTranslationsStepId =
  "update-order-tax-lines-translations"

interface UpdateOrderTaxLinesTranslationsStepInput {
  order_id: string
  locale: string
}

/**
 * This step updates the tax line descriptions of an order based on the provided locale.
 * It retrieves the original tax lines, applies translations, and updates the order accordingly.
 * In case of failure, it compensates by restoring the original tax line descriptions.
 * 
 * @since 2.13.0
 * 
 * @example
 * const result = updateOrderTaxLinesTranslationsStep({
 *   order_id: "order_123",
 *   locale: "fr-FR"
 * })
 */
export const updateOrderTaxLinesTranslationsStep = createStep(
  updateOrderTaxLinesTranslationsStepId,
  async (data: UpdateOrderTaxLinesTranslationsStepInput, { container }) => {
    const query = container.resolve(ContainerRegistrationKeys.QUERY)

    const isTranslationEnabled = FeatureFlag.isFeatureEnabled("translation")

    if (!isTranslationEnabled || !data.locale) {
      return new StepResponse(void 0, [])
    }

    const {
      data: [order],
    } = await query.graph({
      entity: "order",
      filters: { id: data.order_id },
      fields: [
        "items.tax_lines.id",
        "items.tax_lines.tax_rate_id",
        "items.tax_lines.description",
        "shipping_methods.tax_lines.id",
        "shipping_methods.tax_lines.tax_rate_id",
        "shipping_methods.tax_lines.description",
      ],
    })

    const orderModuleService = container.resolve(Modules.ORDER)

    const originalItemTaxLines = order.items.flatMap((item) => item.tax_lines)
    const originalShippingMethodsTaxLines = order.shipping_methods.flatMap(
      (shippingMethod) => shippingMethod.tax_lines
    )

    const translatedItemsTaxRates = originalItemTaxLines.map((taxLine) => ({
      id: taxLine.tax_rate_id,
      name: taxLine.description,
      tax_line_id: taxLine.id,
    }))

    await applyTranslations({
      localeCode: data.locale,
      objects: translatedItemsTaxRates,
      container,
    })

    const translatedShippingMethodsTaxRates =
      originalShippingMethodsTaxLines.map((taxLine) => ({
        id: taxLine.tax_rate_id,
        name: taxLine.description,
        tax_line_id: taxLine.id,
      }))

    await applyTranslations({
      localeCode: data.locale,
      objects: translatedShippingMethodsTaxRates,
      container,
    })

    await Promise.all([
      orderModuleService.upsertOrderLineItemTaxLines(
        translatedItemsTaxRates.map((taxRate) => ({
          id: taxRate.tax_line_id,
          description: taxRate.name,
        }))
      ),
      orderModuleService.upsertOrderShippingMethodTaxLines(
        translatedShippingMethodsTaxRates.map((taxRate) => ({
          id: taxRate.tax_line_id,
          description: taxRate.name,
        }))
      ),
    ])

    return new StepResponse(void 0, [
      originalItemTaxLines,
      originalShippingMethodsTaxLines,
    ])
  },
  async (compensation, { container }) => {
    if (!compensation?.length) {
      return
    }

    const [originalItemTaxLines, originalShippingMethodsTaxLines] = compensation

    const orderModuleService = container.resolve(Modules.ORDER)

    await Promise.all([
      orderModuleService.upsertOrderLineItemTaxLines(
        originalItemTaxLines.map((taxLine) => ({
          id: taxLine.id,
          description: taxLine.description,
        }))
      ),
      orderModuleService.upsertOrderShippingMethodTaxLines(
        originalShippingMethodsTaxLines.map((taxLine) => ({
          id: taxLine.id,
          description: taxLine.description,
        }))
      ),
    ])
  }
)

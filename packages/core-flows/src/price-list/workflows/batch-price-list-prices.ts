import {
  BatchPriceListPricesWorkflowDTO,
  BatchPriceListPricesWorkflowResult,
} from "@medusajs/types"
import {
  WorkflowData,
  createWorkflow,
  parallelize,
  transform,
} from "@medusajs/workflows-sdk"
import {
  createPriceListPricesStep,
  removePriceListPricesStep,
  updatePriceListPricesStep,
  validatePriceListsStep,
  validateVariantPriceLinksStep,
} from "../steps"

export const batchPriceListPricesWorkflowId = "batch-price-list-prices"
export const batchPriceListPricesWorkflow = createWorkflow(
  batchPriceListPricesWorkflowId,
  (
    input: WorkflowData<{
      data: BatchPriceListPricesWorkflowDTO
    }>
  ): WorkflowData<BatchPriceListPricesWorkflowResult> => {
    const [_, variantPriceCreateMap, variantPriceUpdateMap] = parallelize(
      validatePriceListsStep([{ id: input.data.id }]),
      validateVariantPriceLinksStep([{ prices: input.data.create }]),
      validateVariantPriceLinksStep([{ prices: input.data.update }]).config({
        name: "variant-price-link-map-update",
      })
    )

    const createPriceListPricesInput = transform(
      { data: input.data, map: variantPriceCreateMap },
      ({ data, map }) => ({
        data: [{ id: data.id, prices: data.create }],
        variant_price_map: map,
      })
    )

    const updatePriceListPricesInput = transform(
      { data: input.data, map: variantPriceUpdateMap },
      ({ data, map }) => ({
        data: [{ id: data.id, prices: data.update }],
        variant_price_map: map,
      })
    )

    const [created, updated, deleted] = parallelize(
      createPriceListPricesStep(createPriceListPricesInput),
      updatePriceListPricesStep(updatePriceListPricesInput),
      removePriceListPricesStep(input.data.delete)
    )

    return transform({ created, updated, deleted }, (data) => data)
  }
)

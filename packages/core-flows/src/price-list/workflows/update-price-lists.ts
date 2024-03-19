import { UpdatePriceListWorkflowInputDTO } from "@medusajs/types"
import {
  WorkflowData,
  createWorkflow,
  parallelize,
  transform,
} from "@medusajs/workflows-sdk"
import {
  createPriceListPricesStep,
  getExistingPriceListsPriceIdsStep,
  removePriceListPricesStep,
  updatePriceListsStep,
  validatePriceListsStep,
  validateVariantPriceLinksStep,
} from "../steps"

export const updatePriceListsWorkflowId = "update-price-lists"
export const updatePriceListsWorkflow = createWorkflow(
  updatePriceListsWorkflowId,
  (
    input: WorkflowData<{ price_lists_data: UpdatePriceListWorkflowInputDTO[] }>
  ): WorkflowData<void> => {
    const [priceListsMap, variantPriceMap] = parallelize(
      validatePriceListsStep(input.price_lists_data),
      validateVariantPriceLinksStep(input.price_lists_data)
    )

    const getPriceListPricesInput = transform({ priceListsMap }, (data) => ({
      price_list_ids: Object.keys(data.priceListsMap),
    }))

    const priceListPriceIdMap = getExistingPriceListsPriceIdsStep(
      getPriceListPricesInput
    )

    const removePriceListPricesInput = transform(
      { priceListPriceIdMap },
      (data) => Object.values(data.priceListPriceIdMap).flat(1)
    )

    removePriceListPricesStep(removePriceListPricesInput)

    const updatePricesInput = transform({ variantPriceMap, input }, (data) => ({
      data: data.input.price_lists_data,
      variant_price_map: data.variantPriceMap,
    }))

    createPriceListPricesStep(updatePricesInput)

    const updatePriceListInput = transform({ input }, (data) => {
      return data.input.price_lists_data.map((priceListData) => {
        delete priceListData.prices

        return priceListData
      })
    })

    updatePriceListsStep(updatePriceListInput)
  }
)

import {
  IPricingModuleService,
  UpdatePriceListDTO,
  UpdatePriceListWorkflowInputDTO,
} from "@medusajs/types"
import {
  ModuleRegistrationName,
  buildPriceListRules,
  convertItemResponseToUpdateRequest,
  getSelectsAndRelationsFromObjectArray,
} from "@medusajs/utils"
import { StepResponse, createStep } from "@medusajs/workflows-sdk"

export const updatePriceListsStepId = "update-price-lists"
export const updatePriceListsStep = createStep(
  updatePriceListsStepId,
  async (data: UpdatePriceListDTO[], { container }) => {
    const pricingModule = container.resolve<IPricingModuleService>(
      ModuleRegistrationName.PRICING
    )

    const { dataBeforeUpdate, selects, relations } = await getDataBeforeUpdate(
      pricingModule,
      data
    )

    const updatedPriceLists = await pricingModule.updatePriceLists(data)

    return new StepResponse(updatedPriceLists, {
      dataBeforeUpdate,
      selects,
      relations,
    })
  },
  async (revertInput, { container }) => {
    if (!revertInput) {
      return
    }

    const { dataBeforeUpdate, selects, relations } = revertInput
    const pricingModule = container.resolve<IPricingModuleService>(
      ModuleRegistrationName.PRICING
    )

    await pricingModule.updatePriceLists(
      dataBeforeUpdate.map((data) => {
        const { price_list_rules: priceListRules = [], ...rest } = data

        const updateData: UpdatePriceListDTO = {
          ...rest,
          rules: buildPriceListRules(priceListRules),
        }

        return convertItemResponseToUpdateRequest(
          updateData,
          selects,
          relations
        )
      })
    )
  }
)

// Since rules is an API level abstraction, we need to do this dance of data fetching
// to its actual attributes in the module to do perform a revert in case a rollback needs to happen.
// TODO: Check if there is a better way to approach this. Preferably the module should be handling this
// if this is not the response the module provides.
async function getDataBeforeUpdate(
  pricingModule: IPricingModuleService,
  data: UpdatePriceListWorkflowInputDTO[]
) {
  const { selects, relations } = getSelectsAndRelationsFromObjectArray(data, {
    objectFields: ["rules"],
  })
  const selectsClone = [...selects]
  const relationsClone = [...relations]

  if (selectsClone.includes("rules")) {
    const index = selectsClone.indexOf("rules", 0)

    if (index > -1) {
      selectsClone.splice(index, 1)
    }

    selectsClone.push("price_list_rules.value", "price_list_rules.attribute")
    relationsClone.push("price_list_rules")
  }

  const dataBeforeUpdate = await pricingModule.listPriceLists(
    { id: data.map((d) => d.id) },
    { relations: relationsClone, select: selectsClone }
  )

  return {
    dataBeforeUpdate,
    selects,
    relations,
  }
}

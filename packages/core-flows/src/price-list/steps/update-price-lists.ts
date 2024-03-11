import { ModuleRegistrationName } from "@medusajs/modules-sdk"
import {
  AddPriceListPricesDTO,
  CreatePriceListPriceDTO,
  CreatePriceListPriceWorkflowDTO,
  IPricingModuleService,
  UpdatePriceListDTO,
  UpdatePriceListPriceDTO,
  UpdatePriceListPriceWorkflowDTO,
  UpdatePriceListPricesDTO,
  UpdatePriceListWorkflowInputDTO,
} from "@medusajs/types"
import {
  ContainerRegistrationKeys,
  MedusaError,
  buildPriceListRules,
  convertItemResponseToUpdateRequest,
  getSelectsAndRelationsFromObjectArray,
  remoteQueryObjectFromString,
} from "@medusajs/utils"
import { StepResponse, createStep } from "@medusajs/workflows-sdk"

export const updatePriceListsStepId = "update-price-lists"
export const updatePriceListsStep = createStep(
  updatePriceListsStepId,
  async (data: UpdatePriceListWorkflowInputDTO[], { container }) => {
    const remoteQuery = container.resolve(
      ContainerRegistrationKeys.REMOTE_QUERY
    )
    const pricingModule = container.resolve<IPricingModuleService>(
      ModuleRegistrationName.PRICING
    )

    const variantIds: string[] = data
      .map((pl) => pl?.prices?.map((price) => price.variant_id!) || [])
      .filter(Boolean)
      .flat(1)

    const variantPricingLinkQuery = remoteQueryObjectFromString({
      entryPoint: "product_variant_price_set",
      fields: ["variant_id", "price_set_id"],
      variables: {
        variant_id: variantIds,
        take: null,
      },
    })

    const links = await remoteQuery(variantPricingLinkQuery)
    const variantPriceSetMap: Map<string, string> = new Map(
      links.map((link) => [link.variant_id, link.price_set_id])
    )
    const withoutLinks = variantIds.filter((id) => !variantPriceSetMap.has(id!))

    if (withoutLinks.length) {
      throw new MedusaError(
        MedusaError.Types.INVALID_DATA,
        `No priceSet exist for variants: ${withoutLinks.join(", ")}`
      )
    }

    const priceListDataToUpdate: UpdatePriceListDTO[] = []
    const priceListPricesToUpdate: UpdatePriceListPricesDTO[] = []
    const priceListPricesToAdd: AddPriceListPricesDTO[] = []

    for (const priceListData of data) {
      const { prices, ...rest } = priceListData
      const pricesToAdd: CreatePriceListPriceDTO[] = []
      const pricesToUpdate: UpdatePriceListPriceDTO[] = []

      priceListDataToUpdate.push(rest)

      if (typeof prices === "undefined") {
        continue
      }

      for (const price of prices) {
        const priceSetId = variantPriceSetMap.get(price.variant_id!)!

        if (isPriceUpdate(price)) {
          pricesToUpdate.push({
            ...price,
            price_set_id: priceSetId,
          })
        } else {
          pricesToAdd.push({ ...price, price_set_id: priceSetId })
        }
      }

      if (pricesToUpdate.length) {
        priceListPricesToUpdate.push({
          price_list_id: priceListData.id,
          prices: pricesToUpdate,
        })
      }

      if (pricesToAdd.length) {
        priceListPricesToAdd.push({
          price_list_id: priceListData.id,
          prices: pricesToAdd,
        })
      }
    }

    const { dataBeforeUpdate, selects, relations } = await getDataBeforeUpdate(
      pricingModule,
      priceListDataToUpdate
    )

    const updatedPriceLists = await pricingModule.updatePriceLists(
      priceListDataToUpdate
    )

    await pricingModule.addPriceListPrices(priceListPricesToAdd)
    await pricingModule.updatePriceListPrices(priceListPricesToUpdate)

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
        const { price_list_rules: priceListRules = [], rules, ...rest } = data

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

function isPriceUpdate(
  data: UpdatePriceListPriceWorkflowDTO | CreatePriceListPriceWorkflowDTO
): data is UpdatePriceListPriceWorkflowDTO {
  return "id" in data
}

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

    selectsClone.push(
      "price_list_rules.price_list_rule_values.value",
      "price_list_rules.rule_type.rule_attribute"
    )
    relationsClone.push(
      "price_list_rules.price_list_rule_values",
      "price_list_rules.rule_type"
    )
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

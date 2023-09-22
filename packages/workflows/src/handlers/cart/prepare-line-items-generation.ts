import { ProductTypes } from "@medusajs/types"
import { Modules, ModulesDefinition } from "@medusajs/modules-sdk"
import {
  LineItemCreateData,
  prepareLineItemData,
  validateItemsInput,
} from "@medusajs/utils"

import { WorkflowArguments } from "../../helper"

type HandlerInputData = {
  createCartInput: {
    items: {
      variant_id: string
      quantity: number
      unit_price?: number
    }[]
  }
}

enum Aliases {
  CreateCartInput = "createCartInput",
}

export async function prepareLineItemsGeneration({
  container,
  data,
}: WorkflowArguments<HandlerInputData>): Promise<LineItemCreateData[]> {
  const items = data[Aliases.CreateCartInput].items

  if (!items?.length) {
    return []
  }

  const ids = items.map((i) => i.variant_id)

  const productModuleService: ProductTypes.IProductModuleService =
    container.resolve(ModulesDefinition[Modules.PRODUCT].registrationName)

  const variants = await productModuleService.listVariants(
    {
      id: ids as string[],
    },
    { relations: ["product"] }
  )

  validateItemsInput(items, variants)

  return items.map((item) => {
    const variant = variants.find((v) => v.id === item.variant_id)!
    return prepareLineItemData(variant, item.quantity, item.unit_price)
  })
}

prepareLineItemsGeneration.aliases = Aliases

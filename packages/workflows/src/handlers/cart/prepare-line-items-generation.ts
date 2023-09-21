import { ProductTypes, ProductVariantDTO } from "@medusajs/types"
import { Modules, ModulesDefinition } from "@medusajs/modules-sdk"
import { LineItemCreateData, prepareLineItemData } from "@medusajs/utils"

import { WorkflowArguments } from "../../helper"

type HandlerInputData = {
  items: {
    variant_id: string
    quantity: number
    unit_price?: number
  }[]
}

enum Aliases {
  items = "items",
}

export async function prepareLineItemsGeneration({
  container,
  data,
}: WorkflowArguments<HandlerInputData>): Promise<LineItemCreateData[]> {
  const { items } = data

  const ids = items.map((i) => i!.variant_id)

  const productModuleService: ProductTypes.IProductModuleService =
    container.resolve(ModulesDefinition[Modules.PRODUCT].registrationName)

  const variants = await productModuleService.listVariants({
    id: ids as string[],
  })

  return items.map((item) => {
    const variant = variants.find((v) => v.id === item.variant_id)!
    return prepareLineItemData(variant, item.quantity, item.unit_price)
  })
}

prepareLineItemsGeneration.aliases = Aliases

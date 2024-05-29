import { CreateInventoryItemInput } from "./mutations"

export type CreateVariantInventoryItemDTO = CreateInventoryItemInput & {
  variant_id: string
}

export type CreateVariantInventoryItemWorkflowInputDTO = {
  data: CreateVariantInventoryItemDTO[]
}

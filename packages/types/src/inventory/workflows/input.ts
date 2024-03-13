import { CreateInventoryItemInput } from "../mutations"

export interface TaggedInventoryItem extends CreateInventoryItemInput {
  _associationTag?: string
}

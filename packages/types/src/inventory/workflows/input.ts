import { CreateInventoryItemInput } from "../mutations"

export interface TaggedInventoryItem extends CreateInventoryItemInput {
  tag?: string
}

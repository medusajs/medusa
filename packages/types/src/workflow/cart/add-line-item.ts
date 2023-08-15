import { AddLineItemVariantToCartDTO } from "../../line-item"

export type AddLineItemToCartWorkflowDTO = {
  line_items: AddLineItemVariantToCartDTO[]
  cart_id: string
}

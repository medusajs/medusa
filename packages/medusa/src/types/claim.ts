import { ClaimType, Order } from "../models"
import { AddressPayload } from "./common"

export type ClaimTypeValue = `${ClaimType}`

export enum ClaimItemReason {
  missing_item = "missing_item",
  wrong_item = "wrong_item",
  production_failure = "production_failure",
  other = "other",
}

export type ClaimItemReasonValue = `${ClaimItemReason}`

/* CREATE INPUT */

export type CreateClaimInput = {
  type: ClaimTypeValue
  claim_items: CreateClaimItemInput[]
  return_shipping?: CreateClaimReturnShippingInput
  additional_items?: CreateClaimItemAdditionalItemInput[]
  shipping_methods?: CreateClaimShippingMethodInput[]
  refund_amount?: number
  shipping_address?: AddressPayload
  no_notification?: boolean
  metadata?: object
  order: Order
  claim_order_id?: string
  shipping_address_id?: string
}

type CreateClaimReturnShippingInput = {
  option_id?: string
  price?: number
}

type CreateClaimShippingMethodInput = {
  id?: string
  option_id?: string
  price?: number
}

type CreateClaimItemInput = {
  item_id: string
  quantity: number
  note?: string
  reason?: ClaimItemReasonValue
  tags?: string[]
  images?: string[]
}

type CreateClaimItemAdditionalItemInput = {
  variant_id: string
  quantity: number
}

/* UPDATE INPUT */

export type UpdateClaimInput = {
  claim_items?: UpdateClaimItemInput[]
  shipping_methods?: UpdateClaimShippingMethodInput[]
  no_notification?: boolean
  metadata?: Record<string, unknown>
}

type UpdateClaimShippingMethodInput = {
  id?: string
  option_id?: string
  price?: number
}

type UpdateClaimItemInput = {
  id: string
  note?: string
  reason?: string
  images: UpdateClaimItemImageInput[]
  tags: UpdateClaimItemTagInput[]
  metadata?: object
}

type UpdateClaimItemImageInput = {
  id?: string
  url?: string
}

type UpdateClaimItemTagInput = {
  id?: string
  value?: string
}

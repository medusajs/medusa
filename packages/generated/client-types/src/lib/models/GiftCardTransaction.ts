/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import { SetRelation, Merge } from "../core/ModelUtils"

import type { GiftCard } from "./GiftCard"
import type { Order } from "./Order"

/**
 * Gift Card Transactions are created once a Customer uses a Gift Card to pay for their Order.
 */
export interface GiftCardTransaction {
  /**
   * The gift card transaction's ID
   */
  id: string
  /**
   * The ID of the Gift Card that was used in the transaction.
   */
  gift_card_id: string
  /**
   * The details of the gift card associated used in this transaction.
   */
  gift_card?: GiftCard | null
  /**
   * The ID of the order that the gift card was used for payment.
   */
  order_id: string
  /**
   * The details of the order that the gift card was used for payment.
   */
  order?: Order | null
  /**
   * The amount that was used from the Gift Card.
   */
  amount: number
  /**
   * The date with timezone at which the resource was created.
   */
  created_at: string
  /**
   * Whether the transaction is taxable or not.
   */
  is_taxable: boolean | null
  /**
   * The tax rate of the transaction
   */
  tax_rate: number | null
}

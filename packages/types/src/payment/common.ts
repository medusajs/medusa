import { BaseFilterable } from "../dal"
import { OperatorMap } from "../dal/utils"

/* ********** PAYMENT COLLECTION ********** */

/**
 * @enum
 *
 * The payment collection's status.
 */
export enum PaymentCollectionStatus {
  /**
   * The payment collection isn't paid.
   */
  NOT_PAID = "not_paid",
  /**
   * The payment collection is awaiting payment.
   */
  AWAITING = "awaiting",
  /**
   * The payment collection is authorized.
   */
  AUTHORIZED = "authorized",
  /**
   * Some of the payments in the payment collection are authorized.
   */
  PARTIALLY_AUTHORIZED = "partially_authorized",
  /**
   * The payment collection is canceled.
   */
  CANCELED = "canceled",
}

export interface PaymentCollectionDTO {
  /**
   * The ID of the Payment Collection
   */
  id: string
}

export interface FilterablePaymentCollectionProps
  extends BaseFilterable<PaymentCollectionDTO> {
  id?: string | string[]

  region_id?: string | string[] | OperatorMap<string>

  created_at?: OperatorMap<string>
  updated_at?: OperatorMap<string>
}

/* ********** PAYMENT ********** */

export interface PaymentDTO {
  /**
   * The ID of the Payment Collection
   */
  id: string
}

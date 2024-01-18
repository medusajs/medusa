import { BaseFilterable } from "../dal"
import { OperatorMap } from "../dal/utils"

/* ********** PAYMENT COLLECTION ********** */

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

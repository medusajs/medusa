/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import { SetRelation, Merge } from "../core/ModelUtils"

export interface StoreCustomersListPaymentMethodsRes {
  payment_methods: Array<{
    /**
     * The id of the Payment Provider where the payment method is saved.
     */
    provider_id: string
    /**
     * The data needed for the Payment Provider to use the saved payment method.
     */
    data: Record<string, any>
  }>
}

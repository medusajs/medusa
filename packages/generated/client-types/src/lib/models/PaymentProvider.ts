/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import { SetRelation, Merge } from "../core/ModelUtils"

/**
 * A payment provider represents a payment service installed in the Medusa backend, either through a plugin or backend customizations. It holds the payment service's installation status.
 */
export interface PaymentProvider {
  /**
   * The ID of the payment provider as given by the payment service.
   */
  id: string
  /**
   * Whether the payment service is installed in the current version. If a payment service is no longer installed, the `is_installed` attribute is set to `false`.
   */
  is_installed: boolean
}

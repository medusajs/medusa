/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import { SetRelation, Merge } from "../core/ModelUtils"

/**
 * A fulfillment provider represents a fulfillment service installed in the Medusa backend, either through a plugin or backend customizations. It holds the fulfillment service's installation status.
 */
export interface FulfillmentProvider {
  /**
   * The ID of the fulfillment provider as given by the fulfillment service.
   */
  id: string
  /**
   * Whether the fulfillment service is installed in the current version. If a fulfillment service is no longer installed, the `is_installed` attribute is set to `false`.
   */
  is_installed: boolean
}

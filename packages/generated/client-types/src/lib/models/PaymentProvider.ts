/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import { SetRelation, Merge } from "../core/ModelUtils"

/**
 * Represents a Payment Provider plugin and holds its installation status.
 */
export interface PaymentProvider {
  /**
   * The id of the payment provider as given by the plugin.
   */
  id: string
  /**
   * Whether the plugin is installed in the current version. Plugins that are no longer installed are not deleted by will have this field set to `false`.
   */
  is_installed: boolean
}

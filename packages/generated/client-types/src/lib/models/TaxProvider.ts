/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import { SetRelation, Merge } from "../core/ModelUtils"

/**
 * A tax provider represents a tax service installed in the Medusa backend, either through a plugin or backend customizations. It holds the tax service's installation status.
 */
export interface TaxProvider {
  /**
   * The ID of the tax provider as given by the tax service.
   */
  id: string
  /**
   * Whether the tax service is installed in the current version. If a tax service is no longer installed, the `is_installed` attribute is set to `false`.
   */
  is_installed: boolean
}

/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

/**
 * The tax service used to calculate taxes
 */
export type TaxProvider = {
  /**
   * The id of the tax provider as given by the plugin.
   */
  id: string;
  /**
   * Whether the plugin is installed in the current version. Plugins that are no longer installed are not deleted by will have this field set to `false`.
   */
  is_installed: boolean;
};


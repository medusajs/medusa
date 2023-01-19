/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

export type AdminGetShippingOptionsParams = {
  /**
   * Region ID to fetch options from
   */
  region_id?: string;
  /**
   * Flag for fetching return options only
   */
  is_return?: boolean;
  /**
   * Flag for fetching admin specific options
   */
  admin_only?: boolean;
};


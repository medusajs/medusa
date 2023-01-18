/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

export type AdminGetShippingOptionsParams = {
  /**
   * Region ID to fetch options from
   */
  regionId?: string;
  /**
   * Flag for fetching return options only
   */
  isReturn?: boolean;
  /**
   * Flag for fetching admin specific options
   */
  adminOnly?: boolean;
};


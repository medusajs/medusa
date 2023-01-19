/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { AddressFields } from './AddressFields';

export type AdminPostDraftOrdersDraftOrderReq = {
  /**
   * The ID of the Region to create the Draft Order in.
   */
  region_id?: string;
  /**
   * The 2 character ISO code for the Country.
   */
  country_code?: string;
  /**
   * An email to be used on the Draft Order.
   */
  email?: string;
  /**
   * The Address to be used for billing purposes.
   */
  billing_address?: (AddressFields | string);
  /**
   * The Address to be used for shipping.
   */
  shipping_address?: (AddressFields | string);
  /**
   * An array of Discount codes to add to the Draft Order.
   */
  discounts?: Array<{
    /**
     * The code that a Discount is identifed by.
     */
    code: string;
  }>;
  /**
   * An optional flag passed to the resulting order to determine use of notifications.
   */
  no_notification_order?: boolean;
  /**
   * The ID of the Customer to associate the Draft Order with.
   */
  customer_id?: string;
};


/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

export type AdminPostCustomersCustomerReq = {
  /**
   * The Customer's email.
   */
  email?: string;
  /**
   * The Customer's first name.
   */
  first_name?: string;
  /**
   * The Customer's last name.
   */
  last_name?: string;
  /**
   * The Customer's phone number.
   */
  phone?: string;
  /**
   * The Customer's password.
   */
  password?: string;
  /**
   * A list of customer groups to which the customer belongs.
   */
  groups?: Array<any>;
  /**
   * An optional set of key-value pairs to hold additional information.
   */
  metadata?: Record<string, any>;
};


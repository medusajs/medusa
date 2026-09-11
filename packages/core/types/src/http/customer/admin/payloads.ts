import {
  BaseCreateCustomer,
  BaseCreateCustomerAddress,
  BaseUpdateCustomer,
  BaseUpdateCustomerAddress,
} from "../common"

export interface AdminCreateCustomer extends BaseCreateCustomer {}
export interface AdminUpdateCustomer extends BaseUpdateCustomer {}

export interface AdminCreateCustomerAddress extends BaseCreateCustomerAddress {}
export interface AdminUpdateCustomerAddress extends BaseUpdateCustomerAddress {}

export interface AdminExportCustomerRequest {
  /**
   * The format of the exported file. Defaults to `json`.
   */
  format?: "csv" | "json"
  /**
   * The batch size to use when querying customers.
   */
  batch_size?: number | string
}

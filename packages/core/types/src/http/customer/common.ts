import { BaseFilterable, OperatorMap } from "../../dal"
import { FindParams } from "../common"

export interface BaseCustomerGroup {
  id: string
  name: string | null
  customers: BaseCustomer[]
  metadata: Record<string, unknown> | null
  created_at: string
  updated_at: string
}

export interface BaseCustomerAddress {
  /**
   * The address's ID.
   */
  id: string
  /**
   * The address's name.
   */
  address_name: string | null
  /**
   * Whether the address is used by default for shipping.
   */
  is_default_shipping: boolean
  /**
   * Whether the address is used by default for billing.
   */
  is_default_billing: boolean
  /**
   * The ID of the customer this address belongs to.
   */
  customer_id: string
  /**
   * The address's company.
   */
  company: string | null
  /**
   * The address's first name.
   */
  first_name: string | null
  /**
   * The address's last name.
   */
  last_name: string | null
  /**
   * The address's first line.
   */
  address_1: string | null
  /**
   * The address's second line.
   */
  address_2: string | null
  /**
   * The address's city.
   */
  city: string | null
  /**
   * The address's country code.
   * 
   * @example
   * us
   */
  country_code: string | null
  /**
   * The address's province.
   */
  province: string | null
  /**
   * The address's postal code.
   */
  postal_code: string | null
  /**
   * The address's phone number.
   */
  phone: string | null
  /**
   * Key-value pairs of custom data.
   */
  metadata: Record<string, unknown> | null
  /**
   * The date the address was created.
   */
  created_at: string
  /**
   * The date the address was updated.
   */
  updated_at: string
}

export interface BaseCustomer {
  /**
   * The customer's ID.
   */
  id: string
  /**
   * The customer's email.
   */
  email: string
  /**
   * The ID of the customer's default billing address.
   */
  default_billing_address_id: string | null
  /**
   * The ID of the customer's default shipping address.
   */
  default_shipping_address_id: string | null
  /**
   * The customer's company name.
   */
  company_name: string | null
  /**
   * The customer's first name.
   */
  first_name: string | null
  /**
   * The customer's last name.
   */
  last_name: string | null
  /**
   * The customer's addresses
   */
  addresses: BaseCustomerAddress[]
  /**
   * The customer's phone.
   */
  phone?: string | null
  /**
   * Key-value pairs of custom data.
   */
  metadata?: Record<string, unknown>
  /**
   * The ID of the user that created the customer.
   */
  created_by?: string | null
  /**
   * The date the customer was deleted.
   */
  deleted_at?: Date | string | null
  /**
   * The date the customer was created.
   */
  created_at?: Date | string
  /**
   * The date the customer was updated.
   */
  updated_at?: Date | string
}

export interface CustomerGroupInCustomerFilters {
  /**
   * Filter by customer group ID(s).
   */
  id: string[] | string
  /**
   * Filter by name(s).
   */
  name: string[] | string
  /**
   * Apply filters on the group's creation date.
   */
  created_at: OperatorMap<string>
  /**
   * Apply filters on the group's update date.
   */
  updated_at: OperatorMap<string>
  /**
   * Apply filters on the group's deletion date.
   */
  deleted_at: OperatorMap<string>
}

export interface BaseCustomerFilters
  extends FindParams,
    BaseFilterable<BaseCustomerFilters> {
  /**
   * Query or keywords to apply on the customer's searchable fields.
   */
  q?: string
  /**
   * Filter by customer ID(s).
   */
  id?: string[] | string | OperatorMap<string | string[]>
  /**
   * Filter by email(s).
   */
  email?: string[] | string | OperatorMap<string>
  /**
   * Filter by company name(s).
   */
  company_name?: string[] | string | OperatorMap<string>
  /**
   * Filter by first name(s).
   */
  first_name?: string[] | string | OperatorMap<string>
  /**
   * Filter by last name(s).
   */
  last_name?: string[] | string | OperatorMap<string>
  /**
   * Filter by user ID(s) to retrieve the customers they created.
   */
  created_by?: string[] | string | OperatorMap<string>
  /**
   * Apply filters on the customer's creation date.
   */
  created_at?: OperatorMap<string>
  /**
   * Apply filters on the customer's update date.
   */
  updated_at?: OperatorMap<string>
  /**
   * Apply filters on the customer's deletion date.
   */
  deleted_at?: OperatorMap<string>
}

export interface BaseCustomerAddressFilters
  extends BaseFilterable<BaseCustomerAddressFilters> {
  /**
   * A query or keyword to search the address's searchable fields.
   */
  q?: string
  /**
   * Filter by company name(s).
   */
  company?: string[] | string
  /**
   * Filter by cities.
   */
  city?: string[] | string
  /**
   * Filter by country code(s).
   */
  country_code?: string[] | string
  /**
   * Filter by province(s).
   */
  province?: string[] | string
  /**
   * Filter by postal code(s).
   */
  postal_code?: string[] | string
}

export interface BaseCreateCustomer {
  /**
   * The customer's email.
   */
  email: string
  /**
   * The customer's company name.
   */
  company_name?: string
  /**
   * The customer's first name.
   */
  first_name?: string
  /**
   * The customer's last name.
   */
  last_name?: string
  /**
   * The customer's phone number.
   */
  phone?: string
  /**
   * Key-value pairs of custom data.
   */
  metadata?: Record<string, unknown>
}

export interface BaseUpdateCustomer {
  /**
   * The customer's company name.
   */
  company_name?: string
  /**
   * The customer's first name.
   */
  first_name?: string
  /**
   * The customer's last name.
   */
  last_name?: string
  /**
   * The customer's phone number.
   */
  phone?: string
  /**
   * Key-value pairs of custom data.
   */
  metadata?: Record<string, unknown>
}

export interface BaseCreateCustomerAddress {
  /**
   * The address's first name.
   */
  first_name?: string
  /**
   * The address's last name.
   */
  last_name?: string
  /**
   * The address's phone.
   */
  phone?: string
  /**
   * The address's company.
   */
  company?: string
  /**
   * The address's first line.
   */
  address_1?: string
  /**
   * The address's second line.
   */
  address_2?: string
  /**
   * The address's city.
   */
  city?: string
  /**
   * The address's country code.
   * 
   * @example
   * us
   */
  country_code?: string
  /**
   * The address's province.
   */
  province?: string
  /**
   * The address's postal code.
   */
  postal_code?: string
  /**
   * Key-value pairs of custom data.
   */
  metadata?: Record<string, unknown>
  /**
   * The address's name.
   */
  address_name?: string
  /**
   * Whether the address is used by default for shipping.
   */
  is_default_shipping?: boolean
  /**
   * Whether the address is used by default for billing.
   */
  is_default_billing?: boolean
}

export interface BaseUpdateCustomerAddress {
  /**
   * The address's first name.
   */
  first_name?: string
  /**
   * The address's last name.
   */
  last_name?: string
  /**
   * The address's phone.
   */
  phone?: string
  /**
   * The address's company.
   */
  company?: string
  /**
   * The address's first line.
   */
  address_1?: string
  /**
   * The address's second line.
   */
  address_2?: string
  /**
   * The address's city.
   */
  city?: string
  /**
   * The address's country code.
   * 
   * @example
   * us
   */
  country_code?: string
  /**
   * The address's province.
   */
  province?: string
  /**
   * The address's postal code.
   */
  postal_code?: string
  /**
   * Key-value pairs of custom data.
   */
  metadata?: Record<string, unknown> | null
  /**
   * The address's name.
   */
  address_name?: string
  /**
   * Whether the address is used by default for shipping.
   */
  is_default_shipping?: boolean
  /**
   * Whether the address is used by default for billing.
   */
  is_default_billing?: boolean
}

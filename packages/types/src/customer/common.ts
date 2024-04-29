import { AddressDTO } from "../address"
import { BaseFilterable } from "../dal"
import { OperatorMap } from "../dal/utils"

/**
 * The customer address details.
 */
export interface CustomerAddressDTO {
  /**
   * The ID of the customer address.
   */
  id: string

  /**
   * The address name of the customer address.
   */
  address_name?: string

  /**
   * Whether the customer address is default shipping.
   */
  is_default_shipping: boolean

  /**
   * Whether the customer address is default billing.
   */
  is_default_billing: boolean

  /**
   * The associated customer's ID.
   */
  customer_id: string

  /**
   * The company of the customer address.
   */
  company?: string

  /**
   * The first name of the customer address.
   */
  first_name?: string

  /**
   * The last name of the customer address.
   */
  last_name?: string

  /**
   * The address 1 of the customer address.
   */
  address_1?: string

  /**
   * The address 2 of the customer address.
   */
  address_2?: string

  /**
   * The city of the customer address.
   */
  city?: string

  /**
   * The country code of the customer address.
   */
  country_code?: string

  /**
   * The province of the customer address.
   */
  province?: string

  /**
   * The postal code of the customer address.
   */
  postal_code?: string

  /**
   * The phone of the customer address.
   */
  phone?: string

  /**
   * Holds custom data in key-value pairs.
   */
  metadata?: Record<string, unknown>

  /**
   * The created at of the customer address.
   */
  created_at: string

  /**
   * The updated at of the customer address.
   */
  updated_at: string
}

/**
 * The filters to apply on the retrieved customer address.
 */
export interface FilterableCustomerAddressProps
  extends BaseFilterable<FilterableCustomerAddressProps> {
  /**
   * Searches for addreses by properties such as name and street using this search term.
   */
  q?: string

  /**
   * The IDs to filter the customer address by.
   */
  id?: string | string[]

  /**
   * Filter addresses by name.
   */
  address_name?: string | OperatorMap<string>

  /**
   * Filter addresses by whether they're the default for shipping.
   */
  is_default_shipping?: boolean | OperatorMap<boolean>

  /**
   * Filter addresses by whether they're the default for billing.
   */
  is_default_billing?: boolean | OperatorMap<boolean>

  /**
   * Filter addresses by the associated customer's ID.
   */
  customer_id?: string | string[]

  /**
   * Filter addresses by the associated customer.
   */
  customer?: FilterableCustomerProps | string | string[]

  /**
   * Filter addresses by company.
   */
  company?: string | OperatorMap<string>

  /**
   * Filter addresses by first name.
   */
  first_name?: string | OperatorMap<string>

  /**
   * Filter addresses by last name.
   */
  last_name?: string | OperatorMap<string>

  /**
   * Filter addresses by first address line.
   */
  address_1?: string | OperatorMap<string>

  /**
   * Filter addresses by second address line.
   */
  address_2?: string | OperatorMap<string>

  /**
   * Filter addresses by city.
   */
  city?: string | OperatorMap<string>

  /**
   * Filter addresses by country code.
   */
  country_code?: string | OperatorMap<string>

  /**
   * Filter addresses by province.
   */
  province?: string | OperatorMap<string>

  /**
   * Filter addresses by postal code.
   */
  postal_code?: string | OperatorMap<string>

  /**
   * Filter addresses by phone number.
   */
  phone?: string | OperatorMap<string>

  /**
   * Holds custom data in key-value pairs.
   */
  metadata?: Record<string, unknown> | OperatorMap<Record<string, unknown>>

  /**
   * Filter addresses by created date.
   */
  created_at?: OperatorMap<string>

  /**
   * Filter addresses by updated date.
   */
  updated_at?: OperatorMap<string>
}

/**
 * The filters to apply on the retrieved customer group.
 */
export interface FilterableCustomerGroupProps
  extends BaseFilterable<FilterableCustomerGroupProps> {
  /**
   * Searches for customer groups by name using this search term.
   */
  q?: string

  /**
   * The IDs to filter the customer group by.
   */
  id?: string | string[]

  /**
   * Filter customer groups by name.
   */
  name?: string | OperatorMap<string>

  /**
   * Filter customer groups by associated customers.
   */
  customers?: FilterableCustomerProps | string | string[]

  /**
   * Filter customer groups by their `created_by` attribute.
   */
  created_by?: string | string[] | null

  /**
   * Filter customer groups by created date.
   */
  created_at?: OperatorMap<string>

  /**
   * Filter customer groups by updated date.
   */
  updated_at?: OperatorMap<string>
}

/**
 * The filters to apply on the retrieved customer group's customers.
 */
export interface FilterableCustomerGroupCustomerProps
  extends BaseFilterable<FilterableCustomerGroupCustomerProps> {
  /**
   * The IDs to filter the customer group's customer relation.
   */
  id?: string | string[]

  /**
   * Filter by customer ID(s).
   */
  customer_id?: string | string[]

  /**
   * Filter by customer group ID(s).
   */
  customer_group_id?: string | string[]

  /**
   * Filter by customer IDs or filterable customer attributes.
   */
  customer?: FilterableCustomerProps | string | string[]

  /**
   * Filter by customer group IDs or filterable group attributes.
   */
  group?: FilterableCustomerGroupProps | string | string[]

  /**
   * Filter by the group's `created_by` attribute.
   */
  created_by?: string | string[] | null

  /**
   * Filter by created date.
   */
  created_at?: OperatorMap<string>

  /**
   * Filter by updated date.
   */
  updated_at?: OperatorMap<string>
}

/**
 * The filters to apply on the retrieved customer.
 */
export interface FilterableCustomerProps
  extends BaseFilterable<FilterableCustomerProps> {
  /**
   * Searches for customers by properties such as name and email using this search term.
   */
  q?: string

  /**
   * The IDs to filter the customer by.
   */
  id?: string | string[]

  /**
   * Filter by email.
   */
  email?: string | string[] | OperatorMap<string>

  /**
   * Filter by associated customer group.
   */
  groups?: FilterableCustomerGroupProps | string | string[]

  /**
   * Filter by the associated default billing address's ID.
   */
  default_billing_address_id?: string | string[] | null

  /**
   * Filter by the associated default shipping address's ID.
   */
  default_shipping_address_id?: string | string[] | null

  /**
   * Filter by company name.
   */
  company_name?: string | string[] | OperatorMap<string> | null

  /**
   * Filter by first name.
   */
  first_name?: string | string[] | OperatorMap<string> | null

  /**
   * Filter by last name.
   */
  last_name?: string | string[] | OperatorMap<string> | null

  /**
   * Filter by whether the customer has an account.
   */
  has_account?: boolean | OperatorMap<boolean>
  /**
   * Filter by the `created_by` attribute.
   */
  created_by?: string | string[] | null

  /**
   * Filter by created date.
   */
  created_at?: OperatorMap<string>

  /**
   * Filter by updated date.
   */
  updated_at?: OperatorMap<string>
}

/**
 * The customer group details.
 */
export interface CustomerGroupDTO {
  /**
   * The ID of the customer group.
   */
  id: string

  /**
   * The name of the customer group.
   */
  name: string

  /**
   * The customers of the customer group.
   */
  customers?: Partial<CustomerDTO>[]

  /**
   * Holds custom data in key-value pairs.
   */
  metadata?: Record<string, unknown>

  /**
   * Who created the customer group.
   */
  created_by?: string | null

  /**
   * The deletion date of the customer group.
   */
  deleted_at?: Date | string | null

  /**
   * The creation date of the customer group.
   */
  created_at?: Date | string

  /**
   * The update date of the customer group.
   */
  updated_at?: Date | string
}

/**
 * The details of a group's customer.
 */
export interface CustomerGroupCustomerDTO {
  /**
   * The ID of the relation.
   */
  id: string

  /**
   * The customer's ID.
   */
  customer_id: string

  /**
   * The customer group's ID.
   */
  customer_group_id: string

  /**
   * The customer's details.
   */
  customer?: Partial<CustomerDTO>

  /**
   * The group's details.
   */
  group?: Partial<CustomerGroupDTO>

  /**
   * Who the relation was created by.
   */
  created_by?: string | null

  /**
   * The creation date of the customer group customer.
   */
  created_at?: Date | string

  /**
   * The update date of the customer group customer.
   */
  updated_at?: Date | string
}

/**
 * The customer details.
 */
export interface CustomerDTO {
  /**
   * The ID of the customer.
   */
  id: string

  /**
   * The email of the customer.
   */
  email: string

  /**
   * A flag indicating if customer has an account or not.
   */
  has_account: boolean

  /**
   * The associated default billing address's ID.
   */
  default_billing_address_id: string | null

  /**
   * The associated default shipping address's ID.
   */
  default_shipping_address_id: string | null

  /**
   * The company name of the customer.
   */
  company_name: string | null

  /**
   * The first name of the customer.
   */
  first_name: string | null

  /**
   * The last name of the customer.
   */
  last_name: string | null

  /**
   * The addresses of the customer.
   */
  addresses: CustomerAddressDTO[]

  /**
   * The phone of the customer.
   */
  phone: string | null

  /**
   * The groups of the customer.
   */
  groups: {
    /**
     * The ID of the group.
     */
    id: string
    /**
     * The name of the group.
     */
    name: string
  }[]

  /**
   * Holds custom data in key-value pairs.
   */
  metadata: Record<string, unknown>

  /**
   * Who created the customer.
   */
  created_by: string | null

  /**
   * The deletion date of the customer.
   */
  deleted_at: Date | string | null

  /**
   * The creation date of the customer.
   */
  created_at: Date | string

  /**
   * The update date of the customer.
   */
  updated_at: Date | string
}

/**
 * @interface
 *
 * The details of a customer and customer group pair.
 */
export type GroupCustomerPair = {
  /**
   * The customer's ID.
   */
  customer_id: string

  /**
   * The customer group's ID.
   */
  customer_group_id: string
}

/**
 * @interface
 *
 * The legacy customer details.
 */
export type legacy_CustomerDTO = {
  /**
   * The ID of the customer.
   */
  id: string

  /**
   * The email of the customer.
   */
  email: string

  /**
   * The associated billing address's ID.
   */
  billing_address_id?: string | null

  /**
   * The associated shipping address's ID.
   */
  shipping_address_id?: string | null

  /**
   * The first name of the customer.
   */
  first_name?: string | null

  /**
   * The last name of the customer.
   */
  last_name?: string | null

  /**
   * The billing address of the customer.
   */
  billing_address?: AddressDTO

  /**
   * The shipping address of the customer.
   */
  shipping_address?: AddressDTO

  /**
   * The phone of the customer.
   */
  phone?: string | null

  /**
   * Whether the customer has account.
   */
  has_account: boolean

  /**
   * The groups of the customer.
   */
  groups?: {
    /**
     * The ID of the customer group.
     */
    id: string
  }[]

  /**
   * The orders of the customer.
   */
  orders: {
    /**
     * The ID of the order.
     */
    id: string
  }[]

  /**
   * Holds custom data in key-value pairs.
   */
  metadata?: Record<string, unknown>

  /**
   * The deletion date of the customer.
   */
  deleted_at?: Date | string

  /**
   * The creation date of the customer.
   */
  created_at?: Date | string

  /**
   * The update date of the legacy_ customer.
   */
  updated_at?: Date | string
}

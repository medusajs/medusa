import { MetadataType } from "../common"

/**
 * The customer address to be created.
 */
export interface CreateCustomerAddressDTO {
  /**
   * The address's name.
   */
  address_name?: string | null

  /**
   * Whether the address is default shipping.
   */
  is_default_shipping?: boolean

  /**
   * Whether the address is the default for billing.
   */
  is_default_billing?: boolean

  /**
   * The associated customer's ID.
   */
  customer_id: string

  /**
   * The company.
   */
  company?: string | null

  /**
   * The first name.
   */
  first_name?: string | null

  /**
   * The last name.
   */
  last_name?: string | null

  /**
   * The address 1.
   */
  address_1?: string | null

  /**
   * The address 2.
   */
  address_2?: string | null

  /**
   * The city.
   */
  city?: string | null

  /**
   * The country code.
   */
  country_code?: string | null

  /**
   * The province.
   */
  province?: string | null

  /**
   * The postal code.
   */
  postal_code?: string | null

  /**
   * The phone.
   */
  phone?: string | null

  /**
   * Holds custom data in key-value pairs.
   */
  metadata?: MetadataType
}

/**
 * The attributes to update in the customer's address.
 */
export interface UpdateCustomerAddressDTO {
  /**
   * The ID of the address.
   */
  id?: string

  /**
   * The address's name.
   */
  address_name?: string | null

  /**
   * Whether the address is the default for shipping.
   */
  is_default_shipping?: boolean

  /**
   * Whether the address is the default for billing.
   */
  is_default_billing?: boolean

  /**
   * The associated customer's ID.
   */
  customer_id?: string | null

  /**
   * The company.
   */
  company?: string | null

  /**
   * The first name.
   */
  first_name?: string | null

  /**
   * The last name.
   */
  last_name?: string | null

  /**
   * The address 1.
   */
  address_1?: string | null

  /**
   * The address 2.
   */
  address_2?: string | null

  /**
   * The city.
   */
  city?: string | null

  /**
   * The country code.
   */
  country_code?: string | null

  /**
   * The province.
   */
  province?: string | null

  /**
   * The postal code.
   */
  postal_code?: string | null

  /**
   * The phone.
   */
  phone?: string | null

  /**
   * Holds custom data in key-value pairs.
   */
  metadata?: MetadataType
}

/**
 * The customer to be created.
 */
export interface CreateCustomerDTO {
  /**
   * The company name of the customer.
   */
  company_name?: string | null

  /**
   * The first name of the customer.
   */
  first_name?: string | null

  /**
   * The last name of the customer.
   */
  last_name?: string | null

  /**
   * The email of the customer.
   */
  email?: string | null

  /**
   * The phone of the customer.
   */
  phone?: string | null

  /**
   * Who created the customer.
   */
  created_by?: string | null

  /**
   * The addresses of the customer.
   */
  addresses?: Omit<CreateCustomerAddressDTO, "customer_id">[]

  /**
   * Holds custom data in key-value pairs.
   */
  metadata?: MetadataType
}

/**
 * The attributes to update in the customer.
 */
export interface UpdateCustomerDTO {
  /**
   * The ID of the customer.
   */
  id: string

  /**
   * The company name of the customer.
   */
  company_name?: string | null

  /**
   * The first name of the customer.
   */
  first_name?: string | null

  /**
   * The last name of the customer.
   */
  last_name?: string | null

  /**
   * The email of the customer.
   */
  email?: string | null

  /**
   * The phone of the customer.
   */
  phone?: string | null

  /**
   * Holds custom data in key-value pairs.
   */
  metadata?: MetadataType
}

/**
 * The updatable fields of a customer.
 */
export interface CustomerUpdatableFields {
  /**
   * The company name of the customer.
   */
  company_name?: string | null

  /**
   * The first name of the customer.
   */
  first_name?: string | null

  /**
   * The last name of the customer.
   */
  last_name?: string | null

  /**
   * The email of the customer.
   */
  email?: string | null

  /**
   * The phone of the customer.
   */
  phone?: string | null

  /**
   * Holds custom data in key-value pairs.
   */
  metadata?: MetadataType
}

/**
 * The updatable fields of a customer group.
 */
export interface CustomerGroupUpdatableFields {
  /**
   * The name of the customer group.
   */
  name?: string

  /**
   * Holds custom data in key-value pairs.
   */
  metadata?: MetadataType
}

/**
 * The attributes to update in the customer group.
 */
export interface UpdateCustomerGroupDTO {
  /**
   * The ID of the customer group.
   */
  id?: string

  /**
   * The name of the customer group.
   */
  name?: string

  /**
   * The IDs of associated customers.
   */
  customer_ids?: string[]

  /**
   * Holds custom data in key-value pairs.
   */
  metadata?: MetadataType
}

/**
 * The customer group to be created.
 */
export interface CreateCustomerGroupDTO {
  /**
   * The name of the customer group.
   */
  name: string

  /**
   * Holds custom data in key-value pairs.
   */
  metadata?: MetadataType

  /**
   * Who created the customer group. For example,
   * the ID of the user that created the customer group.
   */
  created_by?: string
}

/**
 * The attributes to update in the customer group.
 */
export interface UpdateCustomerGroupDTO {
  /**
   * The ID of the customer group.
   */
  id?: string

  /**
   * The name of the customer group.
   */
  name?: string

  /**
   * Holds custom data in key-value pairs.
   */
  metadata?: MetadataType
}

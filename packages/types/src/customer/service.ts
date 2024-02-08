import { FindConfig } from "../common"
import { RestoreReturn, SoftDeleteReturn } from "../dal"
import { IModuleService } from "../modules-sdk"
import { Context } from "../shared-context"
import {
  CustomerAddressDTO,
  CustomerDTO,
  CustomerGroupCustomerDTO,
  CustomerGroupDTO,
  FilterableCustomerAddressProps,
  FilterableCustomerGroupCustomerProps,
  FilterableCustomerGroupProps,
  FilterableCustomerProps,
  GroupCustomerPair,
} from "./common"
import {
  CreateCustomerAddressDTO,
  CreateCustomerDTO,
  CreateCustomerGroupDTO,
  CustomerGroupUpdatableFields,
  CustomerUpdatableFields,
  UpdateCustomerAddressDTO,
} from "./mutations"

/**
 * The main service interface for the customer module.
 */
export interface ICustomerModuleService extends IModuleService {
  /**
   * This method retrieves a customer by its ID.
   *
   * @param {string} customerId - The customer's ID.
   * @param {FindConfig<CustomerDTO>} config - The configurations determining how the customer is retrieved. Its properties, such as `select` or `relations`, accept the
   * attributes or relations associated with a customer.
   * @param {Context} sharedContext - A context used to share resources, such as transaction manager, between the application and the module.
   * @returns {Promise<CustomerDTO>} The retrieved customer.
   *
   * @example
   * A simple example that retrieves a {type name} by its ID:
   *
   * ```ts
   * {example-code}
   * ```
   *
   * To specify relations that should be retrieved:
   *
   * ```ts
   * {example-code}
   * ```
   *
   *
   */
  retrieve(
    customerId: string,
    config?: FindConfig<CustomerDTO>,
    sharedContext?: Context
  ): Promise<CustomerDTO>

  /**
   * This method creates customers
   *
   * @param {CreateCustomerDTO[]} data - The customers to be created.
   * @param {Context} sharedContext - A context used to share resources, such as transaction manager, between the application and the module.
   * @returns {Promise<CustomerDTO[]>} The created customers.
   *
   * @example
   * {example-code}
   */
  create(
    data: CreateCustomerDTO[],
    sharedContext?: Context
  ): Promise<CustomerDTO[]>

  /**
   * This method creates customer
   *
   * @param {CreateCustomerDTO} data - The customer to be created.
   * @param {Context} sharedContext - A context used to share resources, such as transaction manager, between the application and the module.
   * @returns {Promise<CustomerDTO>} The created customer.
   *
   * @example
   * {example-code}
   */
  create(data: CreateCustomerDTO, sharedContext?: Context): Promise<CustomerDTO>

  /**
   * This method updates existing customer.
   *
   * @param {string} customerId - The customer's ID.
   * @param {CustomerUpdatableFields} data - The details to update in the customer.
   * @param {Context} sharedContext - A context used to share resources, such as transaction manager, between the application and the module.
   * @returns {Promise<CustomerDTO>} The updated customer.
   *
   * @example
   * {example-code}
   */
  update(
    customerId: string,
    data: CustomerUpdatableFields,
    sharedContext?: Context
  ): Promise<CustomerDTO>

  /**
   * This method updates existing customers.
   *
   * @param {string[]} customerIds - The list of customer ID's to update.
   * @param {CustomerUpdatableFields} data - The details to update in the customers.
   * @param {Context} sharedContext - A context used to share resources, such as transaction manager, between the application and the module.
   * @returns {Promise<CustomerDTO[]>} The updated customers.
   *
   * @example
   * {example-code}
   */
  update(
    customerIds: string[],
    data: CustomerUpdatableFields,
    sharedContext?: Context
  ): Promise<CustomerDTO[]>

  /**
   * This method updates existing customers. Updated customers are selected based on the filters provided in the `selector` parameter.
   *
   * @param {FilterableCustomerProps} selector - The filters to specify which customers should be updated.
   * @param {CustomerUpdatableFields} data - The details to update in the customers.
   * @param {Context} sharedContext - A context used to share resources, such as transaction manager, between the application and the module.
   * @returns {Promise<CustomerDTO[]>} The updated customers.
   *
   * @example
   * {example-code}
   */
  update(
    selector: FilterableCustomerProps,
    data: CustomerUpdatableFields,
    sharedContext?: Context
  ): Promise<CustomerDTO[]>

  /**
   * This method deletes a customer by its ID.
   *
   * @param {string} customerId - The customer's ID.
   * @param {Context} sharedContext - A context used to share resources, such as transaction manager, between the application and the module.
   * @returns {Promise<void>} Resolves when the customer is deleted successfully.
   *
   * @example
   * {example-code}
   */
  delete(customerId: string, sharedContext?: Context): Promise<void>

  /**
   * This method deletes customers by their IDs.
   *
   * @param {string[]} customerIds - The list of IDs of customers to delete.
   * @param {Context} sharedContext - A context used to share resources, such as transaction manager, between the application and the module.
   * @returns {Promise<void>} Resolves when the customers are deleted successfully.
   *
   * @example
   * {example-code}
   */
  delete(customerIds: string[], sharedContext?: Context): Promise<void>

  /**
   * This method deletes customers matching the specified filters in the `selector` parameter.
   *
   * @param {FilterableCustomerProps} selector - The filters to specify which customers should be deleted.
   * @param {Context} sharedContext - A context used to share resources, such as transaction manager, between the application and the module.
   * @returns {Promise<void>} Resolves when the customers are deleted.
   *
   * @example
   * {example-code}
   */
  delete(
    selector: FilterableCustomerProps,
    sharedContext?: Context
  ): Promise<void>

  /**
   * This method creates customer groups.
   *
   * @param {CreateCustomerGroupDTO[]} data - The details of the customer groups to create.
   * @param {Context} sharedContext - A context used to share resources, such as transaction manager, between the application and the module.
   * @returns {Promise<CustomerGroupDTO[]>} The created customer groups.
   *
   *
   * @privateRemarks
   * TODO should be pluralized
   */
  createCustomerGroup(
    data: CreateCustomerGroupDTO[],
    sharedContext?: Context
  ): Promise<CustomerGroupDTO[]>

  /**
   * This method creates a customer group.
   *
   * @param {CreateCustomerGroupDTO} data - The details of the customer group to create.
   * @param {Context} sharedContext - A context used to share resources, such as transaction manager, between the application and the module.
   * @returns {Promise<CustomerGroupDTO>} The created customer group.
   *
   * @privateRemarks
   * TODO should be pluralized
   */
  createCustomerGroup(
    data: CreateCustomerGroupDTO,
    sharedContext?: Context
  ): Promise<CustomerGroupDTO>

  /**
   * This method retrieves a customer group by its ID.
   *
   * @param {string} groupId - The group's ID.
   * @param {FindConfig<CustomerGroupDTO>} config - The configurations determining how the customer group is retrieved. Its properties, such as `select` or `relations`, accept the
   * attributes or relations associated with a customer group.
   * @param {Context} sharedContext - A context used to share resources, such as transaction manager, between the application and the module.
   * @returns {Promise<CustomerGroupDTO>} The retrieved customer group(s).
   *
   * @example
   * A simple example that retrieves a {type name} by its ID:
   *
   * ```ts
   * {example-code}
   * ```
   *
   * To specify relations that should be retrieved:
   *
   * ```ts
   * {example-code}
   * ```
   *
   *
   */
  retrieveCustomerGroup(
    groupId: string,
    config?: FindConfig<CustomerGroupDTO>,
    sharedContext?: Context
  ): Promise<CustomerGroupDTO>

  /**
   * This method updates existing customer group.
   *
   * @param {string} groupId - The group's ID.
   * @param {CustomerGroupUpdatableFields} data - The details to update in the customer group.
   * @param {Context} sharedContext - A context used to share resources, such as transaction manager, between the application and the module.
   * @returns {Promise<CustomerGroupDTO>} The updated customer group.
   *
   * @example
   * {example-code}
   */
  updateCustomerGroups(
    groupId: string,
    data: CustomerGroupUpdatableFields,
    sharedContext?: Context
  ): Promise<CustomerGroupDTO>

  /**
   * This method updates existing customer groups.
   *
   * @param {string[]} groupIds - The list of customer groups IDs to update.
   * @param {CustomerGroupUpdatableFields} data - The details to update in the customer groups.
   * @param {Context} sharedContext - A context used to share resources, such as transaction manager, between the application and the module.
   * @returns {Promise<CustomerGroupDTO[]>} The updated customer groups.
   *
   * @example
   * {example-code}
   */
  updateCustomerGroups(
    groupIds: string[],
    data: CustomerGroupUpdatableFields,
    sharedContext?: Context
  ): Promise<CustomerGroupDTO[]>

  /**
   * This method updates existing customer groups. Updated groups are selected based on the filters provided in the `selector` parameter.
   *
   * @param {FilterableCustomerGroupProps} selector - The filters to specify which groups should be updated.
   * @param {CustomerGroupUpdatableFields} data - The details to update in the customer groups.
   * @param {Context} sharedContext - A context used to share resources, such as transaction manager, between the application and the module.
   * @returns {Promise<CustomerGroupDTO[]>} The updated customer groups.
   *
   * @example
   * {example-code}
   */
  updateCustomerGroups(
    selector: FilterableCustomerGroupProps,
    data: CustomerGroupUpdatableFields,
    sharedContext?: Context
  ): Promise<CustomerGroupDTO[]>

  /**
   * This method deletes a customer group by its ID.
   *
   * @param {string} groupId - The group's ID.
   * @param {Context} sharedContext - A context used to share resources, such as transaction manager, between the application and the module.
   * @returns {Promise<void>} Resolves when the customer group is deleted.
   *
   * @example
   * {example-code}
   */
  deleteCustomerGroups(groupId: string, sharedContext?: Context): Promise<void>

  /**
   * This method deletes customer groups by their ID.
   *
   * @param {string[]} groupIds - The list of IDs of customer groups to delete.
   * @param {Context} sharedContext - A context used to share resources, such as transaction manager, between the application and the module.
   * @returns {Promise<void>} Resolves when the customer groups are deleted.
   *
   * @example
   * {example-code}
   */
  deleteCustomerGroups(
    groupIds: string[],
    sharedContext?: Context
  ): Promise<void>

  /**
   * This method deletes customer groups matching the specified filters in the `selector` parameter.
   *
   * @param {FilterableCustomerGroupProps} selector - The filters to specify which groups should be deleted.
   * @param {Context} sharedContext - A context used to share resources, such as transaction manager, between the application and the module.
   * @returns {Promise<void>} Resolves when the customer groups are deleted.
   *
   * @example
   * {example-code}
   */
  deleteCustomerGroups(
    selector: FilterableCustomerGroupProps,
    sharedContext?: Context
  ): Promise<void>

  /**
   * This method adds customers to a group.
   *
   * @param {GroupCustomerPair} groupCustomerPair - The details of the customer and the group it should be added to.
   * @param {Context} sharedContext - A context used to share resources, such as transaction manager, between the application and the module.
   * @returns {Promise<{ id: string; }>} The ID of the relation between the customer and the group.
   *
   * @example
   * {example-code}
   */
  addCustomerToGroup(
    groupCustomerPair: GroupCustomerPair,
    sharedContext?: Context
  ): Promise<{
    /**
     * The ID of the relation between the customer and the group.
     */
    id: string
  }>

  /**
   * This method adds customers to groups.
   *
   * @param {GroupCustomerPair[]} groupCustomerPairs - A list of customer-group pairs, where each item in the list indicates the customer and what
   * group it should be added to.
   * @param {Context} sharedContext - A context used to share resources, such as transaction manager, between the application and the module.
   * @returns {Promise<{ id: string; }[]>} The list of IDs of the relations created between the customers and the groups.
   *
   * @example
   * {example-code}
   */
  addCustomerToGroup(
    groupCustomerPairs: GroupCustomerPair[],
    sharedContext?: Context
  ): Promise<
    {
      /**
       * The ID of the relation between the customer and the group.
       */
      id: string
    }[]
  >

  /**
   * This method removes a customer from a group.
   *
   * @param {GroupCustomerPair} groupCustomerPair - The details of the customer and which group to remove it from.
   * @param {Context} sharedContext - A context used to share resources, such as transaction manager, between the application and the module.
   * @returns {Promise<void>} Resolves when the customer is removed from the group successfully.
   *
   * @privateRemarks
   * TODO should be pluralized
   */
  removeCustomerFromGroup(
    groupCustomerPair: GroupCustomerPair,
    sharedContext?: Context
  ): Promise<void>

  /**
   * This method removes customers from groups.
   *
   * @param {GroupCustomerPair[]} groupCustomerPairs - A list of customer-group pairs, where each item in the list indicates the customer and what
   * group it should be removed from.
   * @param {Context} sharedContext - A context used to share resources, such as transaction manager, between the application and the module.
   * @returns {Promise<void>} Resolves when the customers are removed from the groups successfully.
   *
   * @privateRemarks
   * TODO should be pluralized
   */
  removeCustomerFromGroup(
    groupCustomerPairs: GroupCustomerPair[],
    sharedContext?: Context
  ): Promise<void>

  /**
   * This method adds addresses to a customer.
   *
   * @param {CreateCustomerAddressDTO[]} addresses - The customer addresses to be created.
   * @param {Context} sharedContext - A context used to share resources, such as transaction manager, between the application and the module.
   * @returns {Promise<CustomerAddressDTO[]>} The created customer addresses.
   *
   * @example
   * {example-code}
   */
  addAddresses(
    addresses: CreateCustomerAddressDTO[],
    sharedContext?: Context
  ): Promise<CustomerAddressDTO[]>

  /**
   * This method adds an address to a customer
   *
   * @param {CreateCustomerAddressDTO} address - The customer address to be created.
   * @param {Context} sharedContext - A context used to share resources, such as transaction manager, between the application and the module.
   * @returns {Promise<CustomerAddressDTO>} The created customer address.
   *
   * @example
   * {example-code}
   */
  addAddresses(
    address: CreateCustomerAddressDTO,
    sharedContext?: Context
  ): Promise<CustomerAddressDTO>

  /**
   * This method updates an existing address by its ID.
   *
   * @param {string} addressId - The address's ID.
   * @param {UpdateCustomerAddressDTO} data - The attributes to update in the customer address.
   * @param {Context} sharedContext - A context used to share resources, such as transaction manager, between the application and the module.
   * @returns {Promise<CustomerAddressDTO>} The updated addresses.
   *
   * @example
   * {example-code}
   */
  updateAddresses(
    addressId: string,
    data: UpdateCustomerAddressDTO,
    sharedContext?: Context
  ): Promise<CustomerAddressDTO>

  /**
   * This method updates existing addresses.
   *
   * @param {string[]} addressIds - The list of IDs of addresses to update.
   * @param {UpdateCustomerAddressDTO} data - The attributes to update in each customer address.
   * @param {Context} sharedContext - A context used to share resources, such as transaction manager, between the application and the module.
   * @returns {Promise<CustomerAddressDTO[]>} The updated customer addresses.
   *
   * @example
   * {example-code}
   */
  updateAddresses(
    addressIds: string[],
    data: UpdateCustomerAddressDTO,
    sharedContext?: Context
  ): Promise<CustomerAddressDTO[]>

  /**
   * This method updates addresses matching the specified filters in the `selector` parameter.
   *
   * @param {FilterableCustomerAddressProps} selector - The filters to specify which addresses should be updated.
   * @param {UpdateCustomerAddressDTO} data - The attributes to update in each customer address.
   * @param {Context} sharedContext - A context used to share resources, such as transaction manager, between the application and the module.
   * @returns {Promise<CustomerAddressDTO[]>} The updated customer addresses.
   *
   * @example
   * {example-code}
   */
  updateAddresses(
    selector: FilterableCustomerAddressProps,
    data: UpdateCustomerAddressDTO,
    sharedContext?: Context
  ): Promise<CustomerAddressDTO[]>

  /**
   * This method deletes an address by its ID.
   *
   * @param {string} addressId - The address's ID.
   * @param {Context} sharedContext - A context used to share resources, such as transaction manager, between the application and the module.
   * @returns {Promise<void>} Resolves when the address is deleted successfully.
   *
   * @example
   * {example-code}
   */
  deleteAddresses(addressId: string, sharedContext?: Context): Promise<void>

  /**
   * This method deletes addresses by their IDs.
   *
   * @param {string[]} addressIds - The list of IDs of addresses to delete.
   * @param {Context} sharedContext - A context used to share resources, such as transaction manager, between the application and the module.
   * @returns {Promise<void>} Resolves when the addresses are deleted successfully.
   *
   * @example
   * {example-code}
   */
  deleteAddresses(addressIds: string[], sharedContext?: Context): Promise<void>

  /**
   * This method deletes addresses matching the specified filters in the `selector` parameter.
   *
   * @param {FilterableCustomerAddressProps} selector - The filters to specify which addresses should be deleted.
   * @param {Context} sharedContext - A context used to share resources, such as transaction manager, between the application and the module.
   * @returns {Promise<void>} Resolves when the addresses are deleted.
   *
   * @example
   * {example-code}
   */
  deleteAddresses(
    selector: FilterableCustomerAddressProps,
    sharedContext?: Context
  ): Promise<void>

  /**
   * This method retrieves a paginated list of addresses based on optional filters and configuration.
   *
   * @param {FilterableCustomerAddressProps} filters - The filters to apply on the retrieved customer address.
   * @param {FindConfig<CustomerAddressDTO>} config - The configurations determining how the customer address is retrieved. Its properties, such as `select` or `relations`, accept the
   * attributes or relations associated with a customer address.
   * @param {Context} sharedContext - A context used to share resources, such as transaction manager, between the application and the module.
   * @returns {Promise<CustomerAddressDTO[]>} The list of addresses.
   *
   * @example
   * To retrieve a list of {type name} using their IDs:
   *
   * ```ts
   * {example-code}
   * ```
   *
   * To specify relations that should be retrieved within the {type name}:
   *
   * ```ts
   * {example-code}
   * ```
   *
   * By default, only the first `{default limit}` records are retrieved. You can control pagination by specifying the `skip` and `take` properties of the `config` parameter:
   *
   * ```ts
   * {example-code}
   * ```
   *
   *
   */
  listAddresses(
    filters?: FilterableCustomerAddressProps,
    config?: FindConfig<CustomerAddressDTO>,
    sharedContext?: Context
  ): Promise<CustomerAddressDTO[]>

  /**
   * This method retrieves a paginated list of addresses along with the total count of available addresses satisfying the provided filters.
   *
   * @param {FilterableCustomerAddressProps} filters - The filters to apply on the retrieved customer address.
   * @param {FindConfig<CustomerAddressDTO>} config - The configurations determining how the customer address is retrieved. Its properties, such as `select` or `relations`, accept the
   * attributes or relations associated with a customer address.
   * @param {Context} sharedContext - A context used to share resources, such as transaction manager, between the application and the module.
   * @returns {Promise<[CustomerAddressDTO[], number]>} The list of addresses along with their total count.
   *
   * @example
   * To retrieve a list of {type name} using their IDs:
   *
   * ```ts
   * {example-code}
   * ```
   *
   * To specify relations that should be retrieved within the {type name}:
   *
   * ```ts
   * {example-code}
   * ```
   *
   * By default, only the first `{default limit}` records are retrieved. You can control pagination by specifying the `skip` and `take` properties of the `config` parameter:
   *
   * ```ts
   * {example-code}
   * ```
   *
   *
   */
  listAndCountAddresses(
    filters?: FilterableCustomerAddressProps,
    config?: FindConfig<CustomerAddressDTO>,
    sharedContext?: Context
  ): Promise<[CustomerAddressDTO[], number]>

  /**
   * This method retrieves a paginated list of customer group's customers based on optional filters and configuration.
   *
   * @param {FilterableCustomerGroupCustomerProps} filters - The filters to apply on the retrieved customer group customer.
   * @param {FindConfig<CustomerGroupCustomerDTO>} config - The configurations determining how the customer group customer is retrieved. Its properties, such as `select` or `relations`, accept the
   * attributes or relations associated with a customer group customer.
   * @param {Context} sharedContext - A context used to share resources, such as transaction manager, between the application and the module.
   * @returns {Promise<CustomerGroupCustomerDTO[]>} The list of customer group's customers.
   *
   * @example
   * To retrieve a list of {type name} using their IDs:
   *
   * ```ts
   * {example-code}
   * ```
   *
   * To specify relations that should be retrieved within the {type name}:
   *
   * ```ts
   * {example-code}
   * ```
   *
   * By default, only the first `{default limit}` records are retrieved. You can control pagination by specifying the `skip` and `take` properties of the `config` parameter:
   *
   * ```ts
   * {example-code}
   * ```
   *
   *
   */
  listCustomerGroupCustomers(
    filters?: FilterableCustomerGroupCustomerProps,
    config?: FindConfig<CustomerGroupCustomerDTO>,
    sharedContext?: Context
  ): Promise<CustomerGroupCustomerDTO[]>

  /**
   * This method retrieves a paginated list of customers based on optional filters and configuration.
   *
   * @param {FilterableCustomerProps} filters - The filters to apply on the retrieved customer.
   * @param {FindConfig<CustomerDTO>} config - The configurations determining how the customer is retrieved. Its properties, such as `select` or `relations`, accept the
   * attributes or relations associated with a customer.
   * @param {Context} sharedContext - A context used to share resources, such as transaction manager, between the application and the module.
   * @returns {Promise<CustomerDTO[]>} The list of customers.
   *
   * @example
   * To retrieve a list of {type name} using their IDs:
   *
   * ```ts
   * {example-code}
   * ```
   *
   * To specify relations that should be retrieved within the {type name}:
   *
   * ```ts
   * {example-code}
   * ```
   *
   * By default, only the first `{default limit}` records are retrieved. You can control pagination by specifying the `skip` and `take` properties of the `config` parameter:
   *
   * ```ts
   * {example-code}
   * ```
   *
   *
   */
  list(
    filters?: FilterableCustomerProps,
    config?: FindConfig<CustomerDTO>,
    sharedContext?: Context
  ): Promise<CustomerDTO[]>

  /**
   * This method retrieves a paginated list of customers along with the total count of available customers satisfying the provided filters.
   *
   * @param {FilterableCustomerProps} filters - The filters to apply on the retrieved customer.
   * @param {FindConfig<CustomerDTO>} config - The configurations determining how the customer is retrieved. Its properties, such as `select` or `relations`, accept the
   * attributes or relations associated with a customer.
   * @param {Context} sharedContext - A context used to share resources, such as transaction manager, between the application and the module.
   * @returns {Promise<[CustomerDTO[], number]>} The list of customers along with their total count.
   *
   * @example
   * To retrieve a list of {type name} using their IDs:
   *
   * ```ts
   * {example-code}
   * ```
   *
   * To specify relations that should be retrieved within the {type name}:
   *
   * ```ts
   * {example-code}
   * ```
   *
   * By default, only the first `{default limit}` records are retrieved. You can control pagination by specifying the `skip` and `take` properties of the `config` parameter:
   *
   * ```ts
   * {example-code}
   * ```
   *
   *
   */
  listAndCount(
    filters?: FilterableCustomerProps,
    config?: FindConfig<CustomerDTO>,
    sharedContext?: Context
  ): Promise<[CustomerDTO[], number]>

  /**
   * This method retrieves a paginated list of customer groups based on optional filters and configuration.
   *
   * @param {FilterableCustomerGroupProps} filters - The filters to apply on the retrieved customer group.
   * @param {FindConfig<CustomerGroupDTO>} config - The configurations determining how the customer group is retrieved. Its properties, such as `select` or `relations`, accept the
   * attributes or relations associated with a customer group.
   * @param {Context} sharedContext - A context used to share resources, such as transaction manager, between the application and the module.
   * @returns {Promise<CustomerGroupDTO[]>} The list of customer groups.
   *
   * @example
   * To retrieve a list of {type name} using their IDs:
   *
   * ```ts
   * {example-code}
   * ```
   *
   * To specify relations that should be retrieved within the {type name}:
   *
   * ```ts
   * {example-code}
   * ```
   *
   * By default, only the first `{default limit}` records are retrieved. You can control pagination by specifying the `skip` and `take` properties of the `config` parameter:
   *
   * ```ts
   * {example-code}
   * ```
   *
   *
   */
  listCustomerGroups(
    filters?: FilterableCustomerGroupProps,
    config?: FindConfig<CustomerGroupDTO>,
    sharedContext?: Context
  ): Promise<CustomerGroupDTO[]>

  /**
   * This method retrieves a paginated list of customer groups along with the total count of available customer groups satisfying the provided filters.
   *
   * @param {FilterableCustomerGroupProps} filters - The filters to apply on the retrieved customer group.
   * @param {FindConfig<CustomerGroupDTO>} config - The configurations determining how the customer group is retrieved. Its properties, such as `select` or `relations`, accept the
   * attributes or relations associated with a customer group.
   * @param {Context} sharedContext - A context used to share resources, such as transaction manager, between the application and the module.
   * @returns {Promise<[CustomerGroupDTO[], number]>} The list of customer groups along with their total count.
   *
   * @example
   * To retrieve a list of {type name} using their IDs:
   *
   * ```ts
   * {example-code}
   * ```
   *
   * To specify relations that should be retrieved within the {type name}:
   *
   * ```ts
   * {example-code}
   * ```
   *
   * By default, only the first `{default limit}` records are retrieved. You can control pagination by specifying the `skip` and `take` properties of the `config` parameter:
   *
   * ```ts
   * {example-code}
   * ```
   *
   *
   */
  listAndCountCustomerGroups(
    filters?: FilterableCustomerGroupProps,
    config?: FindConfig<CustomerGroupDTO>,
    sharedContext?: Context
  ): Promise<[CustomerGroupDTO[], number]>

  /**
   * This method soft deletes customers by their IDs.
   *
   * @param {string[]} customerIds - The list of IDs of customers to soft delete.
   * @param {SoftDeleteReturn<TReturnableLinkableKeys>} config - An object that is used to specify an entity's related entities that should be soft-deleted when the main entity is soft-deleted.
   * @param {Context} sharedContext - A context used to share resources, such as transaction manager, between the application and the module.
   * @returns {Promise<void | Record<TReturnableLinkableKeys, string[]>>} Resolves when the customers are deleted successfully.
   *
   * @example
   * {example-code}
   */
  softDelete<TReturnableLinkableKeys extends string = string>(
    customerIds: string[],
    config?: SoftDeleteReturn<TReturnableLinkableKeys>,
    sharedContext?: Context
  ): Promise<Record<TReturnableLinkableKeys, string[]> | void>

  /**
   * This method restores soft deleted customers by their IDs.
   *
   * @param {string[]} customerIds - The list of IDs of customers to restore.
   * @param {RestoreReturn<TReturnableLinkableKeys>} config - Configurations determining which relations to restore along with each of the customers. You can pass to its `returnLinkableKeys`
   * property any of the customer's relation attribute names, such as `addresses`.
   * @param {Context} sharedContext - A context used to share resources, such as transaction manager, between the application and the module.
   * @returns {Promise<void | Record<TReturnableLinkableKeys, string[]>>} An object that includes the IDs of related records that were restored, such as the ID of associated address.
   * The object's keys are the ID attribute names of the customer entity's relations,
   * and its value is an array of strings, each being the ID of the record associated with the customer through this relation,
   * such as the IDs of associated addresses.
   *
   * @example
   * {example-code}
   */
  restore<TReturnableLinkableKeys extends string = string>(
    customerIds: string[],
    config?: RestoreReturn<TReturnableLinkableKeys>,
    sharedContext?: Context
  ): Promise<Record<TReturnableLinkableKeys, string[]> | void>

  /**
   * This method soft deletes customer groups by their IDs.
   *
   * @param {string[]} groupIds - The list of IDs of customer groups to soft delete.
   * @param {SoftDeleteReturn<TReturnableLinkableKeys>} config - An object that is used to specify an entity's related entities that should be soft-deleted when the main entity is soft-deleted.
   * @param {Context} sharedContext - A context used to share resources, such as transaction manager, between the application and the module.
   * @returns {Promise<void | Record<TReturnableLinkableKeys, string[]>>} Resolves whe the customer groups are soft-deleted successfully.
   *
   * @example
   * {example-code}
   */
  softDeleteCustomerGroups<TReturnableLinkableKeys extends string = string>(
    groupIds: string[],
    config?: SoftDeleteReturn<TReturnableLinkableKeys>,
    sharedContext?: Context
  ): Promise<Record<TReturnableLinkableKeys, string[]> | void>

  /**
   * This method restores soft deleted customer groups by their IDs.
   *
   * @param {string[]} groupIds - The list of IDs of customer groups to restore.
   * @param {RestoreReturn<TReturnableLinkableKeys>} config - Configurations determining which relations to restore along with each of the customer group. You can pass to its `returnLinkableKeys`
   * property any of the customer group's relation attribute names, such as `customers`.
   * @param {Context} sharedContext - A context used to share resources, such as transaction manager, between the application and the module.
   * @returns {Promise<void | Record<TReturnableLinkableKeys, string[]>>} An object that includes the IDs of related records that were restored, such as the ID of associated customer.
   * The object's keys are the ID attribute names of the customer group entity's relations,
   * and its value is an array of strings, each being the ID of the record associated with the customer through this relation,
   * such as the IDs of associated customer.
   *
   * @example
   * {example-code}
   */
  restoreCustomerGroups<TReturnableLinkableKeys extends string = string>(
    groupIds: string[],
    config?: RestoreReturn<TReturnableLinkableKeys>,
    sharedContext?: Context
  ): Promise<Record<TReturnableLinkableKeys, string[]> | void>
}

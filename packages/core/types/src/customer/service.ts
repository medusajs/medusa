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
 * The main service interface for the Customer Module.
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
   * A simple example that retrieves a customer by its ID:
   *
   * ```ts
   * const customer =
   *   await customerModuleService.retrieveCustomer("cus_123")
   * ```
   *
   * To specify relations that should be retrieved:
   *
   * ```ts
   * const customer = await customerModuleService.retrieveCustomer(
   *   "cus_123",
   *   {
   *     relations: ["groups"],
   *   }
   * )
   * ```
   */
  retrieveCustomer(
    customerId: string,
    config?: FindConfig<CustomerDTO>,
    sharedContext?: Context
  ): Promise<CustomerDTO>

  /**
   * This method creates customers.
   *
   * @param {CreateCustomerDTO[]} data - The customers to be created.
   * @param {Context} sharedContext - A context used to share resources, such as transaction manager, between the application and the module.
   * @returns {Promise<CustomerDTO[]>} The created customers.
   *
   * @example
   * const customers = await customerModuleService.createCustomers([Customers
   *   {
   *     email: "john@smith.com",
   *     first_name: "John",
   *     last_name: "Smith",
   *   },
   * ])
   */
  createCustomers(
    data: CreateCustomerDTO[],
    sharedContext?: Context
  ): Promise<CustomerDTO[]>

  /**
   * This method creates a customer.
   *
   * @param {CreateCustomerDTO} data - The customer to be created.
   * @param {Context} sharedContext - A context used to share resources, such as transaction manager, between the application and the module.
   * @returns {Promise<CustomerDTO>} The created customer.
   *
   * @example
   * const customer = await customerModuleService.createCustomers({Customers
   *   email: "john@smith.com",
   *   first_name: "John",
   *   last_name: "Smith",
   * })
   */
  createCustomers(
    data: CreateCustomerDTO,
    sharedContext?: Context
  ): Promise<CustomerDTO>

  /**
   * This method updates an existing customer.
   *
   * @param {string} customerId - The customer's ID.
   * @param {CustomerUpdatableFields} data - The updatable fields of a customer.
   * @param {Context} sharedContext - A context used to share resources, such as transaction manager, between the application and the module.
   * @returns {Promise<CustomerDTO>} The updated customer.
   *
   * @example
   * const customer = await customerModuleService.updateCustomers(
   *   "cus_123",
   *   {
   *     first_name: "Matt",
   *   }
   * )
   */
  updateCustomers(
    customerId: string,
    data: CustomerUpdatableFields,
    sharedContext?: Context
  ): Promise<CustomerDTO>

  /**
   * This method updates existing customers.
   *
   * @param {string[]} customerIds - The IDs of customers to update.
   * @param {CustomerUpdatableFields} data - The attributes to update in the customers.
   * @param {Context} sharedContext - A context used to share resources, such as transaction manager, between the application and the module.
   * @returns {Promise<CustomerDTO[]>} The updated customers.
   *
   * @example
   * const customers = await customerModuleService.updateCustomers(
   *   ["cus_123", "cus_321"],
   *   {
   *     company_name: "Acme",
   *   }
   * )
   */
  updateCustomers(
    customerIds: string[],
    data: CustomerUpdatableFields,
    sharedContext?: Context
  ): Promise<CustomerDTO[]>

  /**
   * This method updates existing customers.
   *
   * @param {FilterableCustomerProps} selector - The filters that specify which API keys should be updated.
   * @param {CustomerUpdatableFields} data - The attributes to update in the customers.
   * @param {Context} sharedContext - A context used to share resources, such as transaction manager, between the application and the module.
   * @returns {Promise<CustomerDTO[]>} The updated customers.
   *
   * @example
   * const customers = await customerModuleService.updateCustomers(
   *   { company_name: "Acme" },
   *   {
   *     company_name: "Acme Inc.",
   *   }
   * )
   */
  updateCustomers(
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
   * await customerModuleService.deleteCustomers("cus_123")
   */
  deleteCustomers(customerId: string, sharedContext?: Context): Promise<void>

  /**
   * This method deletes customers by their IDs.
   *
   * @param {string[]} customerIds - The IDs of customers.
   * @param {Context} sharedContext - A context used to share resources, such as transaction manager, between the application and the module.
   * @returns {Promise<void>} Resolves when the customers are deleted successfully.
   *
   * @example
   * await customerModuleService.deleteCustomers(["cus_123", "cus_321"])
   */
  deleteCustomers(customerIds: string[], sharedContext?: Context): Promise<void>

  /**
   * This method deletes a customer matching the specified filters.
   *
   * @param {FilterableCustomerProps} selector - The filters that specify which customers should be deleted.
   * @param {Context} sharedContext - A context used to share resources, such as transaction manager, between the application and the module.
   * @returns {Promise<void>} Resolves when the customers are deleted successfully.
   *
   * @example
   * await customerModuleService.deleteCustomers({
   *   id: ["cus_123"],
   * })
   */
  deleteCustomers(
    selector: FilterableCustomerProps,
    sharedContext?: Context
  ): Promise<void>

  /**
   * This method creates customer groups.
   *
   * @param {CreateCustomerGroupDTO[]} data - The customer groups to be created.
   * @param {Context} sharedContext - A context used to share resources, such as transaction manager, between the application and the module.
   * @returns {Promise<CustomerGroupDTO[]>} The created customer groups.
   *
   * @example
   * const customerGroup =
   *   await customerModuleService.createCustomerGroups([
   *     {
   *       name: "VIP",
   *     },
   *   ])
   */
  createCustomerGroups(
    data: CreateCustomerGroupDTO[],
    sharedContext?: Context
  ): Promise<CustomerGroupDTO[]>

  /**
   * This method creates a customer group.
   *
   * @param {CreateCustomerGroupDTO} data - The customer group to be created.
   * @param {Context} sharedContext - A context used to share resources, such as transaction manager, between the application and the module.
   * @returns {Promise<CustomerGroupDTO>} The created customer group.
   *
   * @privateRemarks
   * TODO should be pluralized
   *
   * @example
   * const customerGroup =
   *   await customerModuleService.createCustomerGroups({
   *     name: "VIP",
   *   })
   */
  createCustomerGroups(
    data: CreateCustomerGroupDTO,
    sharedContext?: Context
  ): Promise<CustomerGroupDTO>

  /**
   * This method retrieves a customer group by its ID.
   *
   * @param {string} groupId - The customer group's ID.
   * @param {FindConfig<CustomerGroupDTO>} config - The configurations determining how the customer group is retrieved. Its properties, such as `select` or `relations`, accept the
   * attributes or relations associated with a customer group.
   * @param {Context} sharedContext - A context used to share resources, such as transaction manager, between the application and the module.
   * @returns {Promise<CustomerGroupDTO>} The retrieved customer group.
   *
   * @example
   * const customerGroup =
   *   await customerModuleService.retrieveCustomerGroup("cusgroup_123")
   */
  retrieveCustomerGroup(
    groupId: string,
    config?: FindConfig<CustomerGroupDTO>,
    sharedContext?: Context
  ): Promise<CustomerGroupDTO>

  /**
   * This method updates an existing customer group.
   *
   * @param {string} groupId - The group's ID.
   * @param {CustomerGroupUpdatableFields} data - The attributes to update in the customer group.
   * @param {Context} sharedContext - A context used to share resources, such as transaction manager, between the application and the module.
   * @returns {Promise<CustomerGroupDTO>} The updated customer group.
   *
   * @example
   * const customerGroup =
   *   await customerModuleService.updateCustomerGroups(
   *     "cusgroup_123",
   *     {
   *       name: "Very Important",
   *     }
   *   )
   */
  updateCustomerGroups(
    groupId: string,
    data: CustomerGroupUpdatableFields,
    sharedContext?: Context
  ): Promise<CustomerGroupDTO>

  /**
   * This method updates existing customer groups.
   *
   * @param {string[]} groupIds - The IDs of customer groups.
   * @param {CustomerGroupUpdatableFields} data - The attributes to update in the customer groups.
   * @param {Context} sharedContext - A context used to share resources, such as transaction manager, between the application and the module.
   * @returns {Promise<CustomerGroupDTO[]>} The updated customer groups.
   *
   * @example
   * const customerGroups =
   *   await customerModuleService.updateCustomerGroups(
   *     ["cusgroup_123", "cusgroup_321"],
   *     {
   *       name: "Very Important",
   *     }
   *   )
   */
  updateCustomerGroups(
    groupIds: string[],
    data: CustomerGroupUpdatableFields,
    sharedContext?: Context
  ): Promise<CustomerGroupDTO[]>

  /**
   * This method updates existing customer groups.
   *
   * @param {FilterableCustomerGroupProps} selector - The filters that specify which customer groups should be updates.
   * @param {CustomerGroupUpdatableFields} data - The attributes to update in the customer groups.
   * @param {Context} sharedContext - A context used to share resources, such as transaction manager, between the application and the module.
   * @returns {Promise<CustomerGroupDTO[]>} The updated customer groups.
   *
   * @example
   * const customerGroups =
   *   await customerModuleService.updateCustomerGroups(
   *     {
   *       name: "VIP",
   *     },
   *     {
   *       name: "Very Important",
   *     }
   *   )
   */
  updateCustomerGroups(
    selector: FilterableCustomerGroupProps,
    data: CustomerGroupUpdatableFields,
    sharedContext?: Context
  ): Promise<CustomerGroupDTO[]>

  /**
   * This method deletes a customer group by its ID.
   *
   * @param {string} groupId - The customer group's ID.
   * @param {Context} sharedContext - A context used to share resources, such as transaction manager, between the application and the module.
   * @returns {Promise<void>} Resolves when the customer group is deleted successfully.
   *
   * @example
   * await customerModuleService.deleteCustomerGroups(
   *   "cusgroup_123"
   * )
   */
  deleteCustomerGroups(groupId: string, sharedContext?: Context): Promise<void>

  /**
   * This method deletes customer groups by their IDs.
   *
   * @param {string[]} groupIds - The IDs of customer groups.
   * @param {Context} sharedContext - A context used to share resources, such as transaction manager, between the application and the module.
   * @returns {Promise<void>} Resolves when the customer groups are deleted successfully.
   *
   * @example
   * await customerModuleService.deleteCustomerGroups([
   *   "cusgroup_123",
   *   "cusgroup_321",
   * ])
   */
  deleteCustomerGroups(
    groupIds: string[],
    sharedContext?: Context
  ): Promise<void>

  /**
   * This method deletes customer groups matching the specified filters.
   *
   * @param {FilterableCustomerGroupProps} selector - The filters that specify which customer group to delete.
   * @param {Context} sharedContext - A context used to share resources, such as transaction manager, between the application and the module.
   * @returns {Promise<void>} Resolves when the customer groups are deleted successfully.
   *
   * @example
   * await customerModuleService.deleteCustomerGroups({
   *   name: "VIP",
   * })
   */
  deleteCustomerGroups(
    selector: FilterableCustomerGroupProps,
    sharedContext?: Context
  ): Promise<void>

  /**
   * This method adds a customer to a group.
   *
   * @param {GroupCustomerPair} groupCustomerPair - The details of the customer and the group it should be added to.
   * @param {Context} sharedContext - A context used to share resources, such as transaction manager, between the application and the module.
   * @returns {Promise<{ id: string; }>} The ID of the relation between the customer and the group.
   *
   * @example
   * const customerGroupCustomerId =
   *   await customerModuleService.addCustomerToGroup({
   *     customer_id: "cus_123",
   *     customer_group_id: "cus_321",
   *   })
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
   * @param {GroupCustomerPair[]} groupCustomerPairs - A list of items, each being the details of a customer and the group it should be added to.
   * @param {Context} sharedContext - A context used to share resources, such as transaction manager, between the application and the module.
   * @returns {Promise<{ id: string; }[]>} The IDs of the relations between each of the customer and group pairs.
   *
   * @example
   * const customerGroupCustomerIds =
   *   await customerModuleService.addCustomerToGroup([
   *     {
   *       customer_id: "cus_123",
   *       customer_group_id: "cus_321",
   *     },
   *   ])
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
   * @param {GroupCustomerPair} groupCustomerPair - The details of the customer and the group it should be removed from.
   * @param {Context} sharedContext - A context used to share resources, such as transaction manager, between the application and the module.
   * @returns {Promise<void>} Resolves when the customer is removed from the group successfully.
   *
   * @privateRemarks
   * TODO should be pluralized
   *
   * @example
   * await customerModuleService.removeCustomerFromGroup({
   *   customer_id: "cus_123",
   *   customer_group_id: "cus_321",
   * })
   */
  removeCustomerFromGroup(
    groupCustomerPair: GroupCustomerPair,
    sharedContext?: Context
  ): Promise<void>

  /**
   * This method removes customers from groups.
   *
   * @param {GroupCustomerPair[]} groupCustomerPairs - A list of items, each being the details of a customer and the group it should be removed from.
   * @param {Context} sharedContext - A context used to share resources, such as transaction manager, between the application and the module.
   * @returns {Promise<void>} Resolves when the customers are removed from the groups successfully.
   *
   * @privateRemarks
   * TODO should be pluralized
   *
   * @example
   * await customerModuleService.removeCustomerFromGroup([
   *   {
   *     customer_id: "cus_123",
   *     customer_group_id: "cus_321",
   *   },
   * ])
   */
  removeCustomerFromGroup(
    groupCustomerPairs: GroupCustomerPair[],
    sharedContext?: Context
  ): Promise<void>

  /**
   * This method adds addresses to customers.
   *
   * @param {CreateCustomerAddressDTO[]} addresses - A list of items, each being the details of the address to add to a customer.
   * @param {Context} sharedContext - A context used to share resources, such as transaction manager, between the application and the module.
   * @returns {Promise<CustomerAddressDTO[]>} The list of created addresses.
   *
   * @example
   * const addresses = await customerModuleService.createAddresses([
   *   {
   *     customer_id: "cus_123",
   *     address_name: "Home",
   *     address_1: "432 Stierlin Rd",
   *     city: "Mountain View",
   *     country_code: "us",
   *   },
   * ])
   */
  createAddresses(
    addresses: CreateCustomerAddressDTO[],
    sharedContext?: Context
  ): Promise<CustomerAddressDTO[]>

  /**
   * This method adds an address to a customer.
   *
   * @param {CreateCustomerAddressDTO} address - The details of the address to add to a customer.
   * @param {Context} sharedContext - A context used to share resources, such as transaction manager, between the application and the module.
   * @returns {Promise<CustomerAddressDTO>} The created address.
   *
   * @example
   * const address = await customerModuleService.createAddresses({
   *   customer_id: "cus_123",
   *   address_name: "Home",
   *   address_1: "432 Stierlin Rd",
   *   city: "Mountain View",
   *   country_code: "us",
   * })
   */
  createAddresses(
    address: CreateCustomerAddressDTO,
    sharedContext?: Context
  ): Promise<CustomerAddressDTO>

  /**
   * This method updates an address.
   *
   * @param {string} addressId - The address's ID.
   * @param {UpdateCustomerAddressDTO} data - The attributes to update in the address.
   * @param {Context} sharedContext - A context used to share resources, such as transaction manager, between the application and the module.
   * @returns {Promise<CustomerAddressDTO>} The updated address.
   *
   * @example
   * const address = await customerModuleService.updateAddresses(
   *   "cuaddr_123",
   *   {
   *     first_name: "John",
   *     last_name: "Smith",
   *   }
   * )
   */
  updateAddresses(
    addressId: string,
    data: UpdateCustomerAddressDTO,
    sharedContext?: Context
  ): Promise<CustomerAddressDTO>

  /**
   * This method updates existing addresses.
   *
   * @param {string[]} addressIds - The IDs of addresses to update.
   * @param {UpdateCustomerAddressDTO} data - The attributes to update in the addresses.
   * @param {Context} sharedContext - A context used to share resources, such as transaction manager, between the application and the module.
   * @returns {Promise<CustomerAddressDTO[]>} The updated addresses.
   *
   * @example
   * const addresses = await customerModuleService.updateAddresses(
   *   ["cuaddr_123", "cuaddr_321"],
   *   {
   *     first_name: "John",
   *     last_name: "Smith",
   *   }
   * )
   */
  updateAddresses(
    addressIds: string[],
    data: UpdateCustomerAddressDTO,
    sharedContext?: Context
  ): Promise<CustomerAddressDTO[]>

  /**
   * This method updates existing addresses matching the specified filters.
   *
   * @param {FilterableCustomerAddressProps} selector - The filters that specify which address should be updated.
   * @param {UpdateCustomerAddressDTO} data - The attributes to update in the addresses.
   * @param {Context} sharedContext - A context used to share resources, such as transaction manager, between the application and the module.
   * @returns {Promise<CustomerAddressDTO[]>} The updated addresses.
   *
   * @example
   * const addresses = await customerModuleService.updateAddresses(
   *   { first_name: "John" },
   *   {
   *     last_name: "Smith",
   *   }
   * )
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
   * await customerModuleService.deleteAddresses("cuaddr_123")
   */
  deleteAddresses(addressId: string, sharedContext?: Context): Promise<void>

  /**
   * This method deletes addresses by their IDs.
   *
   * @param {string[]} addressIds - The IDs of addresses.
   * @param {Context} sharedContext - A context used to share resources, such as transaction manager, between the application and the module.
   * @returns {Promise<void>} Resolves when the addresses are deleted successfully.
   *
   * @example
   * await customerModuleService.deleteAddresses([
   *   "cuaddr_123",
   *   "cuaddr_321",
   * ])
   */
  deleteAddresses(addressIds: string[], sharedContext?: Context): Promise<void>

  /**
   * This method deletes addresses matching the specified filters.
   *
   * @param {FilterableCustomerAddressProps} selector - The filters that specify which addresses should be deleted.
   * @param {Context} sharedContext - A context used to share resources, such as transaction manager, between the application and the module.
   * @returns {Promise<void>} Resolves when the addresses are deleted successfully.
   *
   * @example
   * await customerModuleService.deleteAddresses({
   *   first_name: "John",
   *   last_name: "Smith",
   * })
   */
  deleteAddresses(
    selector: FilterableCustomerAddressProps,
    sharedContext?: Context
  ): Promise<void>

  /**
   * This method retrieves a paginated list of addresses based on optional filters and configuration.
   *
   * @param {FilterableCustomerAddressProps} filters - The filters to apply on the retrieved addresss.
   * @param {FindConfig<CustomerAddressDTO>} config - The configurations determining how the address is retrieved. Its properties, such as `select` or `relations`, accept the
   * attributes or relations associated with a address.
   * @param {Context} sharedContext - A context used to share resources, such as transaction manager, between the application and the module.
   * @returns {Promise<CustomerAddressDTO[]>} The list of addresses.
   *
   * @example
   * To retrieve a list of addresses using their IDs:
   *
   * ```ts
   * const addresses = await customerModuleService.listAddresses({
   *   id: ["cuaddr_123", "cuaddr_321"],
   * })
   * ```
   *
   * To specify relations that should be retrieved within the addresses:
   *
   * ```ts
   * const addresses = await customerModuleService.listAddresses(
   *   {
   *     id: ["cuaddr_123", "cuaddr_321"],
   *   },
   *   {
   *     relations: ["customer"],
   *   }
   * )
   * ```
   *
   * By default, only the first `15` records are retrieved. You can control pagination by specifying the `skip` and `take` properties of the `config` parameter:
   *
   * ```ts
   * const addresses = await customerModuleService.listAddresses(
   *   {
   *     id: ["cuaddr_123", "cuaddr_321"],
   *   },
   *   {
   *     relations: ["customer"],
   *     take: 20,
   *     skip: 2,
   *   }
   * )
   * ```
   */
  listAddresses(
    filters?: FilterableCustomerAddressProps,
    config?: FindConfig<CustomerAddressDTO>,
    sharedContext?: Context
  ): Promise<CustomerAddressDTO[]>

  /**
   * This method retrieves a paginated list of addresses along with the total count of available addresses satisfying the provided filters.
   *
   * @param {FilterableCustomerAddressProps} filters - The filters to apply on the retrieved addresss.
   * @param {FindConfig<CustomerAddressDTO>} config - The configurations determining how the address is retrieved. Its properties, such as `select` or `relations`, accept the
   * attributes or relations associated with a address.
   * @param {Context} sharedContext - A context used to share resources, such as transaction manager, between the application and the module.
   * @returns {Promise<[CustomerAddressDTO[], number]>} The list of addresses along with their total count.
   *
   * @example
   * To retrieve a list of addresses using their IDs:
   *
   * ```ts
   * const [addresses, count] =
   *   await customerModuleService.listAndCountAddresses({
   *     id: ["cuaddr_123", "cuaddr_321"],
   *   })
   * ```
   *
   * To specify relations that should be retrieved within the addresses:
   *
   * ```ts
   * const [addresses, count] =
   *   await customerModuleService.listAndCountAddresses(
   *     {
   *       id: ["cuaddr_123", "cuaddr_321"],
   *     },
   *     {
   *       relations: ["customer"],
   *     }
   *   )
   * ```
   *
   * By default, only the first `15` records are retrieved. You can control pagination by specifying the `skip` and `take` properties of the `config` parameter:
   *
   * ```ts
   * const [addresses, count] =
   *   await customerModuleService.listAndCountAddresses(
   *     {
   *       id: ["cuaddr_123", "cuaddr_321"],
   *     },
   *     {
   *       relations: ["customer"],
   *       take: 20,
   *       skip: 2,
   *     }
   *   )
   * ```
   */
  listAndCountAddresses(
    filters?: FilterableCustomerAddressProps,
    config?: FindConfig<CustomerAddressDTO>,
    sharedContext?: Context
  ): Promise<[CustomerAddressDTO[], number]>

  /**
   * This method retrieves a paginated list of relations between customer and groups based on optional filters and configuration.
   *
   * @param {FilterableCustomerGroupCustomerProps} filters - The filters to apply on the retrieved customer-group relations.
   * @param {FindConfig<CustomerGroupCustomerDTO>} config - The configurations determining how the customer-group relations is retrieved. Its properties, such as `select` or `relations`, accept the
   * attributes or relations associated with a customer-group relations.
   * @param {Context} sharedContext - A context used to share resources, such as transaction manager, between the application and the module.
   * @returns {Promise<CustomerGroupCustomerDTO[]>} The list of customer-group relations.
   *
   * @example
   * To retrieve a list of customer-group relations using their IDs:
   *
   * ```ts
   * const customerGroupCustomerRels =
   *   await customerModuleService.listCustomerGroupCustomers({
   *     id: ["cusgc_123"],
   *   })
   * ```
   *
   * To specify relations that should be retrieved within the customer-group relations:
   *
   * ```ts
   * const customerGroupCustomerRels =
   *   await customerModuleService.listCustomerGroupCustomers(
   *     {
   *       id: ["cusgc_123"],
   *     },
   *     {
   *       relations: ["customer", "customer_group"],
   *     }
   *   )
   * ```
   *
   * By default, only the first `15` records are retrieved. You can control pagination by specifying the `skip` and `take` properties of the `config` parameter:
   *
   * ```ts
   * const customerGroupCustomerRels =
   *   await customerModuleService.listCustomerGroupCustomers(
   *     {
   *       id: ["cusgc_123"],
   *     },
   *     {
   *       relations: ["customer", "customer_group"],
   *       take: 20,
   *       skip: 2,
   *     }
   *   )
   * ```
   */
  listCustomerGroupCustomers(
    filters?: FilterableCustomerGroupCustomerProps,
    config?: FindConfig<CustomerGroupCustomerDTO>,
    sharedContext?: Context
  ): Promise<CustomerGroupCustomerDTO[]>

  /**
   * This method retrieves a paginated list of customers based on optional filters and configuration.
   *
   * @param {FilterableCustomerProps} filters - The filters to apply on the retrieved customers.
   * @param {FindConfig<CustomerDTO>} config - The configurations determining how the customer is retrieved. Its properties, such as `select` or `relations`, accept the
   * attributes or relations associated with a customer.
   * @param {Context} sharedContext - A context used to share resources, such as transaction manager, between the application and the module.
   * @returns {Promise<CustomerDTO[]>} The list of customers.
   *
   * @example
   * To retrieve a list of customers using their IDs:
   *
   * ```ts
   * const customers = await customerModuleService.listCustomers({
   *   id: ["cus_123", "cus_321"],
   * })
   * ```
   *
   * To specify relations that should be retrieved within the customers:
   *
   * ```ts
   * const customers = await customerModuleService.listCustomers(
   *   {
   *     id: ["cus_123", "cus_321"],
   *   },
   *   {
   *     relations: ["groups"],
   *   }
   * )
   * ```
   *
   * By default, only the first `15` records are retrieved. You can control pagination by specifying the `skip` and `take` properties of the `config` parameter:
   *
   * ```ts
   * const customers = await customerModuleService.listCustomers(
   *   {
   *     id: ["cus_123", "cus_321"],
   *   },
   *   {
   *     relations: ["groups"],
   *     take: 20,
   *     skip: 2,
   *   }
   * )
   * ```
   */
  listCustomers(
    filters?: FilterableCustomerProps,
    config?: FindConfig<CustomerDTO>,
    sharedContext?: Context
  ): Promise<CustomerDTO[]>

  /**
   * This method retrieves a paginated list of customers along with the total count of available customers satisfying the provided filters.
   *
   * @param {FilterableCustomerProps} filters - The filters to apply on the retrieved customers.
   * @param {FindConfig<CustomerDTO>} config - The configurations determining how the customer is retrieved. Its properties, such as `select` or `relations`, accept the
   * attributes or relations associated with a customer.
   * @param {Context} sharedContext - A context used to share resources, such as transaction manager, between the application and the module.
   * @returns {Promise<[CustomerDTO[], number]>} The list of customers along with their total count.
   *
   * @example
   * To retrieve a list of customers using their IDs:
   *
   * ```ts
   * const [customers, count] = await customerModuleService.listAndCountCustomers({
   *   id: ["cus_123", "cus_321"],
   * })
   * ```
   *
   * To specify relations that should be retrieved within the customers:
   *
   * ```ts
   * const [customers, count] = await customerModuleService.listAndCountCustomers(
   *   {
   *     id: ["cus_123", "cus_321"],
   *   },
   *   {
   *     relations: ["groups"],
   *   }
   * )
   * ```
   *
   * By default, only the first `15` records are retrieved. You can control pagination by specifying the `skip` and `take` properties of the `config` parameter:
   *
   * ```ts
   * const [customers, count] = await customerModuleService.listAndCountCustomers(
   *   {
   *     id: ["cus_123", "cus_321"],
   *   },
   *   {
   *     relations: ["groups"],
   *     take: 20,
   *     skip: 2,
   *   }
   * )
   * ```
   */
  listAndCountCustomers(
    filters?: FilterableCustomerProps,
    config?: FindConfig<CustomerDTO>,
    sharedContext?: Context
  ): Promise<[CustomerDTO[], number]>

  /**
   * This method retrieves a paginated list of customer groups based on optional filters and configuration.
   *
   * @param {FilterableCustomerGroupProps} filters - The filters to apply on the retrieved customer groups.
   * @param {FindConfig<CustomerGroupDTO>} config - The configurations determining how the customer group is retrieved. Its properties, such as `select` or `relations`, accept the
   * attributes or relations associated with a customer group.
   * @param {Context} sharedContext - A context used to share resources, such as transaction manager, between the application and the module.
   * @returns {Promise<CustomerGroupDTO[]>} The list of customer groups.
   *
   * @example
   * To retrieve a list of customer groups using their IDs:
   *
   * ```ts
   * const customerGroups =
   *   await customerModuleService.listCustomerGroups({
   *     id: ["cusgroup_123", "cusgroup_321"],
   *   })
   * ```
   *
   * To specify relations that should be retrieved within the customer groups:
   *
   * ```ts
   * const customerGroups =
   *   await customerModuleService.listCustomerGroups(
   *     {
   *       id: ["cusgroup_123", "cusgroup_321"],
   *     },
   *     {
   *       relations: ["customers"],
   *     }
   *   )
   * ```
   *
   * By default, only the first `15` records are retrieved. You can control pagination by specifying the `skip` and `take` properties of the `config` parameter:
   *
   * ```ts
   * const customerGroups =
   *   await customerModuleService.listCustomerGroups(
   *     {
   *       id: ["cusgroup_123", "cusgroup_321"],
   *     },
   *     {
   *       relations: ["customers"],
   *       take: 20,
   *       skip: 2,
   *     }
   *   )
   * ```
   */
  listCustomerGroups(
    filters?: FilterableCustomerGroupProps,
    config?: FindConfig<CustomerGroupDTO>,
    sharedContext?: Context
  ): Promise<CustomerGroupDTO[]>

  /**
   * This method retrieves a paginated list of customer groups along with the total count of available customer groups satisfying the provided filters.
   *
   * @param {FilterableCustomerGroupProps} filters - The filters to apply on the retrieved customer groups.
   * @param {FindConfig<CustomerGroupDTO>} config - The configurations determining how the customer group is retrieved. Its properties, such as `select` or `relations`, accept the
   * attributes or relations associated with a customer group.
   * @param {Context} sharedContext - A context used to share resources, such as transaction manager, between the application and the module.
   * @returns {Promise<[CustomerGroupDTO[], number]>} The list of customer groups along with their total count.
   *
   * @example
   * To retrieve a list of customer groups using their IDs:
   *
   * ```ts
   * const [customerGroups, count] =
   *   await customerModuleService.listCustomerGroups({
   *     id: ["cusgroup_123", "cusgroup_321"],
   *   })
   * ```
   *
   * To specify relations that should be retrieved within the customer groups:
   *
   * ```ts
   * const [customerGroups, count] =
   *   await customerModuleService.listCustomerGroups(
   *     {
   *       id: ["cusgroup_123", "cusgroup_321"],
   *     },
   *     {
   *       relations: ["customers"],
   *     }
   *   )
   * ```
   *
   * By default, only the first `15` records are retrieved. You can control pagination by specifying the `skip` and `take` properties of the `config` parameter:
   *
   * ```ts
   * const [customerGroups, count] =
   *   await customerModuleService.listCustomerGroups(
   *     {
   *       id: ["cusgroup_123", "cusgroup_321"],
   *     },
   *     {
   *       relations: ["customers"],
   *       take: 20,
   *       skip: 2,
   *     }
   *   )
   * ```
   */
  listAndCountCustomerGroups(
    filters?: FilterableCustomerGroupProps,
    config?: FindConfig<CustomerGroupDTO>,
    sharedContext?: Context
  ): Promise<[CustomerGroupDTO[], number]>

  /**
   * This method soft deletes customers by their IDs.
   *
   * @param {string[]} customerIds - The IDs of customers.
   * @param {SoftDeleteReturn<TReturnableLinkableKeys>} config - An object that is used to specify an entity's related entities that should be soft-deleted when the main entity is soft-deleted.
   * @param {Context} sharedContext - A context used to share resources, such as transaction manager, between the application and the module.
   * @returns {Promise<void | Record<TReturnableLinkableKeys, string[]>>} An object that includes the IDs of related records that were also soft deleted, such as the ID of the associated address.
   * The object's keys are the ID attribute names of the customer entity's relations, such as `address_id`, and its value is an array of strings, each being the ID of a record associated
   * with the customer through this relation, such as the IDs of associated address.
   *
   * If there are no related records, the promise resolves to `void`.
   *
   * @example
   * await customerModuleService.softDeleteCustomers(["cus_123"])
   */
  softDeleteCustomers<TReturnableLinkableKeys extends string = string>(
    customerIds: string[],
    config?: SoftDeleteReturn<TReturnableLinkableKeys>,
    sharedContext?: Context
  ): Promise<Record<TReturnableLinkableKeys, string[]> | void>

  /**
   * This method restores soft deleted customer by their IDs.
   *
   * @param {string[]} customerIds - The IDs of customers.
   * @param {RestoreReturn<TReturnableLinkableKeys>} config - Configurations determining which relations to restore along with each of the customer. You can pass to its `returnLinkableKeys`
   * property any of the customer's relation attribute names, such as `groups`.
   * @param {Context} sharedContext - A context used to share resources, such as transaction manager, between the application and the module.
   * @returns {Promise<void | Record<TReturnableLinkableKeys, string[]>>} An object that includes the IDs of related records that were restored.
   * If there are no related records restored, the promise resolves to `void`.
   *
   * @example
   * await customerModuleService.restoreCustomers(["cus_123"])
   */
  restoreCustomers<TReturnableLinkableKeys extends string = string>(
    customerIds: string[],
    config?: RestoreReturn<TReturnableLinkableKeys>,
    sharedContext?: Context
  ): Promise<Record<TReturnableLinkableKeys, string[]> | void>

  /**
   * This method soft deletes customer groups by their IDs.
   *
   * @param {string[]} groupIds - The IDs of customer groups.
   * @param {SoftDeleteReturn<TReturnableLinkableKeys>} config - An object that is used to specify an entity's related entities that should be soft-deleted when the main entity is soft-deleted.
   * @param {Context} sharedContext - A context used to share resources, such as transaction manager, between the application and the module.
   * @returns {Promise<void | Record<TReturnableLinkableKeys, string[]>>} An object that includes the IDs of related records that were also soft deleted.
   * If there are no related records, the promise resolves to `void`.
   *
   * @example
   * await customerModuleService.softDeleteCustomerGroups([
   *   "cusgroup_123",
   * ])
   */
  softDeleteCustomerGroups<TReturnableLinkableKeys extends string = string>(
    groupIds: string[],
    config?: SoftDeleteReturn<TReturnableLinkableKeys>,
    sharedContext?: Context
  ): Promise<Record<TReturnableLinkableKeys, string[]> | void>

  /**
   * This method restores a soft deleted customer group by its IDs.
   *
   * @param {string[]} groupIds - The IDs of customer groups.
   * @param {RestoreReturn<TReturnableLinkableKeys>} config - Configurations determining which relations to restore along with each of the customer groups. You can pass to its `returnLinkableKeys`
   * property any of the customer group's relation attribute names, such as `customers`.
   * @param {Context} sharedContext - A context used to share resources, such as transaction manager, between the application and the module.
   * @returns {Promise<void | Record<TReturnableLinkableKeys, string[]>>} An object that includes the IDs of related records that were restored.
   * If there are no related records restored, the promise resolves to `void`.
   *
   * @example
   * await customerModuleService.restoreCustomerGroups([
   *   "cusgroup_123",
   * ])
   */
  restoreCustomerGroups<TReturnableLinkableKeys extends string = string>(
    groupIds: string[],
    config?: RestoreReturn<TReturnableLinkableKeys>,
    sharedContext?: Context
  ): Promise<Record<TReturnableLinkableKeys, string[]> | void>
}

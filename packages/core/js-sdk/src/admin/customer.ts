import {
  HttpTypes,
  SelectParams,
} from "@medusajs/types"
import { Client } from "../client"
import { ClientHeaders } from "../types"

export class Customer {
  /**
   * @ignore
   */
  private client: Client
  /**
   * @ignore
   */
  constructor(client: Client) {
    this.client = client
  }

  /**
   * This method creates a customer. It sends a request to the
   * [Create Customer](https://docs.medusajs.com/api/admin#customers_postcustomers) API route.
   * 
   * @param body - The customer's details.
   * @param query - Configure the fields to retrieve in the customer.
   * @param headers - Headers to pass in the request.
   * @returns The customer's details.
   * 
   * @example
   * sdk.admin.customer.create({
   *   email: "customer@gmail.com"
   * })
   * .then(({ customer }) => {
   *   console.log(customer)
   * })
   */
  async create(
    body: HttpTypes.AdminCreateCustomer,
    query?: SelectParams,
    headers?: ClientHeaders
  ) {
    return this.client.fetch<
      HttpTypes.AdminCustomerResponse
    >(`/admin/customers`, {
      method: "POST",
      headers,
      body,
      query,
    })
  }

  /**
   * This method updates a customer's details. It sends a request to the
   * [Update Customer](https://docs.medusajs.com/api/admin#customers_postcustomersid) API route.
   * 
   * @param id - The customer's ID.
   * @param body - The details to update of the customer.
   * @param query - Configure the fields to retrieve in the customer.
   * @param headers - Headers to pass in the request.
   * @returns The customer's details.
   * 
   * @example
   * sdk.admin.customer.update("cus_123", {
   *   first_name: "John"
   * })
   * .then(({ customer }) => {
   *   console.log(customer)
   * })
   */
  async update(
    id: string,
    body: HttpTypes.AdminUpdateCustomer,
    query?: SelectParams,
    headers?: ClientHeaders
  ) {
    return this.client.fetch<HttpTypes.AdminCustomerResponse>(
      `/admin/customers/${id}`,
      {
        method: "POST",
        headers,
        body,
        query,
      }
    )
  }

  /**
   * This method retrieves a paginated list of customers. It sends a request to the
   * [List Customers](https://docs.medusajs.com/api/admin#customers_getcustomers)
   * API route.
   * 
   * @param queryParams - Filters and pagination configurations.
   * @param headers - Headers to pass in the request.
   * @returns The paginated list of customers.
   * 
   * @example
   * To retrieve the list of customers:
   * 
   * ```ts
   * sdk.admin.customer.list()
   * .then(({ customers, count, limit, offset }) => {
   *   console.log(customers)
   * })
   * ```
   * 
   * To configure the pagination, pass the `limit` and `offset` query parameters.
   * 
   * For example, to retrieve only 10 items and skip 10 items:
   * 
   * ```ts
   * sdk.admin.customer.list({
   *   limit: 10,
   *   offset: 10
   * })
   * .then(({ customers, count, limit, offset }) => {
   *   console.log(customers)
   * })
   * ```
   * 
   * Using the `fields` query parameter, you can specify the fields and relations to retrieve
   * in each customer:
   * 
   * ```ts
   * sdk.admin.customer.list({
   *   fields: "id,*groups"
   * })
   * .then(({ customers, count, limit, offset }) => {
   *   console.log(customers)
   * })
   * ```
   * 
   * Learn more about the `fields` property in the [API reference](https://docs.medusajs.com/api/store#select-fields-and-relations).
   */
  async list(
    queryParams?: HttpTypes.AdminCustomerFilters,
    headers?: ClientHeaders
  ) {
    return this.client.fetch<
      HttpTypes.AdminCustomerListResponse
    >(`/admin/customers`, {
      headers,
      query: queryParams,
    })
  }

  /**
   * This method retrieves a customer by its ID. It sends a request to the 
   * [Get Customer](https://docs.medusajs.com/api/admin#customers_getcustomersid)
   * API route.
   * 
   * @param id - The customer's ID.
   * @param query - Configure the fields to retrieve in the customer.
   * @param headers - Headers to pass in the request.
   * @returns The customer's details.
   * 
   * @example
   * To retrieve a customer by its ID:
   * 
   * ```ts
   * sdk.admin.customer.retrieve("cus_123")
   * .then(({ customer }) => {
   *   console.log(customer)
   * })
   * ```
   * 
   * To specify the fields and relations to retrieve:
   * 
   * ```ts
   * sdk.admin.customer.retrieve("cus_123", {
   *   fields: "id,*groups"
   * })
   * .then(({ customer }) => {
   *   console.log(customer)
   * })
   * ```
   * 
   * Learn more about the `fields` property in the [API reference](https://docs.medusajs.com/api/store#select-fields-and-relations).
   */
  async retrieve(id: string, query?: SelectParams, headers?: ClientHeaders) {
    return this.client.fetch<HttpTypes.AdminCustomerResponse>(
      `/admin/customers/${id}`,
      {
        query,
        headers,
      }
    )
  }

  /**
   * This method deletes a customer by its ID. It sends a request to the 
   * [Delete Customer](https://docs.medusajs.com/api/admin#customers_deletecustomersid)
   * API route.
   * 
   * @param id - The customer's ID.
   * @param headers - Headers to pass in the request.
   * @returns The deletion's details.
   * 
   * @example
   * sdk.admin.customer.delete("cus_123")
   * .then(({ deleted }) => {
   *   console.log(deleted)
   * })
   */
  async delete(id: string, headers?: ClientHeaders) {
    return this.client.fetch<HttpTypes.AdminCustomerDeleteResponse>(
      `/admin/customers/${id}`,
      {
        method: "DELETE",
        headers,
      }
    )
  }

  /**
   * This method manages customer groups for a customer.
   * It sends a request to the [Manage Customers](https://docs.medusajs.com/api/admin#customers_postcustomersidcustomergroups)
   * API route.
   *
   * @param id - The customer's ID.
   * @param body - The groups to add customer to or remove customer from.
   * @param headers - Headers to pass in the request
   * @returns The customers details.
   *
   * @example
   * sdk.admin.customer.batchCustomerGroups("cus_123", {
   *   add: ["cusgroup_123"],
   *   remove: ["cusgroup_321"]
   * })
   * .then(({ customer }) => {
   *   console.log(customer)
   * })
   */
  async batchCustomerGroups(
    id: string,
    body: HttpTypes.AdminBatchLink,
    headers?: ClientHeaders
  ) {
    return await this.client.fetch<HttpTypes.AdminCustomerResponse>(
      `/admin/customers/${id}/customer-groups`,
      {
        method: "POST",
        headers,
        body,
      }
    )
  }
}

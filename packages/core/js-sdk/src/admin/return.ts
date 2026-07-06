import { HttpTypes, SelectParams } from "@medusajs/types"

import { Client } from "../client.js"
import { ClientHeaders } from "../types.js"

export class Return {
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
   * This method retrieves a list of returns. It sends a request to the
   * [List Returns](https://docs.medusajs.com/api/admin#returns_getreturns)
   * API route.
   * 
   * @param query - Filters and pagination configurations.
   * @param headers - Headers to pass in the request.
   * @returns The list of returns.
   * 
   * @example
   * To retrieve the list of returns:
   * 
   * ```ts
   * sdk.admin.return.list()
   * .then(({ returns, count, limit, offset }) => {
   *   console.log(returns)
   * })
   * ```
   * 
   * To configure the pagination, pass the `limit` and `offset` query parameters.
   * 
   * For example, to retrieve only 10 items and skip 10 items:
   * 
   * ```ts
   * sdk.admin.return.list({
   *   limit: 10,
   *   offset: 10
   * })
   * .then(({ returns, count, limit, offset }) => {
   *   console.log(returns)
   * })
   * ```
   * 
   * Using the `fields` query parameter, you can specify the fields and relations to retrieve
   * in each return:
   * 
   * ```ts
   * sdk.admin.return.list({
   *   fields: "id,*items"
   * })
   * .then(({ returns, count, limit, offset }) => {
   *   console.log(returns)
   * })
   * ```
   * 
   * Learn more about the `fields` property in the [API reference](https://docs.medusajs.com/api/admin#select-fields-and-relations).
   */
  async list(query?: HttpTypes.AdminReturnFilters, headers?: ClientHeaders) {
    return await this.client.fetch<HttpTypes.AdminReturnsResponse>(
      `/admin/returns`,
      {
        query,
        headers,
      }
    )
  }

  /**
   * This method retrieves a return by ID. It sends a request to the
   * [Get Return](https://docs.medusajs.com/api/admin#returns_getreturnsid)
   * API route.
   * 
   * @param id - The ID of the return to retrieve.
   * @param query - Configure the fields and relations to retrieve in the return.
   * @param headers - Headers to pass in the request.
   * @returns The return's details.
   * 
   * @example
   * To retrieve a return by its ID:
   * 
   * ```ts
   * sdk.admin.return.retrieve("return_123")
   * .then(({ return }) => {
   *   console.log(return)
   * })
   * ```
   * 
   * To specify the fields and relations to retrieve:
   * 
   * ```ts
   * sdk.admin.return.retrieve("return_123", {
   *   fields: "id,*items"
   * })
   * .then(({ return }) => {
   *   console.log(return)
   * })
   * ```
   * 
   * Learn more about the `fields` property in the [API reference](https://docs.medusajs.com/api/admin#select-fields-and-relations).
   */
  async retrieve(id: string, query?: SelectParams, headers?: ClientHeaders) {
    return await this.client.fetch<HttpTypes.AdminReturnResponse>(
      `/admin/returns/${id}`,
      {
        query,
        headers,
      }
    )
  }

  /**
   * This method initiates a return request by creating a return. It sends a request to the
   * [Create Return](https://docs.medusajs.com/api/admin#returns_postreturns)
   * API route.
   * 
   * @param body - The details of the return to create.
   * @param query - Configure the fields and relations to retrieve in the return.
   * @param headers - Headers to pass in the request.
   * @returns The return's details.
   * 
   * @example
   * sdk.admin.return.initiateRequest({
   *   order_id: "order_123",
   * })
   * .then(({ return }) => {
   *   console.log(return)
   * })
   */
  async initiateRequest(
    body: HttpTypes.AdminInitiateReturnRequest,
    query?: HttpTypes.SelectParams,
    headers?: ClientHeaders
  ) {
    return await this.client.fetch<HttpTypes.AdminReturnResponse>(
      `/admin/returns`,
      {
        method: "POST",
        headers,
        body,
        query,
      }
    )
  }

  /**
   * This method cancels a return. It sends a request to the
   * [Cancel Return](https://docs.medusajs.com/api/admin#returns_postreturnsidcancel)
   * API route.
   * 
   * @param id - The ID of the return to cancel.
   * @param query - Configure the fields and relations to retrieve in the return.
   * @param headers - Headers to pass in the request.
   * @returns The return's details.
   * 
   * @example
   * sdk.admin.return.cancel("return_123")
   * .then(({ return }) => {
   *   console.log(return)
   * })
   */
  async cancel(
    id: string,
    query?: HttpTypes.SelectParams,
    headers?: ClientHeaders
  ) {
    return await this.client.fetch<HttpTypes.AdminReturnResponse>(
      `/admin/returns/${id}/cancel`,
      {
        method: "POST",
        headers,
        query,
      }
    )
  }

  /**
   * This method cancels a return request. It sends a request to the
   * [Cancel Return Request](https://docs.medusajs.com/api/admin#returns_deletereturnsidrequest)
   * API route.
   * 
   * @param id - The ID of the return to cancel.
   * @param query - Configure the fields and relations to retrieve in the return.
   * @param headers - Headers to pass in the request.
   * @returns The return's details.
   * 
   * @example
   * sdk.admin.return.cancelRequest("return_123")
   * .then(({ return }) => {
   *   console.log(return)
   * })
   */
  async cancelRequest(
    id: string,
    query?: HttpTypes.SelectParams,
    headers?: ClientHeaders
  ) {
    return await this.client.fetch<HttpTypes.AdminReturnResponse>(
      `/admin/returns/${id}/request`,
      {
        method: "DELETE",
        headers,
        query,
      }
    )
  }

  /**
   * This method adds an item to a return request. It sends a request to the
   * [Add Return Item](https://docs.medusajs.com/api/admin#returns_postreturnsidrequestitems)
   * API route.
   * 
   * @param id - The ID of the return to add the item to.
   * @param body - The details of the item to add to the return.
   * @param query - Configure the fields and relations to retrieve in the return.
   * @param headers - Headers to pass in the request.
   * @returns The return's details.
   * 
   * @example
   * sdk.admin.return.addReturnItem("return_123", {
   *   id: "orlitem_123",
   *   quantity: 1,
   * })
   * .then(({ return }) => {
   *   console.log(return)
   * })
   */
  async addReturnItem(
    id: string,
    body: HttpTypes.AdminAddReturnItems,
    query?: HttpTypes.SelectParams,
    headers?: ClientHeaders
  ) {
    return await this.client.fetch<HttpTypes.AdminReturnResponse>(
      `/admin/returns/${id}/request-items`,
      {
        method: "POST",
        headers,
        body,
        query,
      }
    )
  }

  /**
   * This method updates an item in a return request by the ID of the item's `RETURN_ITEM` action.
   * Every item has an `actions` property, whose value is an array of actions. You can check the action's name 
   * using its `action` property, and use the value of the `id` property. For example, 
   * `item.actions.find((action) => action.action === "RETURN_ITEM")?.id` is the ID of an item's `RETURN_ITEM` action.
   * 
   * This method sends a request to the
   * [Update Requested Return Item](https://docs.medusajs.com/api/admin#returns_postreturnsidrequestitemsaction_id)
   * API route.
   * 
   * @param id - The ID of the return to update the item in.
   * @param actionId - The ID of the item's `RETURN_ITEM` action.
   * @param body - The details of the item to update.
   * @param query - Configure the fields and relations to retrieve in the return.
   * @param headers - Headers to pass in the request.
   * @returns The return's details.
   * 
   * @example
   * sdk.admin.return.updateReturnItem("return_123", "orchach_123", {
   *   quantity: 2,
   * })
   * .then(({ return }) => {
   *   console.log(return)
   * })
   */
  async updateReturnItem(
    id: string,
    actionId: string,
    body: HttpTypes.AdminUpdateReturnItems,
    query?: HttpTypes.SelectParams,
    headers?: ClientHeaders
  ) {
    return await this.client.fetch<HttpTypes.AdminReturnResponse>(
      `/admin/returns/${id}/request-items/${actionId}`,
      {
        method: "POST",
        headers,
        body,
        query,
      }
    )
  }

  /**
   * This method removes an item from a return request by the ID of the item's `RETURN_ITEM` action.
   * 
   * Every item has an `actions` property, whose value is an array of actions. You can check the action's name 
   * using its `action` property, and use the value of the `id` property. For example, 
   * `item.actions.find((action) => action.action === "RETURN_ITEM")?.id` is the ID of an item's `RETURN_ITEM` action.
   * 
   * This method sends a request to the
   * [Remove Item from Return](https://docs.medusajs.com/api/admin#returns_deletereturnsidrequestitemsaction_id)
   * API route.
   * 
   * @param id - The ID of the return to remove the item from.
   * @param actionId - The ID of the item's `RETURN_ITEM` action.
   * @param query - Configure the fields and relations to retrieve in the return.
   * @param headers - Headers to pass in the request.
   * @returns The return's details.
   * 
   * @example
   * sdk.admin.return.removeReturnItem("return_123", "orchach_123")
   * .then(({ return }) => {
   *   console.log(return)
   * })
   */
  async removeReturnItem(
    id: string,
    actionId: string,
    query?: HttpTypes.SelectParams,
    headers?: ClientHeaders
  ) {
    return await this.client.fetch<HttpTypes.AdminReturnResponse>(
      `/admin/returns/${id}/request-items/${actionId}`,
      {
        method: "DELETE",
        headers,
        query,
      }
    )
  }

  /**
   * This method adds a shipping method to a return request. It sends a request to the
   * [Add Shipping Method to Return](https://docs.medusajs.com/api/admin#returns_postreturnsidshippingmethod)
   * API route.
   * 
   * @param id - The ID of the return to add the shipping method to.
   * @param body - The details of the shipping method to add to the return.
   * @param query - Configure the fields and relations to retrieve in the return.
   * @param headers - Headers to pass in the request.
   * @returns The return's details.
   * 
   * @example
   * sdk.admin.return.addReturnShipping("return_123", {
   *   shipping_option_id: "so_123",
   * })
   * .then(({ return }) => {
   *   console.log(return)
   * })
   */
  async addReturnShipping(
    id: string,
    body: HttpTypes.AdminAddReturnShipping,
    query?: HttpTypes.SelectParams,
    headers?: ClientHeaders
  ) {
    return await this.client.fetch<HttpTypes.AdminReturnResponse>(
      `/admin/returns/${id}/shipping-method`,
      {
        method: "POST",
        headers,
        body,
        query,
      }
    )
  }

  /**
   * This method updates a shipping method in a return request by the ID of the shipping method's `SHIPPING_ADD` action.
   * 
   * Every shipping method has an `actions` property, whose value is an array of actions. You can check the action's name 
   * using its `action` property, and use the value of the `id` property.
   * 
   * For example, `shipping_method.actions.find((action) => action.action === "SHIPPING_ADD")?.id` is 
   * the ID of a shipping method's `SHIPPING_ADD` action.
   * 
   * This method sends a request to the
   * [Update Shipping Method in Return](https://docs.medusajs.com/api/admin#returns_postreturnsidshippingmethodaction_id)
   * API route.
   * 
   * @param id - The ID of the return to update the shipping method in.
   * @param actionId - The ID of the shipping method's `SHIPPING_ADD` action.
   * @param body - The details of the shipping method to update.
   * @param query - Configure the fields and relations to retrieve in the return.
   * @param headers - Headers to pass in the request.
   * @returns The return's details.
   * 
   * @example
   * sdk.admin.return.updateReturnShipping("return_123", "orchach_123", {
   *   custom_amount: 100,
   * })
   * .then(({ return }) => {
   *   console.log(return)
   * })
   */
  async updateReturnShipping(
    id: string,
    actionId: string,
    body: HttpTypes.AdminUpdateReturnShipping,
    query?: HttpTypes.SelectParams,
    headers?: ClientHeaders
  ) {
    return await this.client.fetch<HttpTypes.AdminReturnResponse>(
      `/admin/returns/${id}/shipping-method/${actionId}`,
      {
        method: "POST",
        headers,
        body,
        query,
      }
    )
  }

  /**
   * This method removes a shipping method from a return request by the ID of the shipping method's `SHIPPING_ADD` action.
   * 
   * Every shipping method has an `actions` property, whose value is an array of actions. You can check the action's name 
   * using its `action` property, and use the value of the `id` property.
   * 
   * For example, `shipping_method.actions.find((action) => action.action === "SHIPPING_ADD")?.id` is 
   * the ID of a shipping method's `SHIPPING_ADD` action.
   * 
   * This method sends a request to the
   * [Remove Shipping Method from Return](https://docs.medusajs.com/api/admin#returns_deletereturnsidshippingmethodaction_id)
   * API route.
   * 
   * @param id - The ID of the return to remove the shipping method from.
   * @param actionId - The ID of the shipping method's `SHIPPING_ADD` action.
   * @param query - Configure the fields and relations to retrieve in the return.
   * @param headers - Headers to pass in the request.
   * @returns The return's details.
   * 
   * @example
   * sdk.admin.return.deleteReturnShipping("return_123", "orchach_123")
   * .then(({ return }) => {
   *   console.log(return)
   * })
   */
  async deleteReturnShipping(
    id: string,
    actionId: string,
    query?: HttpTypes.SelectParams,
    headers?: ClientHeaders
  ) {
    return await this.client.fetch<HttpTypes.AdminReturnResponse>(
      `/admin/returns/${id}/shipping-method/${actionId}`,
      {
        method: "DELETE",
        headers,
        query,
      }
    )
  }

  /**
   * This method updates a return request. It sends a request to the
   * [Update Return](https://docs.medusajs.com/api/admin#returns_postreturnsid)
   * API route.
   * 
   * @param id - The ID of the return to update.
   * @param body - The details of the return to update.
   * @param query - Configure the fields and relations to retrieve in the return.
   * @param headers - Headers to pass in the request.
   * @returns The return's details.
   * 
   * @example
   * sdk.admin.return.updateRequest("return_123", {
   *   location_id: "sloc_123",
   * })
   * .then(({ return }) => {
   *   console.log(return)
   * })
   */
  async updateRequest(
    id: string,
    body: HttpTypes.AdminUpdateReturnRequest,
    query?: HttpTypes.SelectParams,
    headers?: ClientHeaders
  ) {
    return await this.client.fetch<HttpTypes.AdminReturnResponse>(
      `/admin/returns/${id}`,
      {
        method: "POST",
        headers,
        body,
        query,
      }
    )
  }

  /**
   * This method confirms a return request. The return's changes are applied on the inventory quantity of the return
   * items and the order only after the return has been confirmed as received using the
   * [Confirm Return Receival](https://docs.medusajs.com/api/admin#returns_postreturnsidreceiveconfirm)
   * API route.
   * 
   * This method sends a request to the
   * [Confirm Return Request](https://docs.medusajs.com/api/admin#returns_postreturnsidrequest)
   * API route.
   * 
   * @param id - The ID of the return to confirm.
   * @param body - The details of the return to confirm.
   * @param query - Configure the fields and relations to retrieve in the return.
   * @param headers - Headers to pass in the request.
   * @returns The return's details.
   * 
   * @example
   * sdk.admin.return.confirmRequest("return_123", {
   *   no_notification: true,
   * })
   * .then(({ return }) => {
   *   console.log(return)
   * })
   */
  async confirmRequest(
    id: string,
    body: HttpTypes.AdminConfirmReturnRequest,
    query?: HttpTypes.SelectParams,
    headers?: ClientHeaders
  ) {
    return await this.client.fetch<HttpTypes.AdminReturnResponse>(
      `/admin/returns/${id}/request`,
      {
        method: "POST",
        headers,
        body,
        query,
      }
    )
  }

  /**
   * This method starts the return receival process. It sends a request to the
   * [Start Return Receival](https://docs.medusajs.com/api/admin#returns_postreturnsidreceive)
   * API route.
   * 
   * @param id - The ID of the return to start the receival process.
   * @param body - The details of the return to start the receival process.
   * @param query - Configure the fields and relations to retrieve in the return.
   * @param headers - Headers to pass in the request.
   * @returns The return's details.
   * 
   * @example
   * sdk.admin.return.initiateReceive("return_123", {
   *   internal_note: "Return received by the customer",
   * })
   * .then(({ return }) => {
   *   console.log(return)
   * })
   */
  async initiateReceive(
    id: string,
    body: HttpTypes.AdminInitiateReceiveReturn,
    query?: HttpTypes.SelectParams,
    headers?: ClientHeaders
  ) {
    return await this.client.fetch<HttpTypes.AdminReturnResponse>(
      `/admin/returns/${id}/receive`,
      {
        method: "POST",
        headers,
        body,
        query,
      }
    )
  }

  /**
   * This method adds received items to a return. These items will have the action `RECEIVE_RETURN_ITEM`.
   * 
   * The method sends a request to the
   * [Add Received Items](https://docs.medusajs.com/api/admin#returns_postreturnsidreceiveitems)
   * API route.
   * 
   * @param id - The ID of the return to add the received items to.
   * @param body - The details of the received items to add to the return.
   * @param query - Configure the fields and relations to retrieve in the return.
   * @param headers - Headers to pass in the request.
   * @returns The return's details.
   * 
   * @example
   * sdk.admin.return.receiveItems("return_123", {
   *   items: [
   *     { id: "item_123", quantity: 1 },
   *   ],
   * })
   * .then(({ return }) => {
   *   console.log(return)
   * })
   */
  async receiveItems(
    id: string,
    body: HttpTypes.AdminReceiveItems,
    query?: HttpTypes.SelectParams,
    headers?: ClientHeaders
  ) {
    return await this.client.fetch<HttpTypes.AdminReturnResponse>(
      `/admin/returns/${id}/receive-items`,
      {
        method: "POST",
        headers,
        body,
        query,
      }
    )
  }

  /**
   * This method updates a received item in the return by the ID of the item's `RECEIVE_RETURN_ITEM` action.
   * 
   * Every item has an `actions` property, whose value is an array of actions. You can check the action's name 
   * using its `action` property, and use the value of the `id` property.
   * 
   * For example, `received_item.actions.find((action) => action.action === "RECEIVE_RETURN_ITEM")?.id` is 
   * the ID of a received item's `RECEIVE_RETURN_ITEM` action.
   * 
   * This method sends a request to the
   * [Update Received Item](https://docs.medusajs.com/api/admin#returns_postreturnsidreceiveitemsaction_id)
   * API route.
   * 
   * @param id - The ID of the return to update the received item in.
   * @param actionId - The ID of the received item's `RECEIVE_RETURN_ITEM` action.
   * @param body - The details of the received item to update.
   * @param query - Configure the fields and relations to retrieve in the return.
   * @param headers - Headers to pass in the request.
   * @returns The return's details.
   * 
   * @example
   * sdk.admin.return.updateReceiveItem("return_123", "orchach_123", {
   *   quantity: 2,
   * })
   * .then(({ return }) => {
   *   console.log(return)
   * })
   */
  async updateReceiveItem(
    id: string,
    actionId: string,
    body: HttpTypes.AdminUpdateReceiveItems,
    query?: HttpTypes.SelectParams,
    headers?: ClientHeaders
  ) {
    return await this.client.fetch<HttpTypes.AdminReturnResponse>(
      `/admin/returns/${id}/receive-items/${actionId}`,
      {
        method: "POST",
        headers,
        body,
        query,
      }
    )
  }

  /**
   * This method removes a received item from the return by the ID of the item's `RECEIVE_RETURN_ITEM` action.
   * 
   * Every item has an `actions` property, whose value is an array of actions. You can check the action's name 
   * using its `action` property, and use the value of the `id` property.
   * 
   * For example, `received_item.actions.find((action) => action.action === "RECEIVE_RETURN_ITEM")?.id` is 
   * the ID of a received item's `RECEIVE_RETURN_ITEM` action.
   * 
   * This method sends a request to the
   * [Remove Received Item](https://docs.medusajs.com/api/admin#returns_deletereturnsidreceiveitemsaction_id)
   * API route.
   * 
   * @param id - The ID of the return to remove the received item from.
   * @param actionId - The ID of the received item's `RECEIVE_RETURN_ITEM` action.
   * @param query - Configure the fields and relations to retrieve in the return.
   * @param headers - Headers to pass in the request.
   * @returns The return's details.
   * 
   * @example
   * sdk.admin.return.removeReceiveItem("return_123", "orchach_123")
   * .then(({ return }) => {
   *   console.log(return)
   * })
   */
  async removeReceiveItem(
    id: string,
    actionId: string,
    query?: HttpTypes.SelectParams,
    headers?: ClientHeaders
  ) {
    return await this.client.fetch<HttpTypes.AdminReturnResponse>(
      `/admin/returns/${id}/receive-items/${actionId}`,
      {
        method: "DELETE",
        headers,
        query,
      }
    )
  }

  /**
   * This method adds damaged items to the return. These items will have the action `RECEIVE_DAMAGED_RETURN_ITEM`.
   * 
   * A damaged item's quantity is not added back to the associated inventory item's quantity in the
   * stock location where the return is initiated from.
   * 
   * The method sends a request to the
   * [Add Damaged Items](https://docs.medusajs.com/api/admin#returns_postreturnsiddismissitems)
   * API route.
   * 
   * @param id - The ID of the return to add the damaged items to.
   * @param body - The details of the damaged items to add to the return.
   * @param query - Configure the fields and relations to retrieve in the return.
   * @param headers - Headers to pass in the request.
   * @returns The return's details.
   * 
   * @example
   * sdk.admin.return.dismissItems("return_123", {
   *   items: [
   *     { id: "orli_123", quantity: 1 },
   *   ],
   * })
   * .then(({ return }) => {
   *   console.log(return)
   * })
   */
  async dismissItems(
    id: string,
    body: HttpTypes.AdminDismissItems,
    query?: HttpTypes.SelectParams,
    headers?: ClientHeaders
  ) {
    return await this.client.fetch<HttpTypes.AdminReturnResponse>(
      `/admin/returns/${id}/dismiss-items`,
      {
        method: "POST",
        headers,
        body,
        query,
      }
    )
  }

  /**
   * This method updates a damaged item in the return by the ID of the item's `RECEIVE_DAMAGED_RETURN_ITEM` action.
   * 
   * Every item has an `actions` property, whose value is an array of actions. You can check the action's name 
   * using its `action` property, and use the value of the `id` property.
   * 
   * For example, `item.actions.find((action) => action.action === "RECEIVE_DAMAGED_RETURN_ITEM")?.id` is 
   * the ID of a damaged item's `RECEIVE_DAMAGED_RETURN_ITEM` action.
   * 
   * This method sends a request to the
   * [Update Damaged Item](https://docs.medusajs.com/api/admin#returns_postreturnsiddismissitemsaction_id)
   * API route.
   * 
   * @param id - The ID of the return to update the damaged item in.
   * @param actionId - The ID of the damaged item's `RECEIVE_DAMAGED_RETURN_ITEM` action.
   * @param body - The details of the damaged item to update.
   * @param query - Configure the fields and relations to retrieve in the return.
   * @param headers - Headers to pass in the request.
   * @returns The return's details.
   * 
   * @example
   * sdk.admin.return.updateDismissItem("return_123", "orchach_123", {
   *   quantity: 2,
   * })
   * .then(({ return }) => {
   *   console.log(return)
   * })
   */
  async updateDismissItem(
    id: string,
    actionId: string,
    body: HttpTypes.AdminUpdateDismissItems,
    query?: HttpTypes.SelectParams,
    headers?: ClientHeaders
  ) {
    return await this.client.fetch<HttpTypes.AdminReturnResponse>(
      `/admin/returns/${id}/dismiss-items/${actionId}`,
      {
        method: "POST",
        headers,
        body,
        query,
      }
    )
  }

  /**
   * This method removes a damaged item from the return by the ID of the item's `RECEIVE_DAMAGED_RETURN_ITEM` action.
   * 
   * Every item has an `actions` property, whose value is an array of actions. You can check the action's name 
   * using its `action` property, and use the value of the `id` property.
   * 
   * For example, `item.actions.find((action) => action.action === "RECEIVE_DAMAGED_RETURN_ITEM")?.id` is 
   * the ID of a damaged item's `RECEIVE_DAMAGED_RETURN_ITEM` action.
   * 
   * This method sends a request to the
   * [Remove Damaged Item](https://docs.medusajs.com/api/admin#returns_deletereturnsiddismissitemsaction_id)
   * API route.
   * 
   * @param id - The ID of the return to remove the damaged item from.
   * @param actionId - The ID of the damaged item's `RECEIVE_DAMAGED_RETURN_ITEM` action.
   * @param query - Configure the fields and relations to retrieve in the return.
   * @param headers - Headers to pass in the request.
   * @returns The return's details.
   * 
   * @example
   * sdk.admin.return.removeDismissItem("return_123", "orchach_123")
   * .then(({ return }) => {
   *   console.log(return)
   * })
   */
  async removeDismissItem(
    id: string,
    actionId: string,
    query?: HttpTypes.SelectParams,
    headers?: ClientHeaders
  ) {
    return await this.client.fetch<HttpTypes.AdminReturnResponse>(
      `/admin/returns/${id}/dismiss-items/${actionId}`,
      {
        method: "DELETE",
        headers,
        query,
      }
    )
  }

  /**
   * This method confirms the return receival. It sends a request to the
   * [Confirm Return Receival](https://docs.medusajs.com/api/admin#returns_postreturnsidreceiveconfirm)
   * API route.
   * 
   * @param id - The ID of the return to confirm the receival of.
   * @param body - The details of the receival confirmation.
   * @param query - Configure the fields and relations to retrieve in the return.
   * @param headers - Headers to pass in the request.
   * @returns The return's details.
   * 
   * @example
   * sdk.admin.return.confirmReceive("return_123", {
   *   no_notification: true,
   * })
   * .then(({ return }) => {
   *   console.log(return)
   * })
   */
  async confirmReceive(
    id: string,
    body: HttpTypes.AdminConfirmReceiveReturn,
    query?: HttpTypes.SelectParams,
    headers?: ClientHeaders
  ) {
    return await this.client.fetch<HttpTypes.AdminReturnResponse>(
      `/admin/returns/${id}/receive/confirm`,
      {
        method: "POST",
        headers,
        body,
        query,
      }
    )
  }

  /**
   * This method cancels a return receival. It sends a request to the
   * [Cancel Return Receival](https://docs.medusajs.com/api/admin#returns_deletereturnsidreceive)
   * API route.
   * 
   * @param id - The ID of the return to cancel the receival of.
   * @param query - Configure the fields and relations to retrieve in the return.
   * @param headers - Headers to pass in the request.
   * @returns The return's details.
   * 
   * @example
   * sdk.admin.return.cancelReceive("return_123")
   * .then(({ return }) => {
   *   console.log(return)
   * })
   */
  async cancelReceive(
    id: string,
    query?: HttpTypes.SelectParams,
    headers?: ClientHeaders
  ) {
    return await this.client.fetch<HttpTypes.AdminReturnResponse>(
      `/admin/returns/${id}/receive`,
      {
        method: "DELETE",
        headers,
        query,
      }
    )
  }
}

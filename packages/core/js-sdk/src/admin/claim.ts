import { HttpTypes } from "@medusajs/types"

import { Client } from "../client"
import { ClientHeaders } from "../types"

export class Claim {
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
   * This method retrieves a paginated list of claims. It sends a request to the 
   * [List Claims](https://docs.medusajs.com/api/admin#claims_getclaims) API route.
   * 
   * @param query - Filters and pagination configurations.
   * @param headers - Headers to pass in the request.
   * @returns The paginated list of claims.
   * 
   * @example
   * To retrieve the list of claims:
   * 
   * ```ts
   * sdk.admin.claim.list()
   * .then(({ claims, count, limit, offset }) => {
   *   console.log(claims)
   * })
   * ```
   * 
   * To configure the pagination, pass the `limit` and `offset` query parameters.
   * 
   * For example, to retrieve only 10 items and skip 10 items:
   * 
   * ```ts
   * sdk.admin.claim.list({
   *   limit: 10,
   *   offset: 10
   * })
   * .then(({ claims, count, limit, offset }) => {
   *   console.log(claims)
   * })
   * ```
   * 
   * Using the `fields` query parameter, you can specify the fields and relations to retrieve
   * in each claim:
   * 
   * ```ts
   * sdk.admin.claim.list({
   *   fields: "id,*additional_items"
   * })
   * .then(({ claims, count, limit, offset }) => {
   *   console.log(claims)
   * })
   * ```
   * 
   * Learn more about the `fields` property in the [API reference](https://docs.medusajs.com/api/store#select-fields-and-relations).
   */
  async list(query?: HttpTypes.AdminClaimListParams, headers?: ClientHeaders) {
    return await this.client.fetch<HttpTypes.AdminClaimListResponse>(
      `/admin/claims`,
      {
        query,
        headers,
      }
    )
  }

  /**
   * This method retrieves a claim. It sends a request to the
   * [Get Claim](https://docs.medusajs.com/api/admin#claims_getclaimsid) API route.
   * 
   * @param id - The claim's ID.
   * @param query - Configure the fields to retrieve in the claim.
   * @param headers - Headers to pass in the request
   * @returns The claim's details.
   * 
   * @example
   * To retrieve a claim by its ID:
   * 
   * ```ts
   * sdk.admin.claim.retrieve("claim_123")
   * .then(({ claim }) => {
   *   console.log(claim)
   * })
   * ```
   * 
   * To specify the fields and relations to retrieve:
   * 
   * ```ts
   * sdk.admin.claim.retrieve("claim_123", {
   *   fields: "id,*additional_items"
   * })
   * .then(({ claim }) => {
   *   console.log(claim)
   * })
   * ```
   * 
   * Learn more about the `fields` property in the [API reference](https://docs.medusajs.com/api/store#select-fields-and-relations).
   */
  async retrieve(
    id: string,
    query?: HttpTypes.SelectParams,
    headers?: ClientHeaders
  ) {
    return await this.client.fetch<HttpTypes.AdminClaimResponse>(
      `/admin/claims/${id}`,
      {
        query,
        headers,
      }
    )
  }

  /**
   * This method creates a claim. It sends a request to the 
   * [Create Claim](https://docs.medusajs.com/api/admin#claims_postclaims) API route.
   * 
   * @param body - The claim's details.
   * @param query - Configure the fields to retrieve in the claim.
   * @param headers - Headers to pass in the request
   * @returns The claim and order's details.
   * 
   * @example
   * sdk.admin.claim.create({
   *   type: "refund",
   *   order_id: "order_123",
   * })
   * .then(({ claim }) => {
   *   console.log(claim)
   * })
   */
  async create(
    body: HttpTypes.AdminCreateClaim,
    query?: HttpTypes.SelectParams,
    headers?: ClientHeaders
  ) {
    return await this.client.fetch<HttpTypes.AdminClaimOrderResponse>(
      `/admin/claims`,
      {
        method: "POST",
        headers,
        body,
        query,
      }
    )
  }

  /**
   * This method cancels a claim. It sends a request to the
   * [Cancel Claim](https://docs.medusajs.com/api/admin#claims_postclaimsidcancel) API route.
   * 
   * @param id - The claim's ID.
   * @param query - Configure the fields to retrieve in the claim.
   * @param headers - Headers to pass in the request
   * @returns The claim's details.
   * 
   * @example
   * sdk.admin.claim.cancel("claim_123")
   * .then(({ claim }) => {
   *   console.log(claim)
   * })
   */
  async cancel(
    id: string,
    query?: HttpTypes.SelectParams,
    headers?: ClientHeaders
  ) {
    return await this.client.fetch<HttpTypes.AdminClaimResponse>(
      `/admin/claims/${id}/cancel`,
      {
        method: "POST",
        headers,
        query,
      }
    )
  }

  /**
   * This method adds items to the claim. It sends a request to the
   * [Add Items](https://docs.medusajs.com/api/admin#claims_postclaimsidclaimitems) API route.
   * 
   * @param id - The ID of the claim to add the items to.
   * @param body - The items' details.
   * @param query - Configure the fields to retrieve in the claim.
   * @param headers - Headers to pass in the request
   * @returns The claim's details with a preview of the order when the claim is applied.
   * 
   * @example
   * sdk.admin.claim.addItems("claim_123", {
   *   items: [
   *     {
   *       id: "orli_123",
   *       quantity: 1
   *     }
   *   ]
   * })
   * .then(({ claim }) => {
   *   console.log(claim)
   * })
   */
  async addItems(
    id: string,
    body: HttpTypes.AdminAddClaimItems,
    query?: HttpTypes.SelectParams,
    headers?: ClientHeaders
  ) {
    return await this.client.fetch<HttpTypes.AdminClaimPreviewResponse>(
      `/admin/claims/${id}/claim-items`,
      {
        method: "POST",
        headers,
        body,
        query,
      }
    )
  }

  /**
   * This method updates a claim item by the ID of the item's `WRITE_OFF_ITEM` action. It
   * sends a request to the [Update Claim Item](https://docs.medusajs.com/api/admin#claims_postclaimsidclaimitemsaction_id) API route.
   * 
   * Every item has an `actions` property, whose value is an array of actions. 
   * You can check the action's name using its `action` property, and use the value of the `id` property.
   * 
   * @param id - The claim's ID.
   * @param actionId - The id of the order item's `WRITE_OFF_ITEM` action.
   * @param body - The details to update.
   * @param query - Configure the fields to retrieve in the claim.
   * @param headers - Headers to pass in the request
   * @returns The claim's details with a preview of the order when the claim is applied.
   * 
   * @example
   * sdk.admin.claim.updateItem(
   *   "claim_123", 
   *   "ordchact_123",
   *   {
   *     quantity: 1
   *   }
   *   )
   * .then(({ claim }) => {
   *   console.log(claim)
   * })
   */
  async updateItem(
    id: string,
    actionId: string,
    body: HttpTypes.AdminUpdateClaimItem,
    query?: HttpTypes.SelectParams,
    headers?: ClientHeaders
  ) {
    return await this.client.fetch<HttpTypes.AdminClaimPreviewResponse>(
      `/admin/claims/${id}/claim-items/${actionId}`,
      {
        method: "POST",
        headers,
        body,
        query,
      }
    )
  }

  /**
   * This method removes a claim item from a claim by the ID of the item's `WRITE_OFF_ITEM` action.
   * It sends a request to the [Remove Claim Item](https://docs.medusajs.com/api/admin#claims_deleteclaimsidclaimitemsaction_id)
   * API route.
   * 
   * Every item has an `actions` property, whose value is an array of actions. 
   * You can check the action's name using its `action` property, and use the value of the `id` property.
   * 
   * @param id - The claim's ID.
   * @param actionId - The id of the order item's `WRITE_OFF_ITEM` action.
   * @param query - Configure the fields to retrieve in the claim.
   * @param headers - Headers to pass in the request
   * @returns The claim's details with a preview of the order when the claim is applied.
   * 
   * @example
   * sdk.admin.claim.removeItem(
   *   "claim_123", 
   *   "ordchact_123",
   *   )
   * .then(({ claim }) => {
   *   console.log(claim)
   * })
   */
  async removeItem(
    id: string,
    actionId: string,
    query?: HttpTypes.SelectParams,
    headers?: ClientHeaders
  ) {
    return await this.client.fetch<HttpTypes.AdminClaimPreviewResponse>(
      `/admin/claims/${id}/claim-items/${actionId}`,
      {
        method: "DELETE",
        headers,
        query,
      }
    )
  }

  /**
   * This method adds inbound (or return) items to the claim. These inbound items will have a `RETURN_ITEM` action.
   * 
   * This method sends a request to the [Add Inbound Items](https://docs.medusajs.com/api/admin#claims_postclaimsidinbounditems)
   * API route.
   * 
   * @param id - The ID of the claim to add the inbound items to.
   * @param body - The inbound items' details.
   * @param query - Configure the fields to retrieve in the return.
   * @param headers - Headers to pass in the request
   * @returns The details of the return associated with the claim, with a preview of the order when the claim is applied.
   * 
   * @example
   * sdk.admin.claim.addInboundItems(
   *   "claim_123", 
   *   {
   *     items: [
   *       {
   *         id: "orli_123",
   *         quantity: 1
   *       }
   *     ]
   *   },
   *   )
   * .then(({ return: returnData }) => {
   *   console.log(returnData)
   * })
   */
  async addInboundItems(
    id: string,
    body: HttpTypes.AdminAddClaimInboundItems,
    query?: HttpTypes.SelectParams,
    headers?: ClientHeaders
  ) {
    return await this.client.fetch<HttpTypes.AdminClaimReturnPreviewResponse>(
      `/admin/claims/${id}/inbound/items`,
      {
        method: "POST",
        headers,
        body,
        query,
      }
    )
  }

  /**
   * This method updates an inbound (or return) item of a claim using the ID of the item's `RETURN_ITEM` action.
   * It sends a request to the [Update Inbound Item](https://docs.medusajs.com/api/admin#claims_postclaimsidinbounditemsaction_id)
   * API route.
   * 
   * Every item has an `actions` property, whose value is an array of actions. 
   * You can check the action's name using its `action` property, and use the value of the `id` property.
   * 
   * @param id - The claim's ID.
   * @param actionId - The id of the return item's `RETURN_ITEM` action.
   * @param body - The details to update in the inbound item.
   * @param query - Configure the fields to retrieve in the return.
   * @param headers - Headers to pass in the request
   * @returns The details of the return associated wth the claim, with a preview of the order when the claim is applied.
   * 
   * @example
   * sdk.admin.claim.updateInboundItem(
   *   "claim_123", 
   *   "ordchact_123",
   *   {
   *     quantity: 1
   *   },
   *   )
   * .then(({ return: returnData }) => {
   *   console.log(returnData)
   * })
   */
  async updateInboundItem(
    id: string,
    actionId: string,
    body: HttpTypes.AdminUpdateClaimInboundItem,
    query?: HttpTypes.SelectParams,
    headers?: ClientHeaders
  ) {
    return await this.client.fetch<HttpTypes.AdminClaimReturnPreviewResponse>(
      `/admin/claims/${id}/inbound/items/${actionId}`,
      {
        method: "POST",
        headers,
        body,
        query,
      }
    )
  }

  /**
   * This method removes an inbound (or return) item from a claim using the ID of the item's `RETURN_ITEM` action.
   * It sends a request to the [Remove Inbound Item](https://docs.medusajs.com/api/admin#claims_deleteclaimsidinbounditemsaction_id)
   * API route.
   * 
   * Every item has an `actions` property, whose value is an array of actions. 
   * You can check the action's name using its `action` property, and use the value of the `id` property.
   * 
   * @param id - The claim's ID.
   * @param actionId - The ID of the return item's `RETURN_ITEM` action.
   * @param query - Configure the fields to retrieve in the return.
   * @param headers - Headers to pass in the request
   * @returns The details of the return associated wth the claim, with a preview of the order when the claim is applied.
   * 
   * @example
   * sdk.admin.claim.removeInboundItem(
   *   "claim_123", 
   *   "ordchact_123",
   *   )
   * .then(({ return: returnData }) => {
   *   console.log(returnData)
   * })
   */
  async removeInboundItem(
    id: string,
    actionId: string,
    query?: HttpTypes.SelectParams,
    headers?: ClientHeaders
  ) {
    return await this.client.fetch<HttpTypes.AdminClaimReturnPreviewResponse>(
      `/admin/claims/${id}/inbound/items/${actionId}`,
      {
        method: "DELETE",
        headers,
        query,
      }
    )
  }

  /**
   * This method adds an inbound (or return) shipping method to a claim. 
   * The inbound shipping method will have a `SHIPPING_ADD` action.
   * 
   * This method sends a request to the [Add Inbound Shipping](https://docs.medusajs.com/api/admin#claims_postclaimsidinboundshippingmethod)
   * API route.
   * 
   * @param id - The claim's ID.
   * @param body - The shipping method's details.
   * @param query - Configure the fields to retrieve in the return.
   * @param headers - Headers to pass in the request
   * @returns The details of the return associated wth the claim, with a preview of the order when the claim is applied.
   * 
   * @example
   * sdk.admin.claim.addInboundShipping(
   *   "claim_123", 
   *   {
   *     shipping_option_id: "so_123",
   *     custom_amount: 10
   *   },
   *   )
   * .then(({ return: returnData }) => {
   *   console.log(returnData)
   * })
   */
  async addInboundShipping(
    id: string,
    body: HttpTypes.AdminClaimAddInboundShipping,
    query?: HttpTypes.SelectParams,
    headers?: ClientHeaders
  ) {
    return await this.client.fetch<HttpTypes.AdminClaimReturnPreviewResponse>(
      `/admin/claims/${id}/inbound/shipping-method`,
      {
        method: "POST",
        headers,
        body,
        query,
      }
    )
  }

  /**
   * This method updates a shipping method for returning items in the claim using the ID of the method's `SHIPPING_ADD` action.
   * It sends a request to the [Update Inbound Shipping](https://docs.medusajs.com/api/admin#claims_postclaimsidinboundshippingmethodaction_id)
   * API route.
   * 
   * Every shipping method has an `actions` property, whose value is an array of actions. 
   * You can check the action's name using its `action` property, and use the value of the `id` property.
   * 
   * @param id - The claim's ID.
   * @param actionId - The id of the shipping method's `SHIPPING_ADD` action.
   * @param body - The details to update in the shipping method
   * @param query - Configure the fields to retrieve in the claim.
   * @param headers - Headers to pass in the request
   * @returns The details of the claim, with a preview of the order when the claim is applied.
   * 
   * @example
   * sdk.admin.claim.updateInboundShipping(
   *   "claim_123", 
   *   "ordchact_123",
   *   {
   *     custom_amount: 10
   *   },
   *   )
   * .then(({ claim }) => {
   *   console.log(claim)
   * })
   */
  async updateInboundShipping(
    id: string,
    actionId: string,
    body: HttpTypes.AdminClaimUpdateInboundShipping,
    query?: HttpTypes.SelectParams,
    headers?: ClientHeaders
  ) {
    return await this.client.fetch<HttpTypes.AdminClaimPreviewResponse>(
      `/admin/claims/${id}/inbound/shipping-method/${actionId}`,
      {
        method: "POST",
        headers,
        body,
        query,
      }
    )
  }

  /**
   * This method deletes a shipping method for returning items in the claim using the ID of the method's `SHIPPING_ADD` action.
   * It sends a request to the [Remove Inbound Shipping](https://docs.medusajs.com/api/admin#claims_deleteclaimsidinboundshippingmethodaction_id)
   * API route.
   * 
   * Every shipping method has an `actions` property, whose value is an array of actions. 
   * You can check the action's name using its `action` property, and use the value of the `id` property.
   * 
   * @param id - The claim's ID.
   * @param actionId - The id of the shipping method's `SHIPPING_ADD` action.
   * @param query - Configure the fields to retrieve in the return.
   * @param headers - Headers to pass in the request
   * @returns The details of the return associated wth the claim, with a preview of the order when the claim is applied.
   * 
   * @example
   * sdk.admin.claim.deleteInboundShipping(
   *   "claim_123", 
   *   "ordchact_123",
   *   )
   * .then(({ return: returnData }) => {
   *   console.log(returnData)
   * })
   */
  async deleteInboundShipping(
    id: string,
    actionId: string,
    query?: HttpTypes.SelectParams,
    headers?: ClientHeaders
  ) {
    return await this.client.fetch<HttpTypes.AdminClaimReturnPreviewResponse>(
      `/admin/claims/${id}/inbound/shipping-method/${actionId}`,
      {
        method: "DELETE",
        headers,
        query,
      }
    )
  }

  /**
   * This method adds outbound (or new) items to a claim. These outbound items will have an `ITEM_ADD` action.
   * It sends a request to the [Add Outbound Items](https://docs.medusajs.com/api/admin#claims_postclaimsidoutbounditems)
   * API route.
   * 
   * @param id - The ID of the claim to add the outbound items to.
   * @param body - The items' details.
   * @param query - Configure the fields to retrieve in the claim.
   * @param headers - Headers to pass in the request
   * @returns The details of the claim, with a preview of the order when the claim is applied.
   * 
   * @example
   * sdk.admin.claim.addOutboundItems(
   *   "claim_123", 
   *   {
   *     items: [{
   *       id: "orli_123",
   *       quantity: 1
   *     }]
   *   },
   *   )
   * .then(({ claim }) => {
   *   console.log(claim)
   * })
   */
  async addOutboundItems(
    id: string,
    body: HttpTypes.AdminAddClaimOutboundItems,
    query?: HttpTypes.SelectParams,
    headers?: ClientHeaders
  ) {
    return await this.client.fetch<HttpTypes.AdminClaimPreviewResponse>(
      `/admin/claims/${id}/outbound/items`,
      {
        method: "POST",
        headers,
        body,
        query,
      }
    )
  }

  /**
   * This method updates an outbound (or new) item of a claim using the ID of the item's `ITEM_ADD` action.
   * It sends a request to the [Update Outbound Item](https://docs.medusajs.com/api/admin#claims_postclaimsidoutbounditemsaction_id)
   * API route.
   * 
   * Every item has an `actions` property, whose value is an array of actions. 
   * You can check the action's name using its `action` property, and use the value of the `id` property.
   * 
   * @param id - The claim's ID.
   * @param actionId - The id of the new claim item's `ITEM_ADD` action.
   * @param body - The item's details.
   * @param query - Configure the fields to retrieve in the claim.
   * @param headers - Headers to pass in the request
   * @returns The details of the claim, with a preview of the order when the claim is applied.
   * 
   * @example
   * sdk.admin.claim.updateOutboundItem(
   *   "claim_123", 
   *   "ordchact_123",
   *   {
   *     quantity: 1
   *   },
   *   )
   * .then(({ claim }) => {
   *   console.log(claim)
   * })
   */
  async updateOutboundItem(
    id: string,
    actionId: string,
    body: HttpTypes.AdminUpdateClaimOutboundItem,
    query?: HttpTypes.SelectParams,
    headers?: ClientHeaders
  ) {
    return await this.client.fetch<HttpTypes.AdminClaimPreviewResponse>(
      `/admin/claims/${id}/outbound/items/${actionId}`,
      {
        method: "POST",
        headers,
        body,
        query,
      }
    )
  }

  /**
   * This method removes an outbound (or new) item from a claim using the ID of the item's `ITEM_ADD` action.
   * It sends a request to the [Remove Outbound Item](https://docs.medusajs.com/api/admin#claims_deleteclaimsidoutbounditemsaction_id)
   * API route.
   * 
   * Every item has an `actions` property, whose value is an array of actions. 
   * You can check the action's name using its `action` property, and use the value of the `id` property.
   * 
   * @param id - The claim's ID.
   * @param actionId - The id of the new claim item's `ITEM_ADD` action.
   * @param query - Configure the fields to retrieve in the claim.
   * @param headers - Headers to pass in the request
   * @returns The details of the claim, with a preview of the order when the claim is applied.
   * 
   * @example
   * sdk.admin.claim.removeOutboundItem(
   *   "claim_123", 
   *   "ordchact_123",
   * )
   * .then(({ claim }) => {
   *   console.log(claim)
   * })
   */
  async removeOutboundItem(
    id: string,
    actionId: string,
    query?: HttpTypes.SelectParams,
    headers?: ClientHeaders
  ) {
    return await this.client.fetch<HttpTypes.AdminClaimPreviewResponse>(
      `/admin/claims/${id}/outbound/items/${actionId}`,
      {
        method: "DELETE",
        headers,
        query,
      }
    )
  }

  /**
   * This method adds outbound an outbound shipping method to a claim. 
   * The outbound shipping method will have a `SHIPPING_ADD` action.
   * 
   * This method sends a request to the 
   * [Add Outbound Shipping](https://docs.medusajs.com/api/admin#claims_postclaimsidoutboundshippingmethod)
   * API route.
   * 
   * @param id - The claim's ID.
   * @param body - The shipping method's details.
   * @param query - Configure the fields to retrieve in the claim.
   * @param headers - Headers to pass in the request
   * @returns The details of the claim, with a preview of the order when the claim is applied.
   * 
   * @example
   *    * sdk.admin.claim.addOutboundShipping(
   *   "claim_123", 
   *   {
   *     shipping_option_id: "so_123",
   *     custom_amount: 10
   *   },
   * )
   * .then(({ claim }) => {
   *   console.log(claim)
   * })
   */
  async addOutboundShipping(
    id: string,
    body: HttpTypes.AdminClaimAddOutboundShipping,
    query?: HttpTypes.SelectParams,
    headers?: ClientHeaders
  ) {
    return await this.client.fetch<HttpTypes.AdminClaimPreviewResponse>(
      `/admin/claims/${id}/outbound/shipping-method`,
      {
        method: "POST",
        headers,
        body,
        query,
      }
    )
  }

  /**
   * This method updates the shipping method for delivering outbound items in a claim using the ID of the method's `SHIPPING_ADD` action.
   * It sends a request to the [Update Outbound Shipping](https://docs.medusajs.com/api/admin#claims_postclaimsidoutboundshippingmethodaction_id)
   * API route.
   * 
   * Every shipping method has an `actions` property, whose value is an array of actions. 
   * You can check the action's name using its `action` property, and use the value of the `id` property.
   * 
   * @param id - The claim's ID.
   * @param actionId - The id of the shipping method's `SHIPPING_ADD` action.
   * @param body - The shipping method's details.
   * @param query - Configure the fields to retrieve in the claim.
   * @param headers - Headers to pass in the request
   * @returns The details of the claim, with a preview of the order when the claim is applied.
   * 
   * @example
   * sdk.admin.claim.updateOutboundShipping(
   *   "claim_123", 
   *   "ordchact_123",
   *   {
   *     custom_amount: 10
   *   },
   * )
   * .then(({ claim }) => {
   *   console.log(claim)
   * })
   */
  async updateOutboundShipping(
    id: string,
    actionId: string,
    body: HttpTypes.AdminClaimUpdateOutboundShipping,
    query?: HttpTypes.SelectParams,
    headers?: ClientHeaders
  ) {
    return await this.client.fetch<HttpTypes.AdminClaimPreviewResponse>(
      `/admin/claims/${id}/outbound/shipping-method/${actionId}`,
      {
        method: "POST",
        headers,
        body,
        query,
      }
    )
  }

  /**
   * This method deletes the shipping method for delivering outbound items in the claim using the ID of the method's `SHIPPING_ADD` action.
   * 
   * Every shipping method has an `actions` property, whose value is an array of actions. 
   * You can check the action's name using its `action` property, and use the value of the `id` property.
   * 
   * @param id - The claim's ID.
   * @param actionId - The id of the shipping method's `SHIPPING_ADD` action.
   * @param query - Configure the fields to retrieve in the claim.
   * @param headers - Headers to pass in the request
   * @returns The details of the claim, with a preview of the order when the claim is applied.
   * 
   * @example
   * sdk.admin.claim.deleteOutboundShipping(
   *   "claim_123", 
   *   "ordchact_123",
   * )
   * .then(({ claim }) => {
   *   console.log(claim)
   * })
   */
  async deleteOutboundShipping(
    id: string,
    actionId: string,
    query?: HttpTypes.SelectParams,
    headers?: ClientHeaders
  ) {
    return await this.client.fetch<HttpTypes.AdminClaimPreviewResponse>(
      `/admin/claims/${id}/outbound/shipping-method/${actionId}`,
      {
        method: "DELETE",
        headers,
        query,
      }
    )
  }

  /**
   * This method confirms a claim request, applying its changes on the associated order.
   * It sends a request to the [Confirm Claim Request](https://docs.medusajs.com/api/admin#claims_postclaimsidrequest)
   * API route.
   * 
   * @param id - The claim's ID.
   * @param body - The confirmation details.
   * @param query - Configure the fields to retrieve in the claim.
   * @param headers - Headers to pass in the request
   * @returns The details of the claim and its associated return, with a preview of the order when the claim is applied.
   * 
   * @example
   * sdk.admin.claim.request(
   *   "claim_123", 
   *   {},
   * )
   * .then(({ claim }) => {
   *   console.log(claim)
   * })
   */
  async request(
    id: string,
    body: HttpTypes.AdminRequestClaim,
    query?: HttpTypes.SelectParams,
    headers?: ClientHeaders
  ) {
    return await this.client.fetch<HttpTypes.AdminClaimRequestResponse>(
      `/admin/claims/${id}/request`,
      {
        method: "POST",
        headers,
        body,
        query,
      }
    )
  }

  /**
   * This method cancels a requested claim. It sends a request to the
   * [Cancel Claim Request](https://docs.medusajs.com/api/admin#claims_deleteclaimsidrequest)
   * API route.
   * 
   * @param id - The claim's ID.
   * @param query - Configure the fields to retrieve in the claim.
   * @param headers - Headers to pass in the request
   * @returns The cancelation's details.
   * 
   * @example
   * sdk.admin.claim.cancelRequest(
   *   "claim_123", 
   * )
   * .then(({ deleted }) => {
   *   console.log(deleted)
   * })
   */
  async cancelRequest(
    id: string,
    query?: HttpTypes.SelectParams,
    headers?: ClientHeaders
  ) {
    return await this.client.fetch<HttpTypes.AdminClaimDeleteResponse>(
      `/admin/claims/${id}/request`,
      {
        method: "DELETE",
        headers,
        query,
      }
    )
  }
}

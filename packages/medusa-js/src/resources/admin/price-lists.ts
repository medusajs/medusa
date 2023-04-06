import {
  AdminPostPriceListPricesPricesReq,
  AdminPostPriceListsPriceListPriceListReq,
  AdminPostPriceListsPriceListReq,
  AdminPriceListDeleteRes,
  AdminPriceListRes,
  AdminGetPriceListPaginationParams,
  AdminPriceListsListRes,
  AdminDeletePriceListPricesPricesReq,
  AdminPriceListDeleteBatchRes,
  AdminGetPriceListsPriceListProductsParams,
} from "@medusajs/medusa"
import qs from "qs"
import { ResponsePromise } from "../../typings"
import BaseResource from "../base"

class AdminPriceListResource extends BaseResource {
  create(
    payload: AdminPostPriceListsPriceListReq,
    customHeaders: Record<string, any> = {}
  ): ResponsePromise<AdminPriceListRes> {
    const path = `/admin/price-lists`
    return this.client.request("POST", path, payload, {}, customHeaders)
  }

  update(
    id: string,
    payload: AdminPostPriceListsPriceListPriceListReq,
    customHeaders: Record<string, any> = {}
  ): ResponsePromise<AdminPriceListRes> {
    const path = `/admin/price-lists/${id}`
    return this.client.request("POST", path, payload, {}, customHeaders)
  }

  delete(
    id: string,
    customHeaders: Record<string, any> = {}
  ): ResponsePromise<AdminPriceListDeleteRes> {
    const path = `/admin/price-lists/${id}`
    return this.client.request("DELETE", path, undefined, {}, customHeaders)
  }

  retrieve(
    id: string,
    customHeaders: Record<string, any> = {}
  ): ResponsePromise<AdminPriceListRes> {
    const path = `/admin/price-lists/${id}`
    return this.client.request("GET", path, undefined, {}, customHeaders)
  }

  list(
    query?: AdminGetPriceListPaginationParams,
    customHeaders: Record<string, any> = {}
  ): ResponsePromise<AdminPriceListsListRes> {
    let path = `/admin/price-lists/`

    if (query) {
      const queryString = qs.stringify(query)
      path = `/admin/price-lists?${queryString}`
    }

    return this.client.request("GET", path, undefined, {}, customHeaders)
  }

  listProducts(
    id: string,
    query?: AdminGetPriceListsPriceListProductsParams,
    customHeaders: Record<string, any> = {}
  ): ResponsePromise<any> {
    let path = `/admin/price-lists/${id}/products`

    if (query) {
      const queryString = qs.stringify(query)
      path = `/admin/price-lists/${id}/products?${queryString}`
    }

    return this.client.request("GET", path, undefined, {}, customHeaders)
  }

  addPrices(
    id: string,
    payload: AdminPostPriceListPricesPricesReq,
    customHeaders: Record<string, any> = {}
  ): ResponsePromise<AdminPriceListRes> {
    const path = `/admin/price-lists/${id}/prices/batch`
    return this.client.request("POST", path, payload, {}, customHeaders)
  }

  deletePrices(
    id: string,
    payload: AdminDeletePriceListPricesPricesReq,
    customHeaders: Record<string, any> = {}
  ): ResponsePromise<AdminPriceListDeleteBatchRes> {
    const path = `/admin/price-lists/${id}/prices/batch`
    return this.client.request("DELETE", path, payload, {}, customHeaders)
  }

  deleteProductPrices(
    priceListId: string,
    productId: string,
    customHeaders: Record<string, any> = {}
  ): ResponsePromise<AdminPriceListDeleteBatchRes> {
    const path = `/admin/price-lists/${priceListId}/products/${productId}/prices`
    return this.client.request("DELETE", path, undefined, {}, customHeaders)
  }

  deleteVariantPrices(
    priceListId: string,
    variantId: string,
    customHeaders: Record<string, any> = {}
  ): ResponsePromise<AdminPriceListDeleteBatchRes> {
    const path = `/admin/price-lists/${priceListId}/variants/${variantId}/prices`
    return this.client.request("DELETE", path, undefined, {}, customHeaders)
  }
}

export default AdminPriceListResource

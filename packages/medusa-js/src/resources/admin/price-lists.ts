import {
  AdminPostPriceListPricesPricesReq,
  AdminPostPriceListsPriceListPriceListReq,
  AdminPostPriceListsPriceListReq,
  AdminPriceListDeleteRes,
  AdminPriceListRes,
  AdminGetPriceListPaginationParams,
  AdminPriceListsListRes,
  AdminDeletePriceListPricesPricesReq,
} from "@medusajs/medusa"
import qs from "qs"
import { ResponsePromise } from "../../typings"
import BaseResource from "../base"

class AdminPriceListResource extends BaseResource {
  // list

  // batch delete

  // batch add
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
    return this.client.request("DELETE", path, {}, {}, customHeaders)
  }

  retrieve(
    id: string,
    customHeaders: Record<string, any> = {}
  ): ResponsePromise<AdminPriceListRes> {
    const path = `/admin/price-lists/${id}`
    return this.client.request("GET", path, {}, {}, customHeaders)
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

    return this.client.request("GET", path, {}, {}, customHeaders)
  }

  batchAddPrices(
    id: string,
    payload: AdminPostPriceListPricesPricesReq,
    customHeaders: Record<string, any> = {}
  ): ResponsePromise<AdminPriceListRes> {
    const path = `/admin/price-lists/${id}/batch`
    return this.client.request("POST", path, payload, {}, customHeaders)
  }

  batchDeletePrices(
    id: string,
    payload: AdminDeletePriceListPricesPricesReq,
    customHeaders: Record<string, any> = {}
  ): ResponsePromise<AdminPriceListRes> {
    const path = `/admin/price-lists/${id}/batch`
    return this.client.request("DELETE", path, payload, {}, customHeaders)
  }
}

export default AdminPriceListResource

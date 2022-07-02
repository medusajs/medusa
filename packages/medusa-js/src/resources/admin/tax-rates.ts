import {
  AdminTaxRatesRes,
  AdminTaxRatesListRes,
  AdminTaxRatesDeleteRes,
  AdminGetTaxRatesParams,
  AdminGetTaxRatesTaxRateParams,
  AdminDeleteTaxRatesTaxRateProductsReq,
  AdminDeleteTaxRatesTaxRateProductsParams,
  AdminDeleteTaxRatesTaxRateProductTypesReq,
  AdminDeleteTaxRatesTaxRateProductTypesParams,
  AdminDeleteTaxRatesTaxRateShippingOptionsReq,
  AdminDeleteTaxRatesTaxRateShippingOptionsParams,
  AdminPostTaxRatesReq,
  AdminPostTaxRatesTaxRateReq,
  AdminPostTaxRatesTaxRateProductsReq,
  AdminPostTaxRatesTaxRateProductTypesReq,
  AdminPostTaxRatesTaxRateShippingOptionsReq,
} from "@medusajs/medusa"
import qs from "qs"
import { ResponsePromise } from "../../typings"
import BaseResource from "../base"

class AdminTaxRatesResource extends BaseResource {
  retrieve(
    id: string,
    query?: AdminGetTaxRatesTaxRateParams,
    customHeaders: Record<string, any> = {}
  ): ResponsePromise<AdminTaxRatesRes> {
    let path = `/admin/tax-rates/${id}`

    if (query) {
      const queryString = qs.stringify(query)
      path = `/admin/tax-rates/${id}?${queryString}`
    }

    return this.client.request("GET", path, {}, {}, customHeaders)
  }

  list(
    query?: AdminGetTaxRatesParams,
    customHeaders: Record<string, any> = {}
  ): ResponsePromise<AdminTaxRatesListRes> {
    let path = `/admin/tax-rates`

    if (query) {
      const queryString = qs.stringify(query)
      path = `/admin/tax-rates?${queryString}`
    }

    return this.client.request("GET", path, {}, {}, customHeaders)
  }

  create(
    payload: AdminPostTaxRatesReq,
    query?: AdminGetTaxRatesTaxRateParams,
    customHeaders: Record<string, any> = {}
  ): ResponsePromise<AdminTaxRatesRes> {
    let path = `/admin/tax-rates`

    if (query) {
      const queryString = qs.stringify(query)
      path = `/admin/tax-rates?${queryString}`
    }

    return this.client.request("POST", path, payload, {}, customHeaders)
  }

  update(
    id: string,
    payload: AdminPostTaxRatesTaxRateReq,
    query?: AdminGetTaxRatesTaxRateParams,
    customHeaders: Record<string, any> = {}
  ): ResponsePromise<AdminTaxRatesRes> {
    let path = `/admin/tax-rates/${id}`

    if (query) {
      const queryString = qs.stringify(query)
      path = `/admin/tax-rates/${id}?${queryString}`
    }

    return this.client.request("POST", path, payload, {}, customHeaders)
  }

  addProducts(
    id: string,
    payload: AdminPostTaxRatesTaxRateProductsReq,
    query?: AdminGetTaxRatesTaxRateParams,
    customHeaders: Record<string, any> = {}
  ): ResponsePromise<AdminTaxRatesRes> {
    let path = `/admin/tax-rates/${id}/products/batch`

    if (query) {
      const queryString = qs.stringify(query)
      path = `/admin/tax-rates/${id}/products/batch?${queryString}`
    }

    return this.client.request("POST", path, payload, {}, customHeaders)
  }

  addProductTypes(
    id: string,
    payload: AdminPostTaxRatesTaxRateProductTypesReq,
    query?: AdminGetTaxRatesTaxRateParams,
    customHeaders: Record<string, any> = {}
  ): ResponsePromise<AdminTaxRatesRes> {
    let path = `/admin/tax-rates/${id}/product-types/batch`

    if (query) {
      const queryString = qs.stringify(query)
      path = `/admin/tax-rates/${id}/product-types/batch?${queryString}`
    }

    return this.client.request("POST", path, payload, {}, customHeaders)
  }

  addShippingOptions(
    id: string,
    payload: AdminPostTaxRatesTaxRateShippingOptionsReq,
    query?: AdminGetTaxRatesTaxRateParams,
    customHeaders: Record<string, any> = {}
  ): ResponsePromise<AdminTaxRatesRes> {
    let path = `/admin/tax-rates/${id}/shipping-options/batch`

    if (query) {
      const queryString = qs.stringify(query)
      path = `/admin/tax-rates/${id}/shipping-options/batch?${queryString}`
    }

    return this.client.request("POST", path, payload, {}, customHeaders)
  }

  removeProducts(
    id: string,
    payload: AdminDeleteTaxRatesTaxRateProductsReq,
    query?: AdminDeleteTaxRatesTaxRateProductsParams,
    customHeaders: Record<string, any> = {}
  ): ResponsePromise<AdminTaxRatesRes> {
    let path = `/admin/tax-rates/${id}/products/batch`

    if (query) {
      const queryString = qs.stringify(query)
      path = `/admin/tax-rates/${id}/products/batch?${queryString}`
    }

    return this.client.request("DELETE", path, payload, {}, customHeaders)
  }

  removeProductTypes(
    id: string,
    payload: AdminDeleteTaxRatesTaxRateProductTypesReq,
    query?: AdminDeleteTaxRatesTaxRateProductTypesParams,
    customHeaders: Record<string, any> = {}
  ): ResponsePromise<AdminTaxRatesRes> {
    let path = `/admin/tax-rates/${id}/product-types/batch`

    if (query) {
      const queryString = qs.stringify(query)
      path = `/admin/tax-rates/${id}/product-types/batch?${queryString}`
    }

    return this.client.request("DELETE", path, payload, {}, customHeaders)
  }

  removeShippingOptions(
    id: string,
    payload: AdminDeleteTaxRatesTaxRateShippingOptionsReq,
    query?: AdminDeleteTaxRatesTaxRateShippingOptionsParams,
    customHeaders: Record<string, any> = {}
  ): ResponsePromise<AdminTaxRatesRes> {
    let path = `/admin/tax-rates/${id}/shipping-options/batch`

    if (query) {
      const queryString = qs.stringify(query)
      path = `/admin/tax-rates/${id}/shipping-options/batch?${queryString}`
    }

    return this.client.request("DELETE", path, payload, {}, customHeaders)
  }

  delete(
    id: string,
    customHeaders: Record<string, any> = {}
  ): ResponsePromise<AdminTaxRatesDeleteRes> {
    const path = `/admin/tax-rates/${id}`
    return this.client.request("DELETE", path, {}, {}, customHeaders)
  }
}

export default AdminTaxRatesResource

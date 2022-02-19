import {
  AdminTaxRatesRes,
  AdminTaxRatesListRes,
  AdminTaxRatesDeleteRes,
  AdminGetTaxRatesParams,
  AdminGetTaxRatesTaxRateParams,
  AdminPostTaxRatesReq,
  AdminPostTaxRatesTaxRateReq,
  AdminPostTaxRatesTaxRateProductsReq,
  AdminPostTaxRatesTaxRateProductTypesReq,
  AdminPostTaxRatesTaxRateShippingOptionsReq,
} from "@medusajs/medusa"
import { ResponsePromise } from "../../typings"
import BaseResource from "../base"

class AdminSwapsResource extends BaseResource {
  retrieve(
    id: string,
    query?: AdminGetTaxRatesTaxRateParams
  ): ResponsePromise<AdminTaxRatesRes> {
    const path = `/admin/tax-rates/${id}`
    return this.client.request("GET", path)
  }

  list(query?: AdminGetTaxRatesParams): ResponsePromise<AdminTaxRatesListRes> {
    let path = `/admin/tax-rates`

    if (query) {
      const queryString = Object.entries(query).map(([key, value]) => {
        return `${key}=${value}`
      })

      path = `/admin/tax-rates?${queryString.join("&")}`
    }

    return this.client.request("GET", path)
  }

  create(
    payload: AdminPostTaxRatesReq,
    query?: AdminGetTaxRatesTaxRateParams
  ): ResponsePromise<AdminTaxRatesRes> {
    let path = `/admin/tax-rates`

    if (query) {
      const queryString = Object.entries(query).map(([key, value]) => {
        return `${key}=${value}`
      })

      path = `/admin/tax-rates?${queryString.join("&")}`
    }

    return this.client.request("POST", path, payload)
  }

  update(
    id: string,
    payload: AdminPostTaxRatesTaxRateReq,
    query?: AdminGetTaxRatesTaxRateParams
  ): ResponsePromise<AdminTaxRatesRes> {
    let path = `/admin/tax-rates/${id}`

    if (query) {
      const queryString = Object.entries(query).map(([key, value]) => {
        return `${key}=${value}`
      })

      path = `/admin/tax-rates/${id}?${queryString.join("&")}`
    }

    return this.client.request("POST", path, payload)
  }

  addProducts(
    id: string,
    payload: AdminPostTaxRatesTaxRateProductsReq,
    query?: AdminGetTaxRatesTaxRateParams
  ): ResponsePromise<AdminTaxRatesRes> {
    let path = `/admin/tax-rates/${id}/products/batch`

    if (query) {
      const queryString = Object.entries(query).map(([key, value]) => {
        return `${key}=${value}`
      })

      path = `/admin/tax-rates/${id}/products/batch?${queryString.join("&")}`
    }

    return this.client.request("POST", path, payload)
  }

  addProductTypes(
    id: string,
    payload: AdminPostTaxRatesTaxRateProductTypesReq,
    query?: AdminGetTaxRatesTaxRateParams
  ): ResponsePromise<AdminTaxRatesRes> {
    let path = `/admin/tax-rates/${id}/product-types`

    if (query) {
      const queryString = Object.entries(query).map(([key, value]) => {
        return `${key}=${value}`
      })

      path = `/admin/tax-rates/${id}/product-types?${queryString.join("&")}`
    }

    return this.client.request("POST", path, payload)
  }

  addShippingOptions(
    id: string,
    payload: AdminPostTaxRatesTaxRateShippingOptionsReq,
    query?: AdminGetTaxRatesTaxRateParams
  ): ResponsePromise<AdminTaxRatesRes> {
    let path = `/admin/tax-rates/${id}/shipping-options`

    if (query) {
      const queryString = Object.entries(query).map(([key, value]) => {
        return `${key}=${value}`
      })

      path = `/admin/tax-rates/${id}/shipping-options?${queryString.join("&")}`
    }

    return this.client.request("POST", path, payload)
  }

  delete(id: string): ResponsePromise<AdminTaxRatesDeleteRes> {
    const path = `/admin/tax-rates/${id}`
    return this.client.request("DELETE", path)
  }
}

export default AdminSwapsResource

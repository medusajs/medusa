import {
  AdminGetProductsParams,
  AdminPostProductsProductMetadataReq,
  AdminPostProductsProductOptionsOption,
  AdminPostProductsProductOptionsReq,
  AdminPostProductsProductReq,
  AdminPostProductsProductVariantsReq,
  AdminPostProductsProductVariantsVariantReq,
  AdminPostProductsReq,
  AdminProductsDeleteOptionRes,
  AdminProductsDeleteRes,
  AdminProductsDeleteVariantRes,
  AdminProductsListRes,
  AdminProductsListTagsRes,
  AdminProductsListTypesRes,
  AdminProductsRes,
} from "@medusajs/medusa"
import qs from "qs"
import { ResponsePromise } from "../../typings"
import BaseResource from "../base"

class AdminProductsResource extends BaseResource {
  create(payload: AdminPostProductsReq, customHeaders: object = {}): ResponsePromise<AdminProductsRes> {
    const path = `/admin/products/`
    return this.client.request("POST", path, payload, {}, customHeaders)
  }

  retrieve(id: string, customHeaders: object = {}): ResponsePromise<AdminProductsRes> {
    const path = `/admin/products/${id}`
    return this.client.request("GET", path, {}, {}, customHeaders)
  }

  update(
    id: string,
    payload: AdminPostProductsProductReq,
    customHeaders: object = {}): ResponsePromise<AdminProductsRes> {
    const path = `/admin/products/${id}`
    return this.client.request("POST", path, payload, {}, customHeaders)
  }

  delete(id: string, customHeaders: object = {}): ResponsePromise<AdminProductsDeleteRes> {
    const path = `/admin/products/${id}`
    return this.client.request("DELETE", path, {}, {}, customHeaders)
  }

  list(query?: AdminGetProductsParams, customHeaders: object = {}): ResponsePromise<AdminProductsListRes> {
    let path = `/admin/products`

    if (query) {
      const queryString = qs.stringify(query)
      path = `/admin/products?${queryString}`
    }

    return this.client.request("GET", path, {}, {}, customHeaders)
  }

  listTypes(customHeaders: object = {}): ResponsePromise<AdminProductsListTypesRes> {
    const path = `/admin/products/types`
    return this.client.request("GET", path, {}, {}, customHeaders)
  }

  listTags(customHeaders: object = {}): ResponsePromise<AdminProductsListTagsRes> {
    const path = `/admin/products/tag-usage`
    return this.client.request("GET", path, {}, {}, customHeaders)
  }

  setMetadata(
    id: string,
    payload: AdminPostProductsProductMetadataReq,
    customHeaders: object = {}
  ): ResponsePromise<AdminProductsRes> {
    const path = `/admin/products/${id}/metadata`
    return this.client.request("POST", path, payload, {}, customHeaders)
  }

  createVariant(
    id: string,
    payload: AdminPostProductsProductVariantsReq,
    customHeaders: object = {}
  ): ResponsePromise<AdminProductsRes> {
    const path = `/admin/products/${id}/variants`
    return this.client.request("POST", path, payload, {}, customHeaders)
  }

  updateVariant(
    id: string,
    variantId: string,
    payload: AdminPostProductsProductVariantsVariantReq,
    customHeaders: object = {}
  ): ResponsePromise<AdminProductsRes> {
    const path = `/admin/products/${id}/variants/${variantId}`
    return this.client.request("POST", path, payload, {}, customHeaders)
  }

  deleteVariant(
    id: string,
    variantId: string,
    customHeaders: object = {}
  ): ResponsePromise<AdminProductsDeleteVariantRes> {
    const path = `/admin/products/${id}/variants/${variantId}`
    return this.client.request("DELETE", path, {}, {}, customHeaders)
  }

  addOption(
    id: string,
    payload: AdminPostProductsProductOptionsReq,
    customHeaders: object = {}
  ): ResponsePromise<AdminProductsRes> {
    const path = `/admin/products/${id}/options`
    return this.client.request("POST", path, payload, {}, customHeaders)
  }

  updateOption(
    id: string,
    optionId: string,
    payload: AdminPostProductsProductOptionsOption,
    customHeaders: object = {}
  ): ResponsePromise<AdminProductsRes> {
    const path = `/admin/products/${id}/options/${optionId}`
    return this.client.request("POST", path, payload, {}, customHeaders)
  }

  deleteOption(
    id: string,
    optionId: string,
    customHeaders: object = {}
  ): ResponsePromise<AdminProductsDeleteOptionRes> {
    const path = `/admin/products/${id}/options/${optionId}`
    return this.client.request("DELETE", path, {}, {}, customHeaders)
  }
}

export default AdminProductsResource

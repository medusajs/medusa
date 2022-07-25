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
  create(
    payload: AdminPostProductsReq,
    customHeaders: Record<string, any> = {}
  ): ResponsePromise<AdminProductsRes> {
    const path = `/admin/products/`
    return this.client.request("POST", path, payload, {}, customHeaders)
  }

  retrieve(
    id: string,
    customHeaders: Record<string, any> = {}
  ): ResponsePromise<AdminProductsRes> {
    const path = `/admin/products/${id}`
    return this.client.request("GET", path, undefined, {}, customHeaders)
  }

  update(
    id: string,
    payload: AdminPostProductsProductReq,
    customHeaders: Record<string, any> = {}
  ): ResponsePromise<AdminProductsRes> {
    const path = `/admin/products/${id}`
    return this.client.request("POST", path, payload, {}, customHeaders)
  }

  delete(
    id: string,
    customHeaders: Record<string, any> = {}
  ): ResponsePromise<AdminProductsDeleteRes> {
    const path = `/admin/products/${id}`
    return this.client.request("DELETE", path, undefined, {}, customHeaders)
  }

  list(
    query?: AdminGetProductsParams,
    customHeaders: Record<string, any> = {}
  ): ResponsePromise<AdminProductsListRes> {
    let path = `/admin/products`

    if (query) {
      const queryString = qs.stringify(query)
      path = `/admin/products?${queryString}`
    }

    return this.client.request("GET", path, undefined, {}, customHeaders)
  }

  listTypes(
    customHeaders: Record<string, any> = {}
  ): ResponsePromise<AdminProductsListTypesRes> {
    const path = `/admin/products/types`
    return this.client.request("GET", path, undefined, {}, customHeaders)
  }

  listTags(
    customHeaders: Record<string, any> = {}
  ): ResponsePromise<AdminProductsListTagsRes> {
    const path = `/admin/products/tag-usage`
    return this.client.request("GET", path, undefined, {}, customHeaders)
  }

  setMetadata(
    id: string,
    payload: AdminPostProductsProductMetadataReq,
    customHeaders: Record<string, any> = {}
  ): ResponsePromise<AdminProductsRes> {
    const path = `/admin/products/${id}/metadata`
    return this.client.request("POST", path, payload, {}, customHeaders)
  }

  createVariant(
    id: string,
    payload: AdminPostProductsProductVariantsReq,
    customHeaders: Record<string, any> = {}
  ): ResponsePromise<AdminProductsRes> {
    const path = `/admin/products/${id}/variants`
    return this.client.request("POST", path, payload, {}, customHeaders)
  }

  updateVariant(
    id: string,
    variantId: string,
    payload: AdminPostProductsProductVariantsVariantReq,
    customHeaders: Record<string, any> = {}
  ): ResponsePromise<AdminProductsRes> {
    const path = `/admin/products/${id}/variants/${variantId}`
    return this.client.request("POST", path, payload, {}, customHeaders)
  }

  deleteVariant(
    id: string,
    variantId: string,
    customHeaders: Record<string, any> = {}
  ): ResponsePromise<AdminProductsDeleteVariantRes> {
    const path = `/admin/products/${id}/variants/${variantId}`
    return this.client.request("DELETE", path, undefined, {}, customHeaders)
  }

  addOption(
    id: string,
    payload: AdminPostProductsProductOptionsReq,
    customHeaders: Record<string, any> = {}
  ): ResponsePromise<AdminProductsRes> {
    const path = `/admin/products/${id}/options`
    return this.client.request("POST", path, payload, {}, customHeaders)
  }

  updateOption(
    id: string,
    optionId: string,
    payload: AdminPostProductsProductOptionsOption,
    customHeaders: Record<string, any> = {}
  ): ResponsePromise<AdminProductsRes> {
    const path = `/admin/products/${id}/options/${optionId}`
    return this.client.request("POST", path, payload, {}, customHeaders)
  }

  deleteOption(
    id: string,
    optionId: string,
    customHeaders: Record<string, any> = {}
  ): ResponsePromise<AdminProductsDeleteOptionRes> {
    const path = `/admin/products/${id}/options/${optionId}`
    return this.client.request("DELETE", path, undefined, {}, customHeaders)
  }
}

export default AdminProductsResource

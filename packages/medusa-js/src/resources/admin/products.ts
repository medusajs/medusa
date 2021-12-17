import {
  AdminGetNotesParams,
  AdminNotesDeleteRes,
  AdminNotesListRes,
  AdminNotesRes,
  AdminPostNotesNoteReq,
  AdminPostNotesReq,
  AdminPostProductsProductReq,
  AdminPostProductsReq,
  AdminProductsListTypesRes,
  AdminProductsListTagsRes,
  AdminProductsRes,
  AdminPostProductsProductVariantsReq,
  AdminPostProductsProductVariantsVariantReq,
  AdminPostProductsProductOptionsReq,
  AdminPostProductsProductOptionsOption,
  AdminProductsDeleteVariantRes,
  AdminProductsDeleteRes,
  AdminProductsDeleteOptionRes,
  AdminPostProductsProductMetadataReq,
  AdminGetProductsParams,
  AdminProductsListRes,
} from "@medusajs/medusa"
import { ResponsePromise } from "../../typings"
import BaseResource from "../base"

class AdminProductsResource extends BaseResource {
  create(payload: AdminPostProductsReq): ResponsePromise<AdminProductsRes> {
    const path = `/admin/products/`
    return this.client.request("POST", path, payload)
  }

  retrieve(id: string): ResponsePromise<AdminProductsRes> {
    const path = `/admin/products/${id}`
    return this.client.request("GET", path)
  }

  update(
    id: string,
    payload: AdminPostProductsProductReq
  ): ResponsePromise<AdminProductsRes> {
    const path = `/admin/products/${id}`
    return this.client.request("POST", path, payload)
  }

  delete(id: string): ResponsePromise<AdminProductsDeleteRes> {
    const path = `/admin/products/${id}`
    return this.client.request("DELETE", path)
  }

  list(query: AdminGetProductsParams): ResponsePromise<AdminProductsListRes> {
    let path = `/admin/products`

    if (query) {
      const queryString = Object.entries(query).map(([key, value]) => {
        return typeof value !== "undefined" ? `${key}=${value}` : ""
      })
      path = `/admin/products?${queryString.join("&")}`
    }

    return this.client.request("GET", path)
  }

  listTypes(): ResponsePromise<AdminProductsListTypesRes> {
    const path = `/admin/products/types`
    return this.client.request("GET", path)
  }

  listTags(): ResponsePromise<AdminProductsListTagsRes> {
    const path = `/admin/products/tag-usage`
    return this.client.request("GET", path)
  }

  setMetadata(
    id: string,
    payload: AdminPostProductsProductMetadataReq
  ): ResponsePromise<AdminProductsRes> {
    const path = `/admin/products/${id}/metadata`
    return this.client.request("POST", path, payload)
  }

  createVariant(
    id: string,
    payload: AdminPostProductsProductVariantsReq
  ): ResponsePromise<AdminProductsRes> {
    const path = `/admin/products/${id}/variants`
    return this.client.request("POST", path, payload)
  }

  updateVariant(
    id: string,
    variantId: string,
    payload: AdminPostProductsProductVariantsVariantReq
  ): ResponsePromise<AdminProductsRes> {
    const path = `/admin/products/${id}/variants/${variantId}`
    return this.client.request("POST", path, payload)
  }

  deleteVariant(
    id: string,
    variantId: string
  ): ResponsePromise<AdminProductsDeleteVariantRes> {
    const path = `/admin/products/${id}/variants/${variantId}`
    return this.client.request("DELETE", path)
  }

  addOption(
    id: string,
    payload: AdminPostProductsProductOptionsReq
  ): ResponsePromise<AdminProductsRes> {
    const path = `/admin/products/${id}/options`
    return this.client.request("POST", path, payload)
  }

  updateOption(
    id: string,
    optionId: string,
    payload: AdminPostProductsProductOptionsOption
  ): ResponsePromise<AdminProductsRes> {
    const path = `/admin/products/${id}/options/${optionId}`
    return this.client.request("POST", path, payload)
  }

  deleteOption(
    id: string,
    optionId: string
  ): ResponsePromise<AdminProductsDeleteOptionRes> {
    const path = `/admin/products/${id}/options/${optionId}`
    return this.client.request("DELETE", path)
  }
}

export default AdminProductsResource

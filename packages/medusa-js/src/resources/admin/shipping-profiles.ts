import {
  AdminDeleteShippingProfileRes,
  AdminPostShippingProfilesProfileReq,
  AdminPostShippingProfilesReq,
  AdminShippingProfilesListRes,
  AdminShippingProfilesRes,
} from "@medusajs/medusa"
import { ResponsePromise } from "../../typings"
import BaseResource from "../base"

class AdminShippingProfilesResource extends BaseResource {
  create(
    payload: AdminPostShippingProfilesReq,
    customHeaders: Record<string, any> = {}): ResponsePromise<AdminShippingProfilesRes> {
    const path = `/admin/shipping-profiles/`
    return this.client.request("POST", path, payload, {}, customHeaders)
  }

  update(
    id: string,
    payload: AdminPostShippingProfilesProfileReq,
    customHeaders: Record<string, any> = {}): ResponsePromise<AdminShippingProfilesRes> {
    const path = `/admin/shipping-profiles/${id}`
    return this.client.request("POST", path, payload, {}, customHeaders)
  }

  delete(id: string, customHeaders: Record<string, any> = {}): ResponsePromise<AdminDeleteShippingProfileRes> {
    const path = `/admin/shipping-profiles/${id}`
    return this.client.request("DELETE", path, {}, {}, customHeaders)
  }

  retrieve(id: string, customHeaders: Record<string, any> = {}): ResponsePromise<AdminShippingProfilesRes> {
    const path = `/admin/shipping-profiles/${id}`
    return this.client.request("GET", path, {}, {}, customHeaders)
  }

  list(customHeaders: Record<string, any> = {}): ResponsePromise<AdminShippingProfilesListRes> {
    const path = `/admin/shipping-profiles/`
    return this.client.request("GET", path, {}, {}, customHeaders)
  }
}

export default AdminShippingProfilesResource

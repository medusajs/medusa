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
    customHeaders: object = {}): ResponsePromise<AdminShippingProfilesRes> {
    const path = `/admin/shipping-profiles/`
    return this.client.request("POST", path, payload, {}, customHeaders)
  }

  update(
    id: string,
    payload: AdminPostShippingProfilesProfileReq,
    customHeaders: object = {}): ResponsePromise<AdminShippingProfilesRes> {
    const path = `/admin/shipping-profiles/${id}`
    return this.client.request("POST", path, payload, {}, customHeaders)
  }

  delete(id: string, customHeaders: object = {}): ResponsePromise<AdminDeleteShippingProfileRes> {
    const path = `/admin/shipping-profiles/${id}`
    return this.client.request("DELETE", path, {}, {}, customHeaders)
  }

  retrieve(id: string, customHeaders: object = {}): ResponsePromise<AdminShippingProfilesRes> {
    const path = `/admin/shipping-profiles/${id}`
    return this.client.request("GET", path, {}, {}, customHeaders)
  }

  list(customHeaders: object = {}): ResponsePromise<AdminShippingProfilesListRes> {
    const path = `/admin/shipping-profiles/`
    return this.client.request("GET", path, {}, {}, customHeaders)
  }
}

export default AdminShippingProfilesResource

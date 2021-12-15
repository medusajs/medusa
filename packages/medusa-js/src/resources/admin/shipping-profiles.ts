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
    payload: AdminPostShippingProfilesReq
  ): ResponsePromise<AdminShippingProfilesRes> {
    const path = `/admin/shipping-profiles/`
    return this.client.request("POST", path, payload)
  }

  update(
    id: string,
    payload: AdminPostShippingProfilesProfileReq
  ): ResponsePromise<AdminShippingProfilesRes> {
    const path = `/admin/shipping-profiles/${id}`
    return this.client.request("POST", path, payload)
  }

  delete(id: string): ResponsePromise<AdminDeleteShippingProfileRes> {
    const path = `/admin/shipping-profiles/${id}`
    return this.client.request("DELETE", path)
  }

  retrieve(id: string): ResponsePromise<AdminShippingProfilesRes> {
    const path = `/admin/shipping-profiles/${id}`
    return this.client.request("GET", path)
  }

  list(): ResponsePromise<AdminShippingProfilesListRes> {
    const path = `/admin/shipping-profiles/`
    return this.client.request("GET", path)
  }
}

export default AdminShippingProfilesResource

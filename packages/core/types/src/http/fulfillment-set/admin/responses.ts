import { DeleteResponse } from "../../common"
import { AdminFulfillmentSet, AdminServiceZone } from "./entities"

export interface AdminServiceZoneResponse {
  service_zone: AdminServiceZone
}

export interface AdminServiceZoneDeleteResponse
  extends DeleteResponse<"service_zone", AdminFulfillmentSet> {}

export interface AdminFulfillmentSetResponse {
  fulfillment_set: AdminFulfillmentSet
}

export interface AdminFulfillmentSetDeleteResponse
  extends DeleteResponse<"fulfillment_set"> {}

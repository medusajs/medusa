import { DeleteResponse, DeleteResponseWithParent } from "../../common"
import { AdminFulfillmentSet, AdminServiceZone } from "./entities"

export interface AdminServiceZoneResponse {
  /**
   * The service zone's details.
   */
  service_zone: AdminServiceZone
}

export interface AdminServiceZoneDeleteResponse
  extends DeleteResponseWithParent<"service_zone", AdminFulfillmentSet> {}

export interface AdminFulfillmentSetResponse {
  /**
   * The fulfillment set's details.
   */
  fulfillment_set: AdminFulfillmentSet
}

export interface AdminFulfillmentSetDeleteResponse
  extends DeleteResponse<"fulfillment_set"> {}

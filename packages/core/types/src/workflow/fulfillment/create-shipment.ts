import { CreateFulfillmentLabelWorkflowDTO } from "./create-fulfillment"

/**
 * The attributes to update in the fulfillment.
 */
export interface CreateShipmentWorkflowInput {
  /**
   * The ID of the fulfillment
   */
  id: string

  /**
   * The labels associated with the fulfillment.
   */
  labels: CreateFulfillmentLabelWorkflowDTO[]
}

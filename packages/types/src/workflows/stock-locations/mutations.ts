export interface CreateLocationFulfillmentSetWorkflowInputDTO {
  location_id: string
  fulfillment_set_data: {
    name: string
    type: string
  }
}

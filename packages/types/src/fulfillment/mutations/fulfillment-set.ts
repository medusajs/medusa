export interface CreateFulfillmentSetDTO {
  name: string
  type: string
  provider_id: string
  // data: { ... } TODO: question: do we expect any specific data here?
}

export interface UpdateFulfillmentSetDTO
  extends Partial<CreateFulfillmentSetDTO> {
  id: string
}

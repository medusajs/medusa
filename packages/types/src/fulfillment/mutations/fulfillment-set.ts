export interface CreateFulfillmentSetDTO {
  name: string
  type: string
  provider_id: string
  // data: { ... } TODO: question: do we expect any specific data here?
}

import {
  CreateAddressDTO,
  CreateLineItemDTO,
  UpdateAddressDTO,
} from "./mutations"

export interface CreateCartWorkflowInputDTO {
  region_id?: string
  customer_id?: string
  sales_channel_id?: string
  email?: string
  currency_code: string
  shipping_address_id?: string
  billing_address_id?: string
  shipping_address?: CreateAddressDTO | UpdateAddressDTO
  billing_address?: CreateAddressDTO | UpdateAddressDTO
  metadata?: Record<string, unknown>

  items?: CreateLineItemDTO[]
}

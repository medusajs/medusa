import { AddressDTO } from "../../address"
import { WorkflowInputConfig } from "../common"

export interface CreateLineItemInputDTO {
  variant_id: string
  quantity: number
}

export interface CreateCartWorkflowInputDTO {
  config?: WorkflowInputConfig
  region_id?: string
  country_code?: string
  items?: CreateLineItemInputDTO[]
  context?: object
  sales_channel_id?: string
  shipping_address_id?: string
  billing_address_id?: string
  billing_address?: AddressDTO
  shipping_address?: AddressDTO
  customer_id?: string
  email?: string
}

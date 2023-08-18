import { WorkflowTypes } from "@medusajs/types"
import { WorkflowArguments } from "../../helper"
import { findOrCreateAddresses } from "../address"
import { CreateCartWorkflowInputDTO } from "@medusajs/types/dist/workflow/cart"
import { AddressDTO } from "@medusajs/types"

type AddressesDTO = {
  shipping_address_id?: string
  billing_address_id?: string
}

type HandlerOutputData = {
  addresses: AddressesDTO & {
    billing_address?: AddressDTO
    shipping_address?: AddressDTO
  }
  customer: {
    customer_id?: string
  }
}

export async function createCartPrepareData({
  data,
}: WorkflowArguments<WorkflowTypes.CartWorkflow.CreateCartWorkflowInputDTO>) {
  const { country_code, customer_id } = data

  const result: HandlerOutputData = {
    addresses: {},
    customer: {},
  }

  if (country_code) {
    result.addresses = {
      shipping_address: {
        country_code: country_code.toLowerCase(),
      },
    }
  }

  if (customer_id) {
    result.customer = {
      customer_id,
    }
  }

  return data
}

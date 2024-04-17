import {
  AdminCustomerListResponse,
  AdminCustomerResponse,
  DeleteResponse,
} from "@medusajs/types"
import { CreateCustomerReq, UpdateCustomerReq } from "../../types/api-payloads"
import { deleteRequest, getRequest, postRequest } from "./common"

async function retrieveCustomer(id: string, query?: Record<string, any>) {
  return getRequest<AdminCustomerResponse>(`/admin/customers/${id}`, query)
}

async function listCustomers(query?: Record<string, any>) {
  return getRequest<AdminCustomerListResponse>(`/admin/customers`, query)
}

async function createCustomer(payload: CreateCustomerReq) {
  return postRequest<AdminCustomerResponse>(`/admin/customers`, payload)
}

async function updateCustomer(id: string, payload: UpdateCustomerReq) {
  return postRequest<AdminCustomerResponse>(`/admin/customers/${id}`, payload)
}

async function deleteCustomer(id: string) {
  return deleteRequest<DeleteResponse>(`/admin/customers/${id}`)
}

export const customers = {
  retrieve: retrieveCustomer,
  list: listCustomers,
  create: createCustomer,
  update: updateCustomer,
  delete: deleteCustomer,
}

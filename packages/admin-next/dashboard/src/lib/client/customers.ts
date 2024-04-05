import { CreateCustomerReq, UpdateCustomerReq } from "../../types/api-payloads"
import { CustomerListRes, CustomerRes } from "../../types/api-responses"
import { getRequest, postRequest } from "./common"

async function retrieveCustomer(id: string, query?: Record<string, any>) {
  return getRequest<CustomerRes>(`/admin/customers/${id}`, query)
}

async function listCustomers(query?: Record<string, any>) {
  return getRequest<CustomerListRes>(`/admin/customers`, query)
}

async function createCustomer(payload: CreateCustomerReq) {
  return postRequest<CustomerRes>(`/admin/customers`, payload)
}

async function updateCustomer(id: string, payload: UpdateCustomerReq) {
  return postRequest<CustomerRes>(`/admin/customers/${id}`, payload)
}

export const customers = {
  retrieve: retrieveCustomer,
  list: listCustomers,
  create: createCustomer,
  update: updateCustomer,
}

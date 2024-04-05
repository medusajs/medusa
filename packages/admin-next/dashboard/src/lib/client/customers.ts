import { CreateCustomerReq, UpdateCustomerReq } from "../../types/api-payloads"
import { CustomerListRes, CustomerRes } from "../../types/api-responses"
import { makeRequest } from "./common"

async function retrieveCustomer(id: string, query?: Record<string, any>) {
  return makeRequest<CustomerRes, Record<string, any>>(
    `/admin/customers/${id}`,
    query
  )
}

async function listCustomers(query?: Record<string, any>) {
  return makeRequest<CustomerListRes, Record<string, any>>(
    `/admin/customers`,
    query
  )
}

async function createCustomer(payload: CreateCustomerReq) {
  return makeRequest<CustomerRes>(`/admin/customers`, undefined, {
    method: "POST",
    body: JSON.stringify(payload),
  })
}

async function updateCustomer(id: string, payload: UpdateCustomerReq) {
  return makeRequest<CustomerRes>(`/admin/customers/${id}`, undefined, {
    method: "POST",
    body: JSON.stringify(payload),
  })
}

export const customers = {
  retrieve: retrieveCustomer,
  list: listCustomers,
  create: createCustomer,
  update: updateCustomer,
}

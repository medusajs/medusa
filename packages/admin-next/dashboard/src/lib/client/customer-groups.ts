import { getRequest } from "./common"

async function retrieveCustomerGroup(id: string, query?: Record<string, any>) {
  return getRequest<any>(`/admin/customer-groups/${id}`, query)
}

async function listCustomerGroups(query?: Record<string, any>) {
  return getRequest<any>(`/admin/customer-groups`, query)
}

export const customerGroups = {
  retrieve: retrieveCustomerGroup,
  list: listCustomerGroups,
}

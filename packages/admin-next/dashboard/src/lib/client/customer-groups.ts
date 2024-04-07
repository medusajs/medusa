import {
  CustomerGroupListRes,
  CustomerGroupRes,
} from "../../types/api-responses"
import { getRequest } from "./common"

async function retrieveCustomerGroup(id: string, query?: Record<string, any>) {
  return getRequest<CustomerGroupRes>(`/admin/customer-groups/${id}`, query)
}

async function listCustomerGroups(query?: Record<string, any>) {
  return getRequest<CustomerGroupListRes>(`/admin/customer-groups`, query)
}

export const customerGroups = {
  retrieve: retrieveCustomerGroup,
  list: listCustomerGroups,
}

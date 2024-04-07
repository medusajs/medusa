import {
  AdminCustomerGroupListResponse,
  AdminCustomerGroupResponse,
} from "@medusajs/types"
import { z } from "zod"
import { CreateCustomerGroupSchema } from "../../v2-routes/customer-groups/customer-group-create/components/create-customer-group-form"
import { EditCustomerGroupSchema } from "../../v2-routes/customer-groups/customer-group-edit/components/edit-customer-group-form"
import { getRequest, postRequest } from "./common"

async function retrieveCustomerGroup(id: string, query?: Record<string, any>) {
  return getRequest<AdminCustomerGroupResponse>(
    `/admin/customer-groups/${id}`,
    query
  )
}

async function listCustomerGroups(query?: Record<string, any>) {
  return getRequest<AdminCustomerGroupListResponse>(
    `/admin/customer-groups`,
    query
  )
}

async function createCustomer(
  payload: z.infer<typeof CreateCustomerGroupSchema>
) {
  return postRequest<AdminCustomerGroupResponse>(
    `/admin/customer-groups`,
    payload
  )
}

async function updateCustomer(
  id: string,
  payload: z.infer<typeof EditCustomerGroupSchema>
) {
  return postRequest<AdminCustomerGroupResponse>(
    `/admin/customer-groups/${id}`,
    payload
  )
}

export const customerGroups = {
  retrieve: retrieveCustomerGroup,
  list: listCustomerGroups,
  create: createCustomer,
  update: updateCustomer,
}

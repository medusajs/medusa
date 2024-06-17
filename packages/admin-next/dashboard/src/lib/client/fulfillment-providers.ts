import { getRequest } from "./common"
import { FulfillmentProvidersListRes } from "../../types/api-responses"

async function listFulfillmentProviders(query?: Record<string, any>) {
  return getRequest<FulfillmentProvidersListRes>(
    `/admin/fulfillment-providers`,
    query
  )
}

export const fulfillmentProviders = {
  list: listFulfillmentProviders,
}

import { storeQueryKeys } from "../../../hooks/api/store"
import { client } from "../../../lib/client"
import { queryClient } from "../../../lib/query-client"
import { StoreRes } from "../../../types/api-responses"

const storeDetailQuery = () => ({
  queryKey: storeQueryKeys.details(),
  queryFn: async () => client.stores.retrieve(),
})

export const storeLoader = async () => {
  const query = storeDetailQuery()

  return (
    queryClient.getQueryData<StoreRes>(query.queryKey) ??
    (await queryClient.fetchQuery(query))
  )
}

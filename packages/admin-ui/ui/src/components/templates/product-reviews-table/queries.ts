import { useQuery } from "@tanstack/react-query"
import { useMedusa } from "medusa-react"

export const queryKeysFactory = (globalKey: any) => {
  const queryKeyFactory = {
    all: [globalKey],
    lists: () => [...queryKeyFactory.all, "list"],
    list: (query: any) => [...queryKeyFactory.lists(), { query }],
    details: () => [...queryKeyFactory.all, "detail"],
    detail: (id: string) => [...queryKeyFactory.details(), id],
  }
  return queryKeyFactory
}

const ADMIN_CUSTOMERS_QUERY_KEY = "admin_product_reviews"

export const adminProductReviewsQueryKeys = queryKeysFactory(
  ADMIN_CUSTOMERS_QUERY_KEY
)

export const useAdminProductReviews = (query, options) => {
  const { client } = useMedusa()
  const { data, ...rest } = useQuery(
    adminProductReviewsQueryKeys.list(query),
    () => client.admin.client.request("GET", "/product-reviews"),
    options
  )
  return { ...data, ...rest }
}

// export const useAdminCustomer = (id, options) => {
//   const { client } = useMedusa()
//   const { data, ...rest } = useQuery(
//     adminProductReviewsQueryKeys.detail(id),
//     () => client.admin.customers.retrieve(id),
//     options
//   )
//   return { ...data, ...rest }
// }

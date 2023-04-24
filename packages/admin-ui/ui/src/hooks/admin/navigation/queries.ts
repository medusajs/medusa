import { NavigationItem } from "@medusajs/medusa"
import { Response } from "@medusajs/medusa-js"
import { AxiosResponse } from "axios"
import { UseQueryOptionsWrapper } from "medusa-react/dist/types"
import { useQuery } from "react-query"
import medusaRequest from "../../../services/request"
import { queryKeysFactory } from "../../utils"

const NAVIGATION_ITEM_QUERY_KEY = `nav-item,count` as const

export const navigationItemKeys = queryKeysFactory(NAVIGATION_ITEM_QUERY_KEY)

type NavigationItemQueryKeys = typeof navigationItemKeys

export const useGetNavigationItems = (
  options?: UseQueryOptionsWrapper<
    AxiosResponse<{ navigation_items: NavigationItem[] }>,
    Error,
    ReturnType<NavigationItemQueryKeys["list"]>
  >
) => {
  const path = `/admin/navigation-items`

  const { data, refetch, ...rest } = useQuery(
    navigationItemKeys.list(),
    () =>
      medusaRequest<Response<{ navigation_items: NavigationItem[] }>>(
        "GET",
        path
      ),
    options
  )

  return { navigation_items: data?.data?.navigation_items, ...rest, refetch }
}

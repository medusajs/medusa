import { NavigationItem } from "@medusajs/medusa"
import { useMutation, useQueryClient } from "react-query"
import medusaRequest from "../../../services/request"
import { buildOptions } from "../../utils/buildOptions"
import { navigationItemKeys } from "./queries"

export interface CreateNavigationItem {
  label: string
  url: string
  new_tab: boolean
  location?: NavigationItem["location"]
  sort_order?: number
}

export interface AdminReplaceNavigationItemsReq {
  location: NavigationItem["location"]
  items: CreateNavigationItem[]
}

export const useAdminUpdateNavigationItems = (options?) => {
  const path = `/admin/navigation-items`
  const queryClient = useQueryClient()

  return useMutation(
    (payload: AdminReplaceNavigationItemsReq) =>
      medusaRequest<{ navigation_items: NavigationItem[] }>(
        "PUT",
        path,
        payload
      ),
    buildOptions(queryClient, [navigationItemKeys.list()], options)
  )
}

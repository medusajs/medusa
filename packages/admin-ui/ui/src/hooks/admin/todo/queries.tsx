import { Response } from "@medusajs/medusa-js"
import { AxiosResponse } from "axios"
import { UseQueryOptionsWrapper } from "medusa-react/dist/types"
import { useQuery } from "react-query"
import medusaRequest from "../../../services/request"
import { queryKeysFactory } from "../../utils"

export enum TodoType {
  CREATE_FIRST_PRODUCT = "create_first_product",
  SETUP_SITE_SETTINGS = "setup_site_settings",
  SETUP_HOMEPAGE = "setup_homepage",
  SETUP_VENDOR_DETAILS = "setup_vendor_details",
  SETUP_SHIPPING_OPTIONS = "setup_shipping_options",
  FIRST_SALE = "first_sale",
  SETUP_BANK_ACCOUNT = "setup_bank_account",
  CUSTOM = "custom",
}

export interface TodoItem {
  id: string
  title: string
  description: string
  vendor_id: string
  type: TodoType
  created_at: Date
  updated_at: Date
  completed_at: Date
  metadata: Record<string, unknown> | null
}

const QUERY_KEY = `todo,count` as const

export const queryKeys = queryKeysFactory(QUERY_KEY)

type QueryKeys = typeof queryKeys

export type ListTodosResponse = { todos: TodoItem[]; count: number }

export const useGetVendorTodos = (
  vendor_id: string,
  options?: UseQueryOptionsWrapper<
    AxiosResponse<ListTodosResponse>,
    Error,
    ReturnType<QueryKeys["detail"]>
  >
) => {
  const path = `/admin/todos/${vendor_id}`

  const { data, refetch, ...rest } = useQuery(
    queryKeys.detail(vendor_id),
    () => medusaRequest<Response<ListTodosResponse>>("GET", path),
    options
  )
  return { ...data?.data, ...rest, refetch }
}

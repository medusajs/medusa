import { AdminOrderEditsRes } from "@medusajs/medusa"
import { queryKeysFactory } from "../../utils"
import { UseQueryOptionsWrapper } from "../../../types"
import { Response } from "@medusajs/medusa-js"
import { useMedusa } from "../../../contexts"
import { useQuery } from "react-query"

const ADMIN_ORDER_EDITS_QUERY_KEY = `admin_order_edits` as const

export const adminOrderEditsKeys = queryKeysFactory(ADMIN_ORDER_EDITS_QUERY_KEY)
type OrderEditQueryKeys = typeof adminOrderEditsKeys

export const useAdminOrderEdit = (
  id: string,
  options?: UseQueryOptionsWrapper<
    Response<AdminOrderEditsRes>,
    Error,
    ReturnType<OrderEditQueryKeys["detail"]>
  >
) => {
  const { client } = useMedusa()
  const { data, ...rest } = useQuery(
    adminOrderEditsKeys.detail(id),
    () => client.admin.orderEdits.retrieve(id),
    options
  )
  return { ...data, ...rest } as const
}

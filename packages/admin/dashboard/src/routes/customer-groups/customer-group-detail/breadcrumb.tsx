import { HttpTypes } from "@medusajs/types"
import { UIMatch } from "react-router-dom"

import { useCustomerGroup } from "../../../hooks/api"
import { CUSTOMER_GROUP_DETAIL_FIELDS } from "./constants"

type CustomerGroupDetailBreadcrumbProps =
  UIMatch<HttpTypes.AdminCustomerGroupResponse>

export const CustomerGroupDetailBreadcrumb = (
  props: CustomerGroupDetailBreadcrumbProps
) => {
  const { id } = props.params || {}

  const { customer_group } = useCustomerGroup(
    id!,
    {
      fields: CUSTOMER_GROUP_DETAIL_FIELDS,
    },
    {
      initialData: props.data,
      enabled: Boolean(id),
    }
  )

  if (!customer_group) {
    return null
  }

  return <span>{customer_group.name}</span>
}

export const seo = (match: UIMatch<HttpTypes.AdminCustomerGroupResponse>) => ({
  title: match.data?.customer_group?.name,
})

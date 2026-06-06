import { HttpTypes } from "@zjedene-medusa/types"
import { UIMatch } from "react-router-dom"

import { useCustomer } from "../../../hooks/api"

type CustomerDetailBreadcrumbProps = UIMatch<HttpTypes.AdminCustomerResponse>

export const CustomerDetailBreadcrumb = (
  props: CustomerDetailBreadcrumbProps
) => {
  const { id } = props.params || {}

  const { customer } = useCustomer(id!, undefined, {
    initialData: props.data,
    enabled: Boolean(id),
  })

  if (!customer) {
    return null
  }

  const name = [customer.first_name, customer.last_name]
    .filter(Boolean)
    .join(" ")

  const display = name || customer.email

  return <span>{display}</span>
}

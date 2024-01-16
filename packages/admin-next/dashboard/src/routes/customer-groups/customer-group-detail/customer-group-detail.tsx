import { useAdminCustomerGroup } from "medusa-react"
import { Outlet, json, useParams } from "react-router-dom"
import { JsonViewSection } from "../../../components/common/json-view-section"
import { CustomerGroupCustomerSection } from "./components/customer-group-customer-section"
import { CustomerGroupGeneralSection } from "./components/customer-group-general-section"

export const CustomerGroupDetail = () => {
  const { id } = useParams()
  const { customer_group, isLoading, isError, error } = useAdminCustomerGroup(
    id!
  )

  if (isLoading) {
    return <div>Loading...</div>
  }

  if (isError || !customer_group) {
    if (error) {
      throw error
    }

    throw json("An unknown error occurred", 500)
  }

  return (
    <div className="flex flex-col gap-y-2">
      <CustomerGroupGeneralSection group={customer_group} />
      <CustomerGroupCustomerSection group={customer_group} />
      <JsonViewSection data={customer_group} />
      <Outlet />
    </div>
  )
}

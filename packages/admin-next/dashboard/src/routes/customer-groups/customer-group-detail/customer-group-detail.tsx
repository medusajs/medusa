import { useAdminCustomerGroup } from "medusa-react"
import { json, useParams } from "react-router-dom"
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
    </div>
  )
}

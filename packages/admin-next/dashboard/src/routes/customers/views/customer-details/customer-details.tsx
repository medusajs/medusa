import { useAdminCustomer } from "medusa-react"
import { json, useParams } from "react-router-dom"
import { JsonView } from "../../../../components/common/json-view"
import { CustomerDetailsSection } from "../../components/customer-details-section/customer-details-section"

export const CustomerDetails = () => {
  const { id } = useParams()

  const { customer, isLoading, isError, error } = useAdminCustomer(id!, {
    enabled: !!id,
  })

  if (isLoading) {
    return <div>Loading...</div>
  }

  if (isError || !customer) {
    if (error) {
      throw error
    }

    throw json(
      {
        message: "Customer not found",
      },
      404
    )
  }

  return (
    <div className="flex flex-col gap-y-2">
      <CustomerDetailsSection customer={customer} />
      <JsonView data={customer} />
    </div>
  )
}

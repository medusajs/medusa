import { useAdminCustomer } from "medusa-react"
import { Outlet, json, useLoaderData, useParams } from "react-router-dom"
import { JsonViewSection } from "../../../components/common/json-view-section"
import { CustomerGeneralSection } from "./components/customer-general-section"
import { CustomerOrderSection } from "./components/customer-order-section"
import { customerLoader } from "./loader"

export const CustomerDetail = () => {
  const { id } = useParams()

  const initialData = useLoaderData() as Awaited<
    ReturnType<typeof customerLoader>
  >
  const { customer, isLoading, isError, error } = useAdminCustomer(id!, {
    initialData,
  })

  if (isLoading) {
    return <div>Loading...</div>
  }

  if (isError || !customer) {
    if (error) {
      throw error
    }

    throw json("An unknown error occurred", 500)
  }

  return (
    <div className="flex flex-col gap-y-2">
      <CustomerGeneralSection customer={customer} />
      <CustomerOrderSection customer={customer} />
      {/* <CustomerGroupSection customer={customer} /> */}
      <JsonViewSection data={customer} />
      <Outlet />
    </div>
  )
}

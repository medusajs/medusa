import { Outlet, json, useLoaderData, useParams } from "react-router-dom"
import { CustomerGeneralSection } from "./components/customer-general-section"
import { JsonViewSection } from "../../../components/common/json-view-section"
import { customerLoader } from "./loader"
import { useCustomer } from "../../../hooks/api/customers"

export const CustomerDetail = () => {
  const { id } = useParams()

  const initialData = useLoaderData() as Awaited<
    ReturnType<typeof customerLoader>
  >
  const { customer, isLoading, isError, error } = useCustomer(id!, undefined, {
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
      {/* <CustomerOrderSection customer={customer} />
      // TODO: re-add when order endpoints are added to api-v2
      */}
      {/* <CustomerGroupSection customer={customer} /> */}
      <JsonViewSection data={customer} />
      <Outlet />
    </div>
  )
}

import { Outlet, useLoaderData, useParams } from "react-router-dom"
import { JsonViewSection } from "../../../components/common/json-view-section"
import { useCustomer } from "../../../hooks/api/customers"
import { CustomerGeneralSection } from "./components/customer-general-section"
import { CustomerGroupSection } from "./components/customer-group-section"
import { customerLoader } from "./loader"

export const CustomerDetail = () => {
  const { id } = useParams()

  const initialData = useLoaderData() as Awaited<
    ReturnType<typeof customerLoader>
  >
  const { customer, isLoading, isError, error } = useCustomer(id!, undefined, {
    initialData,
  })

  if (isLoading || !customer) {
    return <div>Loading...</div>
  }

  if (isError) {
    throw error
  }

  return (
    <div className="flex flex-col gap-y-2">
      <CustomerGeneralSection customer={customer} />
      {/* <CustomerOrderSection customer={customer} />
      // TODO: re-add when order endpoints are added to api-v2
      */}
      <CustomerGroupSection customer={customer} />
      <JsonViewSection data={customer} />
      <Outlet />
    </div>
  )
}

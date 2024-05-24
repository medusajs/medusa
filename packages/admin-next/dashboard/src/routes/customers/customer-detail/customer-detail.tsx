import { Outlet, useLoaderData, useParams } from "react-router-dom"

import { JsonViewSection } from "../../../components/common/json-view-section"
import { useCustomer } from "../../../hooks/api/customers"
import { CustomerGeneralSection } from "./components/customer-general-section"
import { CustomerGroupSection } from "./components/customer-group-section"
import { customerLoader } from "./loader"

import after from "virtual:medusa/widgets/customer/details/after"
import before from "virtual:medusa/widgets/customer/details/before"

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
      {before.widgets.map((w, i) => {
        return (
          <div key={i}>
            <w.Component />
          </div>
        )
      })}
      <CustomerGeneralSection customer={customer} />
      {/* <CustomerOrderSection customer={customer} />
      // TODO: re-add when order endpoints are added to api-v2
      */}
      <CustomerGroupSection customer={customer} />
      {after.widgets.map((w, i) => {
        return (
          <div key={i}>
            <w.Component />
          </div>
        )
      })}
      <JsonViewSection data={customer} />
      <Outlet />
    </div>
  )
}

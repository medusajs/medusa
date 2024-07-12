import { useLoaderData, useParams } from "react-router-dom"

import { SingleColumnPageSkeleton } from "../../../components/common/skeleton"
import { SingleColumnPage } from "../../../components/layout/pages"
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
    return <SingleColumnPageSkeleton sections={2} showJSON showMetadata />
  }

  if (isError) {
    throw error
  }

  return (
    <SingleColumnPage
      widgets={{
        before,
        after,
      }}
      data={customer}
      hasOutlet
      showJSON
      showMetadata
    >
      <CustomerGeneralSection customer={customer} />
      {/* <CustomerOrderSection customer={customer} />
      // TODO: re-add when order endpoints are added to api-v2
      */}
      <CustomerGroupSection customer={customer} />
    </SingleColumnPage>
  )
}

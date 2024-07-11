import { useLoaderData, useParams } from "react-router-dom"

import { SingleColumnPage } from "../../../components/layout/pages"
import { useCustomerGroup } from "../../../hooks/api/customer-groups"
import { CustomerGroupCustomerSection } from "./components/customer-group-customer-section"
import { CustomerGroupGeneralSection } from "./components/customer-group-general-section"
import { customerGroupLoader } from "./loader"

import after from "virtual:medusa/widgets/customer_group/details/after"
import before from "virtual:medusa/widgets/customer_group/details/before"
import { SingleColumnPageSkeleton } from "../../../components/common/skeleton"

export const CustomerGroupDetail = () => {
  const initialData = useLoaderData() as Awaited<
    ReturnType<typeof customerGroupLoader>
  >

  const { id } = useParams()
  const { customer_group, isLoading, isError, error } = useCustomerGroup(
    id!,
    {
      fields: "+customers.id",
    },
    { initialData }
  )

  if (isLoading || !customer_group) {
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
      showJSON
      showMetadata
      data={customer_group}
    >
      <CustomerGroupGeneralSection group={customer_group} />
      <CustomerGroupCustomerSection group={customer_group} />
    </SingleColumnPage>
  )
}

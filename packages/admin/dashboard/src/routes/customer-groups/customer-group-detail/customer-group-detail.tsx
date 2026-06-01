import { useLoaderData, useParams } from "react-router-dom"

import { SingleColumnPage } from "../../../components/layout/pages"
import { useCustomerGroup } from "../../../hooks/api/customer-groups"
import { CustomerGroupCustomerSection } from "./components/customer-group-customer-section"
import { CustomerGroupGeneralSection } from "./components/customer-group-general-section"
import { customerGroupLoader } from "./loader"

import { SingleColumnPageSkeleton } from "../../../components/common/skeleton"
import { PermissionGuard } from "../../../components/common/permission-guard"
import { useExtension } from "../../../providers/extension-provider"
import { CUSTOMER_GROUP_DETAIL_FIELDS } from "./constants"

export const CustomerGroupDetail = () => {
  const initialData = useLoaderData() as Awaited<
    ReturnType<typeof customerGroupLoader>
  >

  const { id } = useParams()
  const { customer_group, isLoading, isError, error } = useCustomerGroup(
    id!,
    {
      fields: CUSTOMER_GROUP_DETAIL_FIELDS,
    },
    { initialData }
  )

  const { getWidgets } = useExtension()

  if (isLoading || !customer_group) {
    return <SingleColumnPageSkeleton sections={2} showJSON showMetadata />
  }

  if (isError) {
    throw error
  }

  return (
    <SingleColumnPage
      widgets={{
        before: getWidgets("customer_group.details.before"),
        after: getWidgets("customer_group.details.after"),
      }}
      showJSON
      showMetadata
      showRequiredPermissions
      data={customer_group}
    >
      <CustomerGroupGeneralSection group={customer_group} />
      <PermissionGuard permission="customer:read">
        <CustomerGroupCustomerSection group={customer_group} />
      </PermissionGuard>
    </SingleColumnPage>
  )
}

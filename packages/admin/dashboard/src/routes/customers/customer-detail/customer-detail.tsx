import { useLoaderData, useParams } from "react-router-dom"

import { SingleColumnPageSkeleton } from "../../../components/common/skeleton"
import { TwoColumnPage } from "../../../components/layout/pages"
import { useCustomer } from "../../../hooks/api/customers"
import { useExtension } from "../../../providers/extension-provider"
import { CustomerAddressSection } from "./components/customer-address-section/customer-address-section"
import { CustomerGeneralSection } from "./components/customer-general-section"
import { CustomerGroupSection } from "./components/customer-group-section"
import { CustomerOrderSection } from "./components/customer-order-section"
import { customerLoader } from "./loader"
import { PermissionGuard } from "../../../components/common/permission-guard"

export const CustomerDetail = () => {
  const { id } = useParams()

  const initialData = useLoaderData() as Awaited<
    ReturnType<typeof customerLoader>
  >
  const { customer, isLoading, isError, error } = useCustomer(
    id!,
    { fields: "+*addresses" },
    { initialData }
  )

  const { getWidgets } = useExtension()

  if (isLoading || !customer) {
    return <SingleColumnPageSkeleton sections={2} showJSON showMetadata />
  }

  if (isError) {
    throw error
  }

  return (
    <TwoColumnPage
      widgets={{
        before: getWidgets("customer.details.before"),
        after: getWidgets("customer.details.after"),
        sideAfter: getWidgets("customer.details.side.after"),
        sideBefore: getWidgets("customer.details.side.before"),
      }}
      data={customer}
      hasOutlet
      showJSON
      showMetadata
      showRequiredPermissions
    >
      <TwoColumnPage.Main>
        <CustomerGeneralSection customer={customer} />
        <PermissionGuard permission="order:read">
          <CustomerOrderSection customer={customer} />
        </PermissionGuard>
        <PermissionGuard permission="customer_group:read">
          <CustomerGroupSection customer={customer} />
        </PermissionGuard>
      </TwoColumnPage.Main>
      <TwoColumnPage.Sidebar>
        <PermissionGuard permission="customer_address:read">
          <CustomerAddressSection customer={customer} />
        </PermissionGuard>
      </TwoColumnPage.Sidebar>
    </TwoColumnPage>
  )
}

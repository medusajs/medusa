import { CORE_LAYOUT_IDS } from "@medusajs/admin-shared"
import { useLoaderData, useParams } from "react-router-dom"

import { JsonViewSection } from "../../../components/common/json-view-section"
import { MetadataSection } from "../../../components/common/metadata-section"
import { RequiredPermissionsSection } from "../../../components/common/required-permissions-section"
import { SingleColumnPageSkeleton } from "../../../components/common/skeleton"
import { LayoutComposer } from "../../../components/layout-composer"
import { useCustomer } from "../../../hooks/api/customers"
import { PermissionsRequirementsProvider } from "../../../providers/permissions-provider"
import { CustomerAddressSection } from "./components/customer-address-section/customer-address-section"
import { CustomerGeneralSection } from "./components/customer-general-section"
import { CustomerGroupSection } from "./components/customer-group-section"
import { CustomerOrderSection } from "./components/customer-order-section"
import { customerLoader } from "./loader"

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

  if (isLoading || !customer) {
    return <SingleColumnPageSkeleton sections={2} showJSON showMetadata />
  }

  if (isError) {
    throw error
  }

  return (
    <PermissionsRequirementsProvider>
      <LayoutComposer
        widgetsZonePrefix="customer.details"
        preferredLayoutId={CORE_LAYOUT_IDS.TWO_COLUMN}
        data={customer}
        sections={{
          main: (
            <>
              <CustomerGeneralSection customer={customer} />
              <CustomerOrderSection customer={customer} />
              <CustomerGroupSection customer={customer} />
              <MetadataSection data={customer} />
              <JsonViewSection data={customer} />
              <RequiredPermissionsSection />
            </>
          ),
          side: (
            <>
              <CustomerAddressSection customer={customer} />
            </>
          ),
        }}
      />
    </PermissionsRequirementsProvider>
  )
}

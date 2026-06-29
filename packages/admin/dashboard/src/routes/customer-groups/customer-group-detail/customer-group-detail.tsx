import { CORE_LAYOUT_IDS } from "@medusajs/admin-shared"
import { useLoaderData, useParams } from "react-router-dom"

import { SingleColumnPageSkeleton } from "../../../components/common/skeleton"
import { LayoutComposer, detailPageDefaultEntries } from "../../../components/layout-composer"
import { useCustomerGroup } from "../../../hooks/api/customer-groups"
import { CustomerGroupCustomerSection } from "./components/customer-group-customer-section"
import { CustomerGroupGeneralSection } from "./components/customer-group-general-section"
import { CUSTOMER_GROUP_DETAIL_FIELDS } from "./constants"
import { customerGroupLoader } from "./loader"

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

  if (isLoading || !customer_group) {
    return <SingleColumnPageSkeleton sections={2} showJSON showMetadata />
  }

  if (isError) {
    throw error
  }

  return (
    <LayoutComposer
      widgetsZonePrefix="customer_group.details"
      preferredLayoutId={CORE_LAYOUT_IDS.SINGLE_COLUMN}
      data={customer_group}
      sections={{
        main: (
          <>
            <LayoutComposer.Entry id="CustomerGroupGeneralSection">
              <CustomerGroupGeneralSection group={customer_group} />
            </LayoutComposer.Entry>
            <LayoutComposer.Entry id="CustomerGroupCustomerSection">
              <CustomerGroupCustomerSection group={customer_group} />
            </LayoutComposer.Entry>
            {detailPageDefaultEntries(customer_group, { permissions: false })}
          </>
        ),
      }}
    />
  )
}

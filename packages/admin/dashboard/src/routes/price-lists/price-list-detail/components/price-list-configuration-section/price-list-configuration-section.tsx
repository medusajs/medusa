import { PencilSquare } from "@medusajs/icons"
import { HttpTypes } from "@medusajs/types"
import { Container, Heading } from "@medusajs/ui"
import { useTranslation } from "react-i18next"
import { ActionMenu } from "../../../../../components/common/action-menu"
import { DateRangeDisplay } from "../../../../../components/common/date-range-display"
import { ListSummary } from "../../../../../components/common/list-summary"
import { Skeleton } from "../../../../../components/common/skeleton"
import { useCustomerGroups } from "../../../../../hooks/api/customer-groups"
import { usePriceListPermissions } from "../../../../../hooks/use-resource-permissions"
import { PermissionGuard } from "../../../../../components/common/permission-guard"

type PriceListConfigurationSectionProps = {
  priceList: HttpTypes.AdminPriceList
}

export const PriceListConfigurationSection = ({
  priceList,
}: PriceListConfigurationSectionProps) => {
  const { t } = useTranslation()
  const { canUpdate } = usePriceListPermissions()

  return (
    <Container className="flex flex-col gap-y-4">
      <div className="flex items-center justify-between">
        <div>
          <Heading level="h2">{t("priceLists.configuration.header")}</Heading>
          <PermissionGuard permission="customer_group:read">
            <CustomerGroupDisplay priceList={priceList} />
          </PermissionGuard>
        </div>
        {canUpdate && (
          <ActionMenu
            groups={[
              {
                actions: [
                  {
                    label: t("actions.edit"),
                    to: "configuration",
                    icon: <PencilSquare />,
                  },
                ],
              },
            ]}
          />
        )}
      </div>

      <DateRangeDisplay
        endsAt={priceList.ends_at}
        startsAt={priceList.starts_at}
        showTime
      />
    </Container>
  )
}

const CustomerGroupDisplay = ({
  priceList,
}: {
  priceList: HttpTypes.AdminPriceList
}) => {
  const { t } = useTranslation()

  const customerGroupIds = priceList.rules["customer.groups.id"] as
    | string[]
    | undefined

  const { customer_groups, isPending, isError, error } = useCustomerGroups(
    {
      id: customerGroupIds,
    },
    {
      enabled: !!customerGroupIds?.length,
    }
  )

  if (isError) {
    throw error
  }

  if (!customerGroupIds?.length) {
    return null
  }

  if (isPending || !customer_groups) {
    return <Skeleton className="h-5 w-full max-w-48" />
  }

  return (
    <div className="txt-small-plus text-ui-fg-muted flex items-center gap-x-1.5">
      <span className="text-ui-fg-subtle">
        {t("priceLists.fields.customerAvailability.attribute")}
      </span>
      <span>·</span>
      <ListSummary
        list={customer_groups.map((group) => group.name!)}
        n={1}
        className="txt-small-plus text-ui-fg-muted"
      />
    </div>
  )
}

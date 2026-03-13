import { HttpTypes } from "@medusajs/types"
import { createColumnHelper } from "@tanstack/react-table"
import { useMemo } from "react"
import { useTranslation } from "react-i18next"

import { DateCell } from "../../../components/table/table-cells/common/date-cell"
import { TextCell } from "../../../components/table/table-cells/common/text-cell"
import { getFormattedShippingOptionLocationName } from "../../../lib/shipping-options"

const columnHelper = createColumnHelper<HttpTypes.AdminShippingOption>()

export const useShippingOptionTableColumns = () => {
  const { t } = useTranslation()

  return useMemo(
    () => [
      columnHelper.accessor("name", {
        header: () => t("fields.name"),
        cell: ({ getValue }) => <TextCell text={getValue()} />,
      }),
      columnHelper.accessor("shipping_profile", {
        header: () => t("fields.shippingProfile"),
        cell: ({ row }) => (
          <TextCell text={row.original.shipping_profile?.name || t("general.notAvailable")} />
        ),
      }),
      columnHelper.display({
        id: "location",
        header: () => t("fields.location"),
        cell: ({ row }) => {
          const locationName = getFormattedShippingOptionLocationName(
            row.original,
            t
          )

          return <TextCell text={locationName} />
        },
      }),
      columnHelper.display({
        id: "service_zone",
        header: () => t("fields.serviceZone"),
        cell: ({ row }) => {
          const serviceZoneName = row.original.service_zone?.name

          return <TextCell text={serviceZoneName || t("general.notAvailable")} />
        },
      }),
      columnHelper.display({
        id: "enabled_in_store",
        header: () => t("fields.enabledInStore"),
        cell: ({ row }) => {
          let text = t("general.notAvailable")
          const val = row.original.rules?.find(
            (r) => r.attribute === "enabled_in_store"
          )

          if (val) {
            text = val.value === "true" ? t("general.yes") : t("general.no")
          }

          return <TextCell text={text} />
        },
      }),
      columnHelper.display({
        id: "is_return",
        header: () => t("fields.isReturn"),
        cell: ({ row }) => {
          let text = t("general.notAvailable")
          const val = row.original.rules?.find(
            (r) => r.attribute === "is_return"
          )

          if (val) {
            text = val.value === "true" ? t("general.yes") : t("general.no")
          }

          return <TextCell text={text} />
        },
      }),
      columnHelper.accessor("created_at", {
        header: () => t("fields.createdAt"),

        cell: ({ getValue }) => {
          return <DateCell date={getValue()} />
        },
      }),
    ],
    [t]
  )
}

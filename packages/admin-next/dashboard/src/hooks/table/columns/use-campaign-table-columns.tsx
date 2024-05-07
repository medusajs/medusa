import { createColumnHelper } from "@tanstack/react-table"

import { CampaignResponse } from "@medusajs/types"
import { useMemo } from "react"
import { useTranslation } from "react-i18next"
import { DateCell } from "../../../components/table/table-cells/common/date-cell"
import {
  TextCell,
  TextHeader,
} from "../../../components/table/table-cells/common/text-cell"
import {
  DescriptionCell,
  DescriptionHeader,
} from "../../../components/table/table-cells/sales-channel/description-cell"
import {
  NameCell,
  NameHeader,
} from "../../../components/table/table-cells/sales-channel/name-cell"

const columnHelper = createColumnHelper<CampaignResponse>()

export const useCampaignTableColumns = () => {
  const { t } = useTranslation()

  return useMemo(
    () => [
      columnHelper.accessor("name", {
        header: () => <NameHeader />,
        cell: ({ getValue }) => <NameCell name={getValue()} />,
      }),
      columnHelper.accessor("description", {
        header: () => <DescriptionHeader />,
        cell: ({ getValue }) => <DescriptionCell description={getValue()} />,
      }),
      columnHelper.accessor("campaign_identifier", {
        header: () => <TextHeader text={t("campaigns.fields.identifier")} />,
        cell: ({ getValue }) => {
          const value = getValue()
          return <TextCell text={value} />
        },
      }),
      columnHelper.accessor("starts_at", {
        header: () => <TextHeader text={t("campaigns.fields.start_date")} />,
        cell: ({ getValue }) => {
          const value = getValue()

          if (!value) {
            return
          }

          const date = new Date(value)

          return <DateCell date={date} />
        },
      }),
      columnHelper.accessor("ends_at", {
        header: () => <TextHeader text={t("campaigns.fields.end_date")} />,
        cell: ({ getValue }) => {
          const value = getValue()

          if (!value) {
            return
          }

          const date = new Date(value)

          return <DateCell date={date} />
        },
      }),
    ],
    [t]
  )
}

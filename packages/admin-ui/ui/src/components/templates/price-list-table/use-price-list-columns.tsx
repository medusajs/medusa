import { PriceList } from "@medusajs/medusa"
import { isArray } from "lodash"
import { useMemo } from "react"
import { Column } from "react-table"
import { useTranslation } from "react-i18next"
import Actionables from "../../molecules/actionables"
import Table from "../../molecules/table"
import usePriceListActions from "./use-price-list-actions"
import { formatPriceListGroups, getPriceListStatus } from "./utils"

export const usePriceListTableColumns = () => {
  const { t } = useTranslation()
  const columns = useMemo<Column<PriceList>[]>(
    () => [
      {
        Header: t("price-list-table-name", "Name"),
        accessor: "name",
        Cell: ({ cell: { value } }) => (
          <Table.Cell>
            <span className="inter-small-regular">{value}</span>
          </Table.Cell>
        ),
      },
      {
        Header: t("price-list-table-description", "Description"),
        accessor: "description",
        Cell: ({ cell: { value } }) => <Table.Cell>{value}</Table.Cell>,
      },
      {
        Header: t("price-list-table-status", "Status"),
        accessor: "status",
        Cell: ({ row: { original } }) => (
          <Table.Cell>{getPriceListStatus(original)}</Table.Cell>
        ),
      },
      {
        Header: t("price-list-table-groups", "Groups"),
        accessor: "customer_groups",
        Cell: ({ cell: { value } }) => {
          const groups: string[] = isArray(value)
            ? value.map((v) => v.name)
            : []
          const [group, other] = formatPriceListGroups(groups)
          return (
            <Table.Cell>
              {group}
              {other && (
                <span className="text-grey-40">
                  {" "}
                  {t("price-list-table-other-more", "+ {{other}} more", {
                    other,
                  })}
                </span>
              )}
            </Table.Cell>
          )
        },
      },
      {
        accessor: "created_at",
        Cell: ({ row: { original: priceList } }) => {
          const { getActions } = usePriceListActions(priceList)
          return (
            <Table.Cell
              onClick={(e) => e.stopPropagation()}
              className="flex w-full justify-end"
            >
              <div className="justify-end">
                <Actionables forceDropdown actions={getActions()} />
              </div>
            </Table.Cell>
          )
        },
      },
    ],
    []
  )

  return [columns] as const
}

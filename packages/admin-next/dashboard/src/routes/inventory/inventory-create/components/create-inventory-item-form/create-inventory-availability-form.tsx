import { useMemo } from "react"

import { HttpTypes } from "@medusajs/types"
import { UseFormReturn } from "react-hook-form"
import { useTranslation } from "react-i18next"
import { DataGrid } from "../../../../../components/data-grid"
import { createDataGridHelper } from "../../../../../components/data-grid/utils"
import { useRouteModal } from "../../../../../components/modals"
import { useStockLocations } from "../../../../../hooks/api/stock-locations"

type Props = {
  form: UseFormReturn<{}>
}

export const CreateInventoryAvailabilityForm = ({ form }: Props) => {
  const { isPending, stock_locations = [] } = useStockLocations({ limit: 999 })
  const { setCloseOnEscape } = useRouteModal()

  const columns = useColumns()

  return (
    <div className="size-full">
      <DataGrid
        isLoading={isPending}
        columns={columns}
        data={stock_locations}
        state={form}
        onEditingChange={(editing) => setCloseOnEscape(!editing)}
      />
    </div>
  )
}

const columnHelper = createDataGridHelper<HttpTypes.AdminStockLocation>()

const useColumns = () => {
  const { t } = useTranslation()

  return useMemo(
    () => [
      columnHelper.column({
        id: "location",
        header: () => (
          <div className="flex size-full items-center overflow-hidden">
            <span className="truncate">{t("locations.domain")}</span>
          </div>
        ),
        cell: ({ row }) => {
          return (
            <DataGrid.ReadonlyCell>{row.original.name}</DataGrid.ReadonlyCell>
          )
        },
        disableHiding: true,
      }),
      columnHelper.column({
        id: "in-stock",
        name: t("fields.inStock"),
        header: t("fields.inStock"),
        cell: (context) => {
          return (
            <DataGrid.NumberCell
              min={0}
              placeholder="0"
              context={context}
              field={`locations.${context.row.original.id}`}
            />
          )
        },
        disableHiding: true,
      }),
    ],
    [t]
  )
}

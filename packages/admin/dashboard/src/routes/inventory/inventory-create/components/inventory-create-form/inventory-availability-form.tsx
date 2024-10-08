import { HttpTypes } from "@medusajs/types"
import { useMemo } from "react"
import { UseFormReturn } from "react-hook-form"
import { useTranslation } from "react-i18next"

import {
  DataGrid,
  createDataGridHelper,
} from "../../../../../components/data-grid"
import { useRouteModal } from "../../../../../components/modals"
import { CreateInventoryItemSchema } from "./schema"

type InventoryAvailabilityFormProps = {
  form: UseFormReturn<CreateInventoryItemSchema>
  locations: HttpTypes.AdminStockLocation[]
}

export const InventoryAvailabilityForm = ({
  form,
  locations,
}: InventoryAvailabilityFormProps) => {
  const { setCloseOnEscape } = useRouteModal()

  const columns = useColumns()

  return (
    <div className="size-full">
      <DataGrid
        columns={columns}
        data={locations}
        state={form}
        onEditingChange={(editing) => setCloseOnEscape(!editing)}
      />
    </div>
  )
}

const columnHelper = createDataGridHelper<
  HttpTypes.AdminStockLocation,
  CreateInventoryItemSchema
>()

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
        cell: (context) => {
          return (
            <DataGrid.ReadonlyCell context={context}>
              {context.row.original.name}
            </DataGrid.ReadonlyCell>
          )
        },
        disableHiding: true,
      }),
      columnHelper.column({
        id: "in-stock",
        name: t("fields.inStock"),
        header: t("fields.inStock"),
        field: (context) => `locations.${context.row.original.id}`,
        type: "number",
        cell: (context) => {
          return <DataGrid.NumberCell placeholder="0" context={context} />
        },
        disableHiding: true,
      }),
    ],
    [t]
  )
}

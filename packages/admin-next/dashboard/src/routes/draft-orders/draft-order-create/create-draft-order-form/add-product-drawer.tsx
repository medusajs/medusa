import { PricedVariant } from "@medusajs/medusa/dist/types/pricing"
import { Button, Checkbox } from "@medusajs/ui"
import { RowSelectionState, createColumnHelper } from "@tanstack/react-table"
import { useAdminVariants } from "medusa-react"
import { useMemo, useState } from "react"
import { useTranslation } from "react-i18next"
import { SplitView } from "../../../../components/layout/split-view"
import { DataTable } from "../../../../components/table/data-table"
import { MoneyAmountCell } from "../../../../components/table/table-cells/common/money-amount-cell"
import { PlaceholderCell } from "../../../../components/table/table-cells/common/placeholder-cell"
import { ProductCell } from "../../../../components/table/table-cells/product/product-cell"
import { useDataTable } from "../../../../hooks/use-data-table"

type AddVariantDrawerProps = {
  onSave: () => void
  regionId?: string
  customerId?: string
  currencyCode?: string
}

const PAGE_SIZE = 50

export const AddVariantDrawer = ({
  regionId,
  customerId,
  currencyCode,
}: AddVariantDrawerProps) => {
  const [rowSelection, setRowSelection] = useState<RowSelectionState>({})

  const { t } = useTranslation()

  const { variants, count, isLoading, isError, error } = useAdminVariants({
    region_id: regionId,
    customer_id: customerId,
  })

  const columns = useVariantTableColumns()

  const { table } = useDataTable({
    data: variants || [],
    columns,
    count,
    pageSize: PAGE_SIZE,
    enablePagination: true,
    enableRowSelection: true,
    getRowId: (row) => row.id!,
    meta: {
      currencyCode,
    },
  })

  if (isError) {
    throw error
  }

  return (
    <div className="flex size-full flex-col overflow-hidden">
      <DataTable
        table={table}
        columns={columns}
        count={count}
        isLoading={isLoading}
        queryObject={{}}
        pageSize={PAGE_SIZE}
        pagination
        search
        layout="fill"
      />
      <div className="flex items-center justify-end gap-x-2 border-t p-4">
        <SplitView.Close type="button" asChild>
          <Button variant="secondary" size="small">
            {t("actions.cancel")}
          </Button>
        </SplitView.Close>
        <Button size="small" type="button">
          {t("actions.save")}
        </Button>
      </div>
    </div>
  )
}

const columnHelper = createColumnHelper<PricedVariant>()

const useVariantTableColumns = () => {
  const { t } = useTranslation()

  return useMemo(
    () => [
      columnHelper.display({
        id: "select",
        header: ({ table }) => {
          return (
            <Checkbox
              checked={
                table.getIsSomePageRowsSelected()
                  ? "indeterminate"
                  : table.getIsAllPageRowsSelected()
              }
              onCheckedChange={(value) =>
                table.toggleAllPageRowsSelected(!!value)
              }
            />
          )
        },
        cell: ({ row }) => {
          return (
            <Checkbox
              checked={row.getIsSelected()}
              onCheckedChange={(value) => row.toggleSelected(!!value)}
              onClick={(e) => {
                e.stopPropagation()
              }}
            />
          )
        },
      }),
      columnHelper.accessor("product", {
        header: t("fields.product"),
        cell: ({ getValue }) => {
          const product = getValue()

          if (!product) {
            return <PlaceholderCell />
          }

          return <ProductCell product={product} />
        },
      }),
      columnHelper.accessor("options", {
        header: t("fields.variant"),
        cell: ({ getValue }) => {
          const options = getValue()

          const displayValue = options?.map((o) => o.value).join(" · ")

          return (
            <div className="flex size-full items-center overflow-hidden">
              <span className="truncate">{displayValue}</span>
            </div>
          )
        },
      }),
      columnHelper.accessor("sku", {
        header: t("fields.sku"),
        cell: ({ getValue }) => {
          const sku = getValue()

          return (
            <div className="flex size-full items-center overflow-hidden">
              <span className="truncate">{sku ?? "-"}</span>
            </div>
          )
        },
      }),
      columnHelper.accessor("calculated_price_incl_tax", {
        header: () => (
          <div className="flex size-full items-center justify-end overflow-hidden text-right">
            <span className="truncate">{t("fields.price")}</span>
          </div>
        ),
        cell: ({ getValue, table }) => {
          const price = getValue()
          const { currencyCode } = table.options.meta as {
            currencyCode?: string
          }

          if (!price || !currencyCode) {
            return <PlaceholderCell />
          }

          return (
            <MoneyAmountCell
              align="right"
              amount={price}
              currencyCode={currencyCode}
            />
          )
        },
      }),
    ],
    [t]
  )
}

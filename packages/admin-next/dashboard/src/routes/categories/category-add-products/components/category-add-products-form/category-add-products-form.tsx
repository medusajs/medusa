import { zodResolver } from "@hookform/resolvers/zod"
import { Product, ProductCategory } from "@medusajs/medusa"
import { Button, Checkbox, Tooltip } from "@medusajs/ui"
import {
  OnChangeFn,
  RowSelectionState,
  createColumnHelper,
} from "@tanstack/react-table"
import {
  adminProductKeys,
  useAdminAddProductsToCategory,
  useAdminProducts,
} from "medusa-react"
import { useMemo, useState } from "react"
import { useForm } from "react-hook-form"
import { useTranslation } from "react-i18next"
import { z } from "zod"
import {
  RouteFocusModal,
  useRouteModal,
} from "../../../../../components/route-modal"
import { DataTable } from "../../../../../components/table/data-table"
import { useProductTableColumns } from "../../../../../hooks/table/columns/use-product-table-columns"
import { useProductTableFilters } from "../../../../../hooks/table/filters/use-product-table-filters"
import { useProductTableQuery } from "../../../../../hooks/table/query/use-product-table-query"
import { useDataTable } from "../../../../../hooks/use-data-table"
import { queryClient } from "../../../../../lib/medusa"

type CategoryAddProductsFormProps = {
  category: ProductCategory
}

const CategoryAddProductsSchema = z.object({
  product_ids: z.array(z.string()).min(1),
})

const PAGE_SIZE = 50
const PREFIX = "ap"

export const CategoryAddProductsForm = ({
  category,
}: CategoryAddProductsFormProps) => {
  const [rowSelection, setRowSelection] = useState<RowSelectionState>({})

  const { t } = useTranslation()
  const { handleSuccess } = useRouteModal()

  const form = useForm<z.infer<typeof CategoryAddProductsSchema>>({
    defaultValues: {
      product_ids: [],
    },
    resolver: zodResolver(CategoryAddProductsSchema),
  })

  const updater: OnChangeFn<RowSelectionState> = (fn) => {
    const value = typeof fn === "function" ? fn(rowSelection) : fn

    const ids = Object.keys(value)

    form.setValue("product_ids", ids, {
      shouldDirty: true,
      shouldTouch: true,
    })

    setRowSelection(value)
  }

  const { searchParams, raw } = useProductTableQuery({
    pageSize: PAGE_SIZE,
    prefix: PREFIX,
  })
  const { products, count, isLoading, isError, error } = useAdminProducts(
    {
      expand: "variants,collection,categories,sales_channels",
      ...searchParams,
    },
    {
      keepPreviousData: true,
    }
  )

  const columns = useColumns()
  const filters = useProductTableFilters()

  const { table } = useDataTable({
    data: (products || []) as Product[],
    columns,
    count,
    enablePagination: true,
    enableRowSelection: (row) => {
      const inCategories = row.original.categories?.map((c) => c.id)

      return !inCategories.includes(category.id)
    },
    getRowId: (row) => row.id,
    rowSelection: {
      state: rowSelection,
      updater,
    },
    pageSize: PAGE_SIZE,
    prefix: PREFIX,
  })

  const { mutateAsync, isLoading: isSubmitting } =
    useAdminAddProductsToCategory(category.id)

  const handleSubmit = form.handleSubmit(async (data) => {
    const { product_ids } = data

    await mutateAsync(
      {
        product_ids: product_ids.map((id) => ({ id })),
      },
      {
        onSuccess: () => {
          queryClient.invalidateQueries(adminProductKeys.lists())
          handleSuccess()
        },
      }
    )
  })

  if (isError) {
    throw error
  }

  return (
    <RouteFocusModal.Form form={form}>
      <form
        onSubmit={handleSubmit}
        className="flex h-full flex-col overflow-hidden"
      >
        <RouteFocusModal.Header>
          <div className="flex items-center justify-end gap-x-2">
            <RouteFocusModal.Close asChild>
              <Button variant="secondary" size="small">
                {t("actions.cancel")}
              </Button>
            </RouteFocusModal.Close>
            <Button
              type="submit"
              variant="primary"
              size="small"
              isLoading={isSubmitting}
            >
              {t("actions.save")}
            </Button>
          </div>
        </RouteFocusModal.Header>
        <RouteFocusModal.Body className="overflow-hidden">
          <DataTable
            table={table}
            columns={columns}
            count={count}
            pageSize={PAGE_SIZE}
            filters={filters}
            layout="fill"
            queryObject={raw}
            prefix={PREFIX}
            orderBy={["title", "created_at", "updated_at"]}
            isLoading={isLoading}
            search
            pagination
          />
        </RouteFocusModal.Body>
      </form>
    </RouteFocusModal.Form>
  )
}

const columnHelper = createColumnHelper<Product>()

const useColumns = () => {
  const { t } = useTranslation()
  const base = useProductTableColumns()

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
          const isPreselected = !row.getCanSelect()

          const Component = (
            <Checkbox
              checked={row.getIsSelected() || isPreselected}
              disabled={isPreselected}
              onCheckedChange={(value) => row.toggleSelected(!!value)}
              onClick={(e) => {
                e.stopPropagation()
              }}
            />
          )

          if (isPreselected) {
            return (
              <Tooltip content={t("categories.products.alreadyAddedTooltip")}>
                {Component}
              </Tooltip>
            )
          }

          return Component
        },
      }),
      ...base,
    ],
    [base, t]
  )
}

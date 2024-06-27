import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"

import { HttpTypes } from "@medusajs/types"
import { Button, Checkbox, Hint, Tooltip, toast } from "@medusajs/ui"
import {
  OnChangeFn,
  RowSelectionState,
  createColumnHelper,
} from "@tanstack/react-table"
import { useMemo, useState } from "react"
import { useTranslation } from "react-i18next"
import {
  RouteFocusModal,
  useRouteModal,
} from "../../../../../components/modals"
import { DataTable } from "../../../../../components/table/data-table"
import { useUpdateProductCategoryProducts } from "../../../../../hooks/api/categories"
import { useProducts } from "../../../../../hooks/api/products"
import { useProductTableColumns } from "../../../../../hooks/table/columns/use-product-table-columns"
import { useProductTableFilters } from "../../../../../hooks/table/filters/use-product-table-filters"
import { useProductTableQuery } from "../../../../../hooks/table/query/use-product-table-query"
import { useDataTable } from "../../../../../hooks/use-data-table"

type EditCategoryProductsFormProps = {
  categoryId: string
  products?: HttpTypes.AdminProduct[]
}

const EditCategoryProductsSchema = z.object({
  product_ids: z.array(z.string()),
})

const PAGE_SIZE = 50
const PREFIX = "p"

export const EditCategoryProductsForm = ({
  categoryId,
  products = [],
}: EditCategoryProductsFormProps) => {
  const { t } = useTranslation()
  const { handleSuccess } = useRouteModal()

  const [selection, setSelection] = useState<RowSelectionState>(
    products.reduce((acc, p) => {
      acc[p.id!] = true
      return acc
    }, {} as RowSelectionState)
  )

  const form = useForm<z.infer<typeof EditCategoryProductsSchema>>({
    defaultValues: {
      product_ids: [],
    },
    resolver: zodResolver(EditCategoryProductsSchema),
  })

  const updater: OnChangeFn<RowSelectionState> = (newSelection) => {
    const value =
      typeof newSelection === "function"
        ? newSelection(selection)
        : newSelection

    form.setValue("product_ids", Object.keys(value), {
      shouldDirty: true,
      shouldTouch: true,
    })

    setSelection(value)
  }

  const { searchParams, raw } = useProductTableQuery({
    pageSize: PAGE_SIZE,
    prefix: PREFIX,
  })

  const {
    products: data,
    count,
    isPending,
    isError,
    error,
  } = useProducts({
    ...searchParams,
    category_id: [categoryId],
  })

  const columns = useColumns()
  const filters = useProductTableFilters(["categories"])

  const { table } = useDataTable({
    data,
    columns,
    getRowId: (original) => original.id,
    count,
    pageSize: PAGE_SIZE,
    prefix: PREFIX,
    enableRowSelection: (row) => {
      return !products.some((p) => p.id === row.original.id)
    },
    enablePagination: true,
    rowSelection: {
      state: selection,
      updater,
    },
  })

  const { mutateAsync, isPending: isMutating } =
    useUpdateProductCategoryProducts(categoryId)

  const handleSubmit = form.handleSubmit(async (data) => {
    await mutateAsync(
      {
        add: data.product_ids,
      },
      {
        onSuccess: () => {
          toast.success(t("general.success"), {
            description: t("categories.products.add.disabledTooltip", {
              count: data.product_ids.length,
            }),
            dismissable: true,
            dismissLabel: t("actions.close"),
          })

          handleSuccess()
        },
        onError: (error) => {
          toast.error(t("general.error"), {
            description: error.message,
            dismissable: true,
            dismissLabel: t("actions.close"),
          })
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
            {form.formState.errors.product_ids && (
              <Hint variant="error">
                {form.formState.errors.product_ids.message}
              </Hint>
            )}
            <RouteFocusModal.Close asChild>
              <Button size="small" variant="secondary">
                {t("actions.cancel")}
              </Button>
            </RouteFocusModal.Close>
            <Button size="small" type="submit" isLoading={isMutating}>
              {t("actions.save")}
            </Button>
          </div>
        </RouteFocusModal.Header>
        <RouteFocusModal.Body className="size-full overflow-hidden">
          <DataTable
            table={table}
            columns={columns}
            pageSize={PAGE_SIZE}
            count={count}
            queryObject={raw}
            filters={filters}
            orderBy={["title", "created_at", "updated_at"]}
            prefix={PREFIX}
            isLoading={isPending}
            layout="fill"
            pagination
            search
          />
        </RouteFocusModal.Body>
      </form>
    </RouteFocusModal.Form>
  )
}

const columnHelper = createColumnHelper<HttpTypes.AdminProduct>()

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
          const isPreSelected = !row.getCanSelect()
          const isSelected = row.getIsSelected() || isPreSelected

          const Component = (
            <Checkbox
              checked={isSelected}
              disabled={isPreSelected}
              onCheckedChange={(value) => row.toggleSelected(!!value)}
              onClick={(e) => {
                e.stopPropagation()
              }}
            />
          )

          if (isPreSelected) {
            return (
              <Tooltip
                content={t("categories.products.add.disabledTooltip")}
                side="right"
              >
                {Component}
              </Tooltip>
            )
          }

          return Component
        },
      }),
      ...base,
    ],
    [t, base]
  )
}

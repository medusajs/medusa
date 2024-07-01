import { zodResolver } from "@hookform/resolvers/zod"
import { HttpTypes } from "@medusajs/types"
import { Button, Checkbox, Hint, Tooltip, toast } from "@medusajs/ui"
import { keepPreviousData } from "@tanstack/react-query"
import {
  OnChangeFn,
  RowSelectionState,
  createColumnHelper,
} from "@tanstack/react-table"
import { useEffect, useMemo, useState } from "react"
import { useForm } from "react-hook-form"
import { useTranslation } from "react-i18next"
import * as zod from "zod"
import {
  RouteFocusModal,
  useRouteModal,
} from "../../../../../components/modals/index.ts"
import { DataTable } from "../../../../../components/table/data-table/data-table.tsx"
import { useUpdateCollectionProducts } from "../../../../../hooks/api/collections.tsx"
import { useProducts } from "../../../../../hooks/api/products.tsx"
import { useProductTableColumns } from "../../../../../hooks/table/columns/use-product-table-columns.tsx"
import { useProductTableFilters } from "../../../../../hooks/table/filters/use-product-table-filters.tsx"
import { useProductTableQuery } from "../../../../../hooks/table/query/use-product-table-query.tsx"
import { useDataTable } from "../../../../../hooks/use-data-table.tsx"

type AddProductsToCollectionFormProps = {
  collection: HttpTypes.AdminCollection
}

const AddProductsToCollectionSchema = zod.object({
  add: zod.array(zod.string()).min(1),
})

const PAGE_SIZE = 50
const PREFIX = "p"

export const AddProductsToCollectionForm = ({
  collection,
}: AddProductsToCollectionFormProps) => {
  const { t } = useTranslation()
  const { handleSuccess } = useRouteModal()

  const form = useForm<zod.infer<typeof AddProductsToCollectionSchema>>({
    defaultValues: {
      add: [],
    },
    resolver: zodResolver(AddProductsToCollectionSchema),
  })

  const { setValue } = form

  const { mutateAsync, isPending: isMutating } = useUpdateCollectionProducts(
    collection.id!
  )

  const [rowSelection, setRowSelection] = useState<RowSelectionState>({})

  const updater: OnChangeFn<RowSelectionState> = (newSelection) => {
    const update =
      typeof newSelection === "function"
        ? newSelection(rowSelection)
        : newSelection

    setValue(
      "add",
      Object.keys(update).filter((k) => update[k]),
      {
        shouldDirty: true,
        shouldTouch: true,
      }
    )

    setRowSelection(update)
  }

  useEffect(() => {
    setValue(
      "add",
      Object.keys(rowSelection).filter((k) => rowSelection[k]),
      {
        shouldDirty: true,
        shouldTouch: true,
      }
    )
  }, [rowSelection, setValue])

  const { searchParams, raw } = useProductTableQuery({
    prefix: PREFIX,
    pageSize: PAGE_SIZE,
  })

  const { products, count, isLoading, isError, error } = useProducts(
    {
      fields: "*variants,*sales_channels",
      ...searchParams,
    },
    {
      placeholderData: keepPreviousData,
    }
  )

  const columns = useColumns()
  const filters = useProductTableFilters(["collections"])

  const { table } = useDataTable({
    data: (products ?? []) as ExtendedProductDTO[],
    columns,
    count,
    pageSize: PAGE_SIZE,
    prefix: PREFIX,
    getRowId: (row) => row.id,
    enableRowSelection: true,
    rowSelection: {
      state: rowSelection,
      updater,
    },
    enablePagination: true,
    meta: {
      collectionId: collection.id,
    },
  })

  const handleSubmit = form.handleSubmit(async (values) => {
    await mutateAsync(
      {
        add: values.add,
      },
      {
        onSuccess: () => {
          handleSuccess()
        },
        onError: (e) => {
          toast.error(t("general.error"), {
            description: e.message,
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
            {form.formState.errors.add && (
              <Hint variant="error">{form.formState.errors.add.message}</Hint>
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
            isLoading={isLoading}
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
        cell: ({ row, table }) => {
          const { collectionId } = table.options.meta as {
            collectionId: string
          }

          const isAdded = row.original.collection_id === collectionId

          const isSelected = row.getIsSelected() || isAdded

          const Component = (
            <Checkbox
              checked={isSelected}
              disabled={isAdded}
              onCheckedChange={(value) => row.toggleSelected(!!value)}
              onClick={(e) => {
                e.stopPropagation()
              }}
            />
          )

          if (isAdded) {
            return (
              <Tooltip
                content={t("salesChannels.productAlreadyAdded")}
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

import { PlusMini } from "@medusajs/icons"
import { HttpTypes } from "@medusajs/types"
import {
  Checkbox,
  CommandBar,
  Container,
  Heading,
  toast,
  usePrompt,
} from "@medusajs/ui"
import { keepPreviousData } from "@tanstack/react-query"
import { RowSelectionState, createColumnHelper } from "@tanstack/react-table"
import { useMemo, useState } from "react"
import { useTranslation } from "react-i18next"

import { ActionMenu } from "../../../../../components/common/action-menu"
import { DataTable } from "../../../../../components/table/data-table"
import { useUpdateProductCategoryProducts } from "../../../../../hooks/api/categories"
import { useProducts } from "../../../../../hooks/api/products"
import { useProductTableColumns } from "../../../../../hooks/table/columns/use-product-table-columns"
import { useProductTableFilters } from "../../../../../hooks/table/filters/use-product-table-filters"
import { useProductTableQuery } from "../../../../../hooks/table/query/use-product-table-query"
import { useDataTable } from "../../../../../hooks/use-data-table"

type CategoryProductSectionProps = {
  category: HttpTypes.AdminProductCategory
}

const PAGE_SIZE = 10

export const CategoryProductSection = ({
  category,
}: CategoryProductSectionProps) => {
  const { t } = useTranslation()
  const prompt = usePrompt()

  const [selection, setSelection] = useState<RowSelectionState>({})

  const { raw, searchParams } = useProductTableQuery({ pageSize: PAGE_SIZE })
  const { products, count, isLoading, isError, error } = useProducts(
    {
      ...searchParams,
      category_id: [category.id],
    },
    {
      placeholderData: keepPreviousData,
    }
  )

  const columns = useColumns()
  const filters = useProductTableFilters(["categories"])

  const { table } = useDataTable({
    data: products || [],
    columns,
    count,
    getRowId: (original) => original.id,
    pageSize: PAGE_SIZE,
    enableRowSelection: true,
    enablePagination: true,
    rowSelection: {
      state: selection,
      updater: setSelection,
    },
  })

  const { mutateAsync } = useUpdateProductCategoryProducts(category.id)

  const handleRemove = async () => {
    const selected = Object.keys(selection)

    const res = await prompt({
      title: t("general.areYouSure"),
      description: t("categories.products.remove.confirmation", {
        count: selected.length,
      }),
      confirmText: t("actions.remove"),
      cancelText: t("actions.cancel"),
    })

    if (!res) {
      return
    }

    await mutateAsync(
      {
        remove: selected,
      },
      {
        onSuccess: () => {
          toast.success(t("general.success"), {
            description: t("categories.products.remove.successToast", {
              count: selected.length,
            }),
            dismissable: true,
            dismissLabel: t("actions.close"),
          })

          setSelection({})
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
  }

  if (isError) {
    throw error
  }

  return (
    <Container className="divide-y p-0">
      <div className="flex items-center justify-between px-6 py-4">
        <Heading level="h2">{t("products.domain")}</Heading>
        <ActionMenu
          groups={[
            {
              actions: [
                {
                  label: t("actions.add"),
                  icon: <PlusMini />,
                  to: "products",
                },
              ],
            },
          ]}
        />
      </div>
      <DataTable
        table={table}
        filters={filters}
        columns={columns}
        orderBy={["title", "created_at", "updated_at"]}
        pageSize={PAGE_SIZE}
        count={count}
        navigateTo={(row) => `/products/${row.id}`}
        isLoading={isLoading}
        queryObject={raw}
      />
      <CommandBar open={!!Object.keys(selection).length}>
        <CommandBar.Bar>
          <CommandBar.Value>
            {t("general.countSelected", {
              count: Object.keys(selection).length,
            })}
          </CommandBar.Value>
          <CommandBar.Seperator />
          <CommandBar.Command
            action={handleRemove}
            label={t("actions.remove")}
            shortcut="r"
          />
        </CommandBar.Bar>
      </CommandBar>
    </Container>
  )
}

const columnHelper = createColumnHelper<HttpTypes.AdminProduct>()

const useColumns = () => {
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
      ...base,
    ],
    [base]
  )
}

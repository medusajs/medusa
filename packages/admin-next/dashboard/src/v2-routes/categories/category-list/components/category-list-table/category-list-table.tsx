import { PencilSquare, TriangleRightMini } from "@medusajs/icons"
import { AdminProductCategoryResponse } from "@medusajs/types"
import { Container, Heading, IconButton, Text, clx } from "@medusajs/ui"
import { keepPreviousData } from "@tanstack/react-query"
import { createColumnHelper } from "@tanstack/react-table"
import { useMemo } from "react"
import { useTranslation } from "react-i18next"
import { ActionMenu } from "../../../../../components/common/action-menu"
import { DataTable } from "../../../../../components/table/data-table"
import { StatusCell } from "../../../../../components/table/table-cells/common/status-cell"
import {
  TextCell,
  TextHeader,
} from "../../../../../components/table/table-cells/common/text-cell"
import { useCategories } from "../../../../../hooks/api/categories"
import { useDataTable } from "../../../../../hooks/use-data-table"
import { useCategoryTableQuery } from "../../../common/hooks/use-category-table-query"
import {
  getCategoryPath,
  getIsActiveProps,
  getIsInternalProps,
} from "../../../common/utils"

const PAGE_SIZE = 20

export const CategoryListTable = () => {
  const { t } = useTranslation()

  const { raw, searchParams } = useCategoryTableQuery({ pageSize: PAGE_SIZE })

  const query = raw.q
    ? {
        include_ancestors_tree: true,
        fields: "id,name,handle,is_active,is_internal,parent_category",
        ...searchParams,
      }
    : {
        include_descendants_tree: true,
        parent_category_id: "null",
        fields: "id,name,category_children,handle,is_internal,is_active",
        ...searchParams,
      }

  const { product_categories, count, isLoading, isError, error } =
    useCategories(
      {
        ...query,
      },
      {
        placeholderData: keepPreviousData,
      }
    )

  const columns = useCategoryTableColumns()

  const { table } = useDataTable({
    data: product_categories || [],
    columns,
    count,
    getRowId: (original) => original.id,
    getSubRows: (original) => original.category_children,
    enableExpandableRows: true,
    pageSize: PAGE_SIZE,
  })

  if (isError) {
    throw error
  }

  return (
    <Container className="divide-y p-0">
      <div className="flex items-center justify-between px-6 py-4">
        <Heading>{t("categories.domain")}</Heading>
      </div>
      <DataTable
        table={table}
        columns={columns}
        count={count}
        pageSize={PAGE_SIZE}
        isLoading={isLoading}
        navigateTo={(row) => row.id}
        queryObject={raw}
        search
        pagination
      />
    </Container>
  )
}

const CategoryRowActions = ({
  category,
}: {
  category: AdminProductCategoryResponse["product_category"]
}) => {
  const { t } = useTranslation()

  return (
    <ActionMenu
      groups={[
        {
          actions: [
            {
              label: t("actions.edit"),
              icon: <PencilSquare />,
              to: `${category.id}/edit`,
            },
          ],
        },
      ]}
    />
  )
}

const columnHelper =
  createColumnHelper<AdminProductCategoryResponse["product_category"]>()

const useCategoryTableColumns = () => {
  const { t } = useTranslation()

  return useMemo(
    () => [
      columnHelper.accessor("name", {
        header: () => <TextHeader text={t("fields.name")} />,
        cell: ({ getValue, row }) => {
          const expandHandler = row.getToggleExpandedHandler()

          console.log(row.original)

          if (row.original.parent_category !== undefined) {
            const path = getCategoryPath(row.original)

            return (
              <div className="flex size-full items-center">
                {path.map((chip) => (
                  <div key={chip.id}>
                    <Text>{chip.name}</Text>
                  </div>
                ))}
              </div>
            )
          }

          return (
            <div className="flex size-full items-center gap-x-3 overflow-hidden">
              <div className="flex size-7 items-center justify-center">
                {row.getCanExpand() ? (
                  <IconButton
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation()
                      e.preventDefault()

                      expandHandler()
                    }}
                    size="small"
                    variant="transparent"
                  >
                    <TriangleRightMini
                      className={clx({
                        "rotate-90 transition-transform will-change-transform":
                          row.getIsExpanded(),
                      })}
                    />
                  </IconButton>
                ) : null}
              </div>
              <span className="truncate">{getValue()}</span>
            </div>
          )
        },
      }),
      columnHelper.accessor("handle", {
        header: () => <TextHeader text={t("fields.handle")} />,
        cell: ({ getValue }) => {
          return <TextCell text={`/${getValue()}`} />
        },
      }),
      columnHelper.accessor("is_active", {
        header: () => <TextHeader text={t("fields.status")} />,
        cell: ({ getValue }) => {
          const { color, label } = getIsActiveProps(getValue(), t)

          return <StatusCell color={color}>{label}</StatusCell>
        },
      }),
      columnHelper.accessor("is_internal", {
        header: () => <TextHeader text={t("categories.fields.visibility")} />,
        cell: ({ getValue }) => {
          const { color, label } = getIsInternalProps(getValue(), t)

          return <StatusCell color={color}>{label}</StatusCell>
        },
      }),
      columnHelper.display({
        id: "actions",
        cell: ({ row }) => {
          return <CategoryRowActions category={row.original} />
        },
      }),
    ],
    [t]
  )
}

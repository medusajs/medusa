import { PencilSquare, Trash, TriangleRightMini } from "@medusajs/icons"
import { ProductCategory } from "@medusajs/medusa"
import {
  Button,
  Container,
  Heading,
  IconButton,
  Table,
  clx,
  usePrompt,
} from "@medusajs/ui"
import {
  PaginationState,
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  getExpandedRowModel,
  useReactTable,
} from "@tanstack/react-table"
import {
  useAdminDeleteProductCategory,
  useAdminProductCategories,
} from "medusa-react"
import { useMemo, useState } from "react"
import { useTranslation } from "react-i18next"
import { Link, useNavigate } from "react-router-dom"

import { ActionMenu } from "../../../../../components/common/action-menu"
import {
  NoRecords,
  NoResults,
} from "../../../../../components/common/empty-table-content"
import { Query } from "../../../../../components/filtering/query"
import { LocalizedTablePagination } from "../../../../../components/localization/localized-table-pagination"
import { StatusCell } from "../../../../../components/table/table-cells/common/status-cell"
import { useQueryParams } from "../../../../../hooks/use-query-params"

const PAGE_SIZE = 50

export const CategoryListTable = () => {
  const { t } = useTranslation()
  const navigate = useNavigate()

  const [{ pageIndex, pageSize }, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: PAGE_SIZE,
  })

  const pagination = useMemo(
    () => ({
      pageIndex,
      pageSize,
    }),
    [pageIndex, pageSize]
  )

  const params = useQueryParams(["q"])
  const { product_categories, count, isLoading, isError, error } =
    useAdminProductCategories(
      {
        limit: PAGE_SIZE,
        offset: pageIndex * PAGE_SIZE,
        parent_category_id: params.q ? undefined : "null",
        include_descendants_tree: true,
        include_ancestors_tree: true,
        ...params,
      },
      {
        keepPreviousData: true,
      }
    )

  const columns = useColumns()

  const table = useReactTable({
    data: product_categories ?? [],
    columns,
    pageCount: Math.ceil((count ?? 0) / PAGE_SIZE),
    state: {
      pagination,
    },
    getSubRows: (row) => row.category_children,
    getExpandedRowModel: getExpandedRowModel(),
    onPaginationChange: setPagination,
    getCoreRowModel: getCoreRowModel(),
    manualPagination: true,
  })

  const noRecords =
    !isLoading &&
    product_categories?.length === 0 &&
    !Object.values(params).filter((v) => Boolean(v)).length

  if (isError) {
    throw error
  }

  return (
    <Container className="divide-y p-0">
      <div className="flex items-center justify-between px-6 py-4">
        <Heading>{t("categories.domain")}</Heading>
        <div className="flex items-center gap-x-2">
          <Button size="small" variant="secondary" asChild>
            <Link to="/categories/edit-order">Edit order</Link>
          </Button>
          <Link to="/categories/create">
            <Button size="small" variant="secondary">
              {t("actions.create")}
            </Button>
          </Link>
        </div>
      </div>
      {!noRecords && (
        <div className="flex items-center justify-between px-6 py-4">
          <div></div>
          <div className="flex items-center gap-x-2">
            <Query />
          </div>
        </div>
      )}
      {noRecords ? (
        <NoRecords />
      ) : (
        <div>
          {!isLoading && !product_categories?.length ? (
            <NoResults />
          ) : (
            <Table>
              <Table.Header className="border-t-0">
                {table.getHeaderGroups().map((headerGroup) => {
                  return (
                    <Table.Row
                      key={headerGroup.id}
                      className="[&_th:last-of-type]:w-[1%] [&_th:last-of-type]:whitespace-nowrap [&_th]:w-1/4"
                    >
                      {headerGroup.headers.map((header) => {
                        return (
                          <Table.HeaderCell key={header.id}>
                            {flexRender(
                              header.column.columnDef.header,
                              header.getContext()
                            )}
                          </Table.HeaderCell>
                        )
                      })}
                    </Table.Row>
                  )
                })}
              </Table.Header>
              <Table.Body className="border-b-0">
                {table.getRowModel().rows.map((row) => {
                  return (
                    <Table.Row
                      key={row.id}
                      className={clx(
                        "transition-fg cursor-pointer [&_td:last-of-type]:w-[1%] [&_td:last-of-type]:whitespace-nowrap",
                        {
                          "bg-ui-bg-highlight hover:bg-ui-bg-highlight-hover":
                            row.getIsSelected(),
                        }
                      )}
                      onClick={() => navigate(`/categories/${row.original.id}`)}
                    >
                      {row.getVisibleCells().map((cell) => (
                        <Table.Cell key={cell.id}>
                          {flexRender(
                            cell.column.columnDef.cell,
                            cell.getContext()
                          )}
                        </Table.Cell>
                      ))}
                    </Table.Row>
                  )
                })}
              </Table.Body>
            </Table>
          )}
          <LocalizedTablePagination
            canNextPage={table.getCanNextPage()}
            canPreviousPage={table.getCanPreviousPage()}
            nextPage={table.nextPage}
            previousPage={table.previousPage}
            count={count ?? 0}
            pageIndex={pageIndex}
            pageCount={table.getPageCount()}
            pageSize={PAGE_SIZE}
          />
        </div>
      )}
    </Container>
  )
}

const CategoryActions = ({ category }: { category: ProductCategory }) => {
  const { mutateAsync } = useAdminDeleteProductCategory(category.id)
  const { t } = useTranslation()
  const prompt = usePrompt()

  const handleDelete = async () => {
    const res = await prompt({
      title: t("general.areYouSure"),
      description: t("categories.deleteWarning", {
        name: category.name,
      }),
      confirmText: t("actions.delete"),
      cancelText: t("actions.cancel"),
    })

    if (!res) {
      return
    }

    await mutateAsync()
  }

  return (
    <ActionMenu
      groups={[
        {
          actions: [
            {
              icon: <PencilSquare />,
              label: t("actions.edit"),
              to: `/categories/${category.id}/edit`,
            },
          ],
        },
        {
          actions: [
            {
              icon: <Trash />,
              label: t("actions.delete"),
              onClick: handleDelete,
            },
          ],
        },
      ]}
    />
  )
}

const columnHelper = createColumnHelper<ProductCategory>()

const useColumns = () => {
  const { t } = useTranslation()

  return useMemo(
    () => [
      columnHelper.accessor("name", {
        header: t("fields.name"),
        cell: ({ getValue, row }) => {
          const name = getValue()
          const hasChildren = !!row.getCanExpand()
          const isRoot = row.depth === 0
          const hasParent = !!row.original.parent_category

          const inset = row.depth * 40

          const text =
            isRoot && hasParent
              ? getPath(row.original)
                  .map((p) => p.name)
                  .join(" / ")
              : name

          return (
            <div
              className="flex items-center gap-x-3 overflow-hidden whitespace-nowrap"
              style={{
                paddingLeft: `${inset}px`,
              }}
            >
              {hasChildren && (
                <IconButton
                  size="small"
                  variant="transparent"
                  onClick={(e) => {
                    e.stopPropagation()
                    row.toggleExpanded()
                  }}
                >
                  <TriangleRightMini
                    className={clx("trasnform transition-transform", {
                      "rotate-90": row.getIsExpanded(),
                    })}
                  />
                </IconButton>
              )}
              <span>{text}</span>
            </div>
          )
        },
      }),
      columnHelper.accessor("handle", {
        header: t("fields.handle"),
        cell: ({ getValue }) => (
          <div className="flex size-full items-center overflow-hidden whitespace-nowrap">
            <span>{`/${getValue()}`}</span>
          </div>
        ),
      }),
      columnHelper.accessor("is_active", {
        header: t("fields.status"),
        cell: ({ getValue }) => {
          const isActive = getValue()

          return (
            <StatusCell color={isActive ? "green" : "red"}>
              {isActive ? t("status.active") : t("status.inactive")}
            </StatusCell>
          )
        },
      }),
      columnHelper.accessor("is_internal", {
        header: t("fields.visibility"),
        cell: ({ getValue }) => {
          const isInternal = getValue()

          return (
            <StatusCell color={isInternal ? "blue" : "green"}>
              {isInternal ? t("status.private") : t("status.public")}
            </StatusCell>
          )
        },
      }),
      columnHelper.display({
        id: "actions",
        cell: ({ row }) => {
          return <CategoryActions category={row.original} />
        },
      }),
    ],
    [t]
  )
}

const getPath = (category: ProductCategory): { name: string; id: string }[] => {
  if (!category.parent_category) {
    return [{ name: category.name, id: category.id }]
  }

  return [
    ...getPath(category.parent_category),
    { name: category.name, id: category.id },
  ]
}

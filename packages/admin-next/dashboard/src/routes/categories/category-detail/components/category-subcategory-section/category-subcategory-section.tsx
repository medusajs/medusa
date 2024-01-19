import { PencilSquare, Trash, TriangleRightMini } from "@medusajs/icons"
import type { ProductCategory } from "@medusajs/medusa"
import {
  Button,
  Container,
  Heading,
  IconButton,
  StatusBadge,
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
import { useQueryParams } from "../../../../../hooks/use-query-params"

type CategorySubcategorySectionProps = {
  category: ProductCategory
}

const PAGE_SIZE = 10

export const CategorySubcategorySection = ({
  category,
}: CategorySubcategorySectionProps) => {
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
        parent_category_id: category.id,
        include_descendants_tree: true,
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
    <Container className="p-0 divide-y">
      <div className="px-6 py-4 flex items-center justify-between">
        <Heading level="h2">{t("categories.subcategories")}</Heading>
        <Link to={`/categories/${category.id}/create`}>
          <Button size="small" variant="secondary">
            {t("general.create")}
          </Button>
        </Link>
      </div>
      {!noRecords && (
        <div className="px-6 py-4 flex items-center justify-between">
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
                {table.getRowModel().rows.map((row) => (
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
                ))}
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
      description: t("categories.deleteCategoryWarning", {
        name: category.name,
      }),
      confirmText: t("general.confirm"),
      cancelText: t("general.cancel"),
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
              label: t("general.edit"),
              to: `/categories/${category.id}/edit`,
            },
          ],
        },
        {
          actions: [
            {
              icon: <Trash />,
              label: t("general.delete"),
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

          return (
            <div className="flex items-center gap-x-2">
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
                    className={clx("transition-transform trasnform", {
                      "rotate-90": row.getIsExpanded(),
                    })}
                  />
                </IconButton>
              )}
              <span>{name}</span>
            </div>
          )
        },
      }),
      columnHelper.accessor("handle", {
        header: t("fields.handle"),
        cell: ({ getValue }) => `/${getValue()}`,
      }),
      columnHelper.accessor("is_active", {
        header: t("fields.status"),
        cell: ({ getValue }) => {
          const isActive = getValue()

          return (
            <StatusBadge color={isActive ? "green" : "red"}>
              {isActive ? t("general.active") : t("general.inactive")}
            </StatusBadge>
          )
        },
      }),
      columnHelper.accessor("is_internal", {
        header: t("fields.visibility"),
        cell: ({ getValue }) => {
          const isInternal = getValue()

          return (
            <StatusBadge color={isInternal ? "blue" : "green"}>
              {isInternal ? t("general.internal") : t("general.public")}
            </StatusBadge>
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

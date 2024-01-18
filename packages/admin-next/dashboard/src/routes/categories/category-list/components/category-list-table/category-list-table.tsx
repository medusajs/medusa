import { ProductCategory } from "@medusajs/medusa"
import { Button, Container, Heading, Table, clx } from "@medusajs/ui"
import {
  PaginationState,
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table"
import { useAdminProductCategories } from "medusa-react"
import { useMemo, useState } from "react"
import { useTranslation } from "react-i18next"
import { Link, useNavigate } from "react-router-dom"
import {
  NoRecords,
  NoResults,
} from "../../../../../components/common/empty-table-content"
import { Query } from "../../../../../components/filtering/query"
import { LocalizedTablePagination } from "../../../../../components/localization/localized-table-pagination"
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
        <Heading>{t("categories.domain")}</Heading>
        <div className="gap-x-2 flex items-center">
          <Link to="/categories/edit-order">
            <Button size="small" variant="secondary">
              Edit order
            </Button>
          </Link>
          <Link to="/categories/create">
            <Button size="small" variant="secondary">
              {t("general.create")}
            </Button>
          </Link>
        </div>
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
                      className=" [&_th:last-of-type]:w-[1%] [&_th:last-of-type]:whitespace-nowrap [&_th]:w-1/3"
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

const columnHelper = createColumnHelper<ProductCategory>()

const useColumns = () => {
  const { t } = useTranslation()

  return useMemo(
    () => [
      columnHelper.accessor("name", {
        header: t("fields.name"),
        cell: ({ getValue }) => getValue(),
      }),
    ],
    [t]
  )
}

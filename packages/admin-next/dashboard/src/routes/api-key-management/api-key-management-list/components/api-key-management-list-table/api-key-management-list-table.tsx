import { PublishableApiKey } from "@medusajs/medusa"
import { Button, Container, Heading, Table, clx } from "@medusajs/ui"
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table"
import { useAdminPublishableApiKeys } from "medusa-react"
import { useMemo } from "react"
import { useTranslation } from "react-i18next"
import { Link } from "react-router-dom"
import { NoRecords } from "../../../../../components/common/empty-table-content"

export const ApiKeyManagementListTable = () => {
  const { publishable_api_keys, isLoading, isError, error } =
    useAdminPublishableApiKeys()

  const columns = useColumns()

  const table = useReactTable({
    data: publishable_api_keys || [],
    columns,
    getCoreRowModel: getCoreRowModel(),
    getRowId: (row) => row.id,
  })

  const { t } = useTranslation()

  if (isLoading) {
    return <div>Loading...</div>
  }

  if (isError) {
    throw error
  }

  return (
    <Container className="p-0">
      <div className="px-6 py-4 flex items-center justify-between">
        <Heading level="h2">{t("apiKeyManagement.domain")}</Heading>
        <Link to="create">
          <Button variant="secondary" size="small">
            {t("general.create")}
          </Button>
        </Link>
      </div>
      <div className="border-ui-border-base border-y">
        {(publishable_api_keys?.length ?? 0) > 0 ? (
          <Table>
            <Table.Header>
              {table.getHeaderGroups().map((headerGroup) => {
                return (
                  <Table.Row
                    key={headerGroup.id}
                    className="[&_th:first-of-type]:w-[1%] [&_th:first-of-type]:whitespace-nowrap [&_th]:w-1/3"
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
        ) : (
          <NoRecords
            action={{
              label: t("apiKeyManagement.createKey"),
              to: "create",
            }}
          />
        )}
      </div>
    </Container>
  )
}

const columnHelper = createColumnHelper<PublishableApiKey>()

const useColumns = () => {
  const { t } = useTranslation()

  const columns = useMemo(
    () => [
      columnHelper.accessor("title", {
        header: t("fields.title"),
        cell: ({ getValue }) => getValue(),
      }),
      columnHelper.accessor("id", {
        header: "ID",
        cell: ({ getValue }) => getValue(),
      }),
    ],
    [t]
  )

  return columns
}

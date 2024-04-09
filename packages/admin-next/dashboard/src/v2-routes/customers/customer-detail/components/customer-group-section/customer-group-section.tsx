import { Customer, CustomerGroup } from "@medusajs/medusa"
import { Container, Heading } from "@medusajs/ui"
import { createColumnHelper } from "@tanstack/react-table"
import { useMemo } from "react"
import { useTranslation } from "react-i18next"
import { useCustomerGroups } from "../../../../../hooks/api/customer-groups"
import {
  AdminCustomerGroupResponse,
  AdminCustomerResponse,
} from "@medusajs/types"
import { DataTable } from "../../../../../components/table/data-table"
import { useDataTable } from "../../../../../hooks/use-data-table"
import { useCustomerGroupTableFilters } from "../../../../customer-groups/customer-group-list/components/customer-group-list-table/use-customer-group-table-filters"
import { t } from "i18next"

type CustomerGroupSectionProps = {
  customer: AdminCustomerResponse["customer"]
}

const PAGE_SIZE = 10

export const CustomerGroupSection = ({
  customer,
}: CustomerGroupSectionProps) => {
  const { customer_groups, count, isLoading, isError, error } =
    useCustomerGroups({
      customers: { id: customer.id },
    })

  const filters = useCustomerGroupTableFilters()
  const columns = useColumns()

  const { table } = useDataTable({
    data: customer_groups ?? [],
    columns,
    count,
    getRowId: (row) => row.id,
    enablePagination: true,
    enableRowSelection: true,
    pageSize: PAGE_SIZE,
  })

  if (isError) {
    throw error
  }

  if (isError) {
    throw error
  }

  return (
    <Container className="divide-y p-0">
      <div className="flex items-center justify-between px-6 py-4">
        <Heading level="h2">{t("customerGroups.domain")}</Heading>
      </div>
      <DataTable
        table={table}
        columns={columns}
        pageSize={PAGE_SIZE}
        isLoading={isLoading}
        count={count}
        navigateTo={(row) => `/customer-groups/${row.id}`}
        filters={filters}
        search
        pagination
        orderBy={["name", "created_at", "updated_at"]}
      />
    </Container>
  )
}

const columnHelper =
  createColumnHelper<AdminCustomerGroupResponse["customer_group"]>()

const useColumns = () => {
  const { t } = useTranslation()

  return useMemo(
    () => [
      columnHelper.display({
        id: "select",
      }),
      columnHelper.accessor("name", {
        header: t("fields.name"),
        cell: ({ getValue }) => getValue(),
      }),
    ],
    [t]
  )
}

import { PencilSquare, Trash } from "@medusajs/icons"
import { Button, Container, Heading, toast, usePrompt } from "@medusajs/ui"
import { createColumnHelper } from "@tanstack/react-table"
import { useMemo } from "react"
import { useTranslation } from "react-i18next"
import { Link } from "react-router-dom"

import { ActionMenu } from "../../../../../components/common/action-menu"
import { DataTable } from "../../../../../components/table/data-table"
import {
  useCustomerGroups,
  useDeleteCustomerGroup,
} from "../../../../../hooks/api/customer-groups"
import { useCustomerGroupTableColumns } from "../../../../../hooks/table/columns/use-customer-group-table-columns"
import { useCustomerGroupTableFilters } from "../../../../../hooks/table/filters/use-customer-group-table-filters"
import { useCustomerGroupTableQuery } from "../../../../../hooks/table/query/use-customer-group-table-query"
import { useDataTable } from "../../../../../hooks/use-data-table"
import { HttpTypes } from "@medusajs/types"

const PAGE_SIZE = 20

export const CustomerGroupListTable = () => {
  const { t } = useTranslation()

  const { searchParams, raw } = useCustomerGroupTableQuery({
    pageSize: PAGE_SIZE,
  })
  const { customer_groups, count, isLoading, isError, error } =
    useCustomerGroups({
      ...searchParams,
      fields: "id,name,customers.id",
    })

  const filters = useCustomerGroupTableFilters()
  const columns = useColumns()

  const { table } = useDataTable({
    data: customer_groups ?? [],
    columns,
    enablePagination: true,
    count,
    getRowId: (row) => row.id,
    pageSize: PAGE_SIZE,
  })

  if (isError) {
    throw error
  }

  return (
    <Container className="divide-y p-0">
      <div className="flex items-center justify-between px-6 py-4">
        <Heading level="h2">{t("customerGroups.domain")}</Heading>
        <Link to="/customer-groups/create">
          <Button size="small" variant="secondary">
            {t("actions.create")}
          </Button>
        </Link>
      </div>
      <DataTable
        table={table}
        columns={columns}
        pageSize={PAGE_SIZE}
        count={count}
        filters={filters}
        search
        pagination
        navigateTo={(row) => `/customer-groups/${row.original.id}`}
        orderBy={["name", "created_at", "updated_at"]}
        queryObject={raw}
        isLoading={isLoading}
      />
    </Container>
  )
}

const CustomerGroupRowActions = ({
  group,
}: {
  group: HttpTypes.AdminCustomerGroup
}) => {
  const { t } = useTranslation()
  const prompt = usePrompt()

  const { mutateAsync } = useDeleteCustomerGroup(group.id)

  const handleDelete = async () => {
    const res = await prompt({
      title: t("customerGroups.delete.title"),
      description: t("customerGroups.delete.description", {
        name: group.name,
      }),
      confirmText: t("actions.delete"),
      cancelText: t("actions.cancel"),
    })

    if (!res) {
      return
    }

    await mutateAsync(undefined, {
      onSuccess: () => {
        toast.success(t("general.success"), {
          description: t("customerGroups.delete.successToast", {
            name: group.name,
          }),
          dismissLabel: t("actions.close"),
        })
      },
      onError: (error) => {
        toast.error(t("general.error"), {
          description: error.message,
          dismissLabel: t("actions.close"),
        })
      },
    })
  }

  return (
    <ActionMenu
      groups={[
        {
          actions: [
            {
              label: t("actions.edit"),
              to: `/customer-groups/${group.id}/edit`,
              icon: <PencilSquare />,
            },
          ],
        },
        {
          actions: [
            {
              label: t("actions.delete"),
              onClick: handleDelete,
              icon: <Trash />,
            },
          ],
        },
      ]}
    />
  )
}

const columnHelper = createColumnHelper<HttpTypes.AdminCustomerGroup>()

const useColumns = () => {
  const columns = useCustomerGroupTableColumns()

  return useMemo(
    () => [
      ...columns,
      columnHelper.display({
        id: "actions",
        cell: ({ row }) => <CustomerGroupRowActions group={row.original} />,
      }),
    ],
    [columns]
  )
}

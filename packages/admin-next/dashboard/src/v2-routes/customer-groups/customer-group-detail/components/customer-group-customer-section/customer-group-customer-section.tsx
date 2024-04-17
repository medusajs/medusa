import { PencilSquare, Trash } from "@medusajs/icons"
import {
  AdminCustomerGroupResponse,
  AdminCustomerResponse,
} from "@medusajs/types"
import { Button, Checkbox, Container, Heading, usePrompt } from "@medusajs/ui"
import { RowSelectionState, createColumnHelper } from "@tanstack/react-table"
import { useMemo, useState } from "react"
import { useTranslation } from "react-i18next"
import { Link } from "react-router-dom"

import { ActionMenu } from "../../../../../components/common/action-menu"
import { DataTable } from "../../../../../components/table/data-table"
import { useRemoveCustomersFromGroup } from "../../../../../hooks/api/customer-groups"
import { useCustomers } from "../../../../../hooks/api/customers"
import { useCustomerTableColumns } from "../../../../../hooks/table/columns/use-customer-table-columns"
import { useCustomerTableFilters } from "../../../../../hooks/table/filters/use-customer-table-filters"
import { useCustomerTableQuery } from "../../../../../hooks/table/query/use-customer-table-query"
import { useDataTable } from "../../../../../hooks/use-data-table"

type CustomerGroupCustomerSectionProps = {
  group: AdminCustomerGroupResponse["customer_group"]
}

const PAGE_SIZE = 10

export const CustomerGroupCustomerSection = ({
  group,
}: CustomerGroupCustomerSectionProps) => {
  const [rowSelection, setRowSelection] = useState<RowSelectionState>({})
  const { t } = useTranslation()
  const prompt = usePrompt()

  const { searchParams, raw } = useCustomerTableQuery({ pageSize: PAGE_SIZE })
  const { customers, count, isLoading, isError, error } = useCustomers({
    ...searchParams,
    groups: group.id,
  })

  const columns = useColumns()
  const filters = useCustomerTableFilters(["groups"])

  const { table } = useDataTable({
    data: customers ?? [],
    columns,
    count,
    getRowId: (row) => row.id,
    enablePagination: true,
    enableRowSelection: true,
    pageSize: PAGE_SIZE,
    rowSelection: {
      state: rowSelection,
      updater: setRowSelection,
    },
    meta: {
      customerGroupId: group.id,
    },
  })

  if (isError) {
    throw error
  }

  const { mutateAsync } = useRemoveCustomersFromGroup(group.id)

  const handleRemove = async () => {
    const keys = Object.keys(rowSelection)

    const res = await prompt({
      title: t("customerGroups.customers.remove.title", {
        count: keys.length,
      }),
      description: t("customerGroups.customers.remove.description", {
        count: keys.length,
      }),
      confirmText: t("actions.continue"),
      cancelText: t("actions.cancel"),
    })

    if (!res) {
      return
    }

    await mutateAsync(
      {
        customer_ids: keys.map((k) => ({ id: k })),
      },
      {
        onSuccess: () => {
          setRowSelection({})
        },
      }
    )
  }

  return (
    <Container className="divide-y p-0">
      <div className="flex items-center justify-between px-6 py-4">
        <Heading level="h2">{t("customers.domain")}</Heading>
        <Link to={`/customer-groups/${group.id}/add-customers`}>
          <Button variant="secondary" size="small">
            {t("general.add")}
          </Button>
        </Link>
      </div>
      <DataTable
        table={table}
        columns={columns}
        pageSize={PAGE_SIZE}
        isLoading={isLoading}
        count={count}
        navigateTo={(row) => `/customers/${row.id}`}
        filters={filters}
        search
        pagination
        orderBy={[
          "email",
          "first_name",
          "last_name",
          "has_account",
          "created_at",
          "updated_at",
        ]}
        queryObject={raw}
        commands={[
          {
            action: handleRemove,
            label: t("actions.remove"),
            shortcut: "r",
          },
        ]}
      />
    </Container>
  )
}

const CustomerActions = ({
  customer,
  customerGroupId,
}: {
  customer: AdminCustomerResponse["customer"]
  customerGroupId: string
}) => {
  const { t } = useTranslation()
  const { mutateAsync } = useRemoveCustomersFromGroup(customerGroupId)

  const prompt = usePrompt()

  const handleRemove = async () => {
    const res = await prompt({
      title: t("customerGroups.customers.remove.title", {
        count: 1,
      }),
      description: t("customerGroups.customers.remove.description", {
        count: 1,
      }),
      confirmText: t("actions.continue"),
      cancelText: t("actions.cancel"),
    })

    if (!res) {
      return
    }

    await mutateAsync({
      customer_ids: [{ id: customer.id }],
    })
  }

  return (
    <ActionMenu
      groups={[
        {
          actions: [
            {
              icon: <PencilSquare />,
              label: t("actions.edit"),
              to: `/customers/${customer.id}/edit`,
            },
          ],
        },
        {
          actions: [
            {
              icon: <Trash />,
              label: t("actions.remove"),
              onClick: handleRemove,
            },
          ],
        },
      ]}
    />
  )
}

const columnHelper = createColumnHelper<AdminCustomerResponse["customer"]>()

const useColumns = () => {
  const columns = useCustomerTableColumns()

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
      ...columns,
      columnHelper.display({
        id: "actions",
        cell: ({ row, table }) => {
          const { customerGroupId } = table.options.meta as {
            customerGroupId: string
          }

          return (
            <CustomerActions
              customer={row.original}
              customerGroupId={customerGroupId}
            />
          )
        },
      }),
    ],
    [columns]
  )
}

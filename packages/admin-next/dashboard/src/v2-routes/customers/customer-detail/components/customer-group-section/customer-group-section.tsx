import {
  AdminCustomerGroupResponse,
  AdminCustomerResponse,
} from "@medusajs/types"
import { Button, Container, Heading, toast, usePrompt } from "@medusajs/ui"
import { createColumnHelper } from "@tanstack/react-table"
import { t } from "i18next"
import { useMemo } from "react"

import { PencilSquare, Trash } from "@medusajs/icons"
import { keepPreviousData } from "@tanstack/react-query"
import { useTranslation } from "react-i18next"
import { ActionMenu } from "../../../../../components/common/action-menu"
import { DataTable } from "../../../../../components/table/data-table"
import {
  useCustomerGroups,
  useRemoveCustomersFromGroup,
} from "../../../../../hooks/api/customer-groups"
import { useCustomerGroupTableColumns } from "../../../../../hooks/table/columns/use-customer-group-table-columns"
import { useCustomerGroupTableFilters } from "../../../../../hooks/table/filters/use-customer-group-table-filters"
import { useCustomerGroupTableQuery } from "../../../../../hooks/table/query/use-customer-group-table-query"
import { useDataTable } from "../../../../../hooks/use-data-table"
import { Link } from "react-router-dom"

type CustomerGroupSectionProps = {
  customer: AdminCustomerResponse["customer"]
}

const PAGE_SIZE = 10

export const CustomerGroupSection = ({
  customer,
}: CustomerGroupSectionProps) => {
  const { raw, searchParams } = useCustomerGroupTableQuery({
    pageSize: PAGE_SIZE,
  })
  const { customer_groups, count, isLoading, isError, error } =
    useCustomerGroups(
      {
        ...searchParams,
        fields: "+customers.id",
        customers: { id: customer.id },
      },
      {
        placeholderData: keepPreviousData,
      }
    )

  const filters = useCustomerGroupTableFilters()
  const columns = useColumns(customer.id)

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
        <Link to={`/customers/${customer.id}/add-customer-groups`}>
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
        navigateTo={(row) => `/customer-groups/${row.id}`}
        filters={filters}
        search
        pagination
        orderBy={["name", "created_at", "updated_at"]}
        queryObject={raw}
      />
    </Container>
  )
}

const CustomerGroupRowActions = ({
  group,
  customerId,
}: {
  group: AdminCustomerGroupResponse["customer_group"]
  customerId: string
}) => {
  const prompt = usePrompt()
  const { t } = useTranslation()

  const { mutateAsync } = useRemoveCustomersFromGroup(group.id)

  const onRemove = async () => {
    const res = await prompt({
      title: t("general.areYouSure"),
      description: t("customers.groups.remove", {
        name: group.name,
      }),
      confirmText: t("actions.remove"),
      cancelText: t("actions.cancel"),
    })

    if (!res) {
      return
    }

    try {
      await mutateAsync({ customer_ids: [customerId] })
    } catch (e) {
      toast.error(t("general.error"), {
        description: e.message,
        dismissLabel: t("general.close"),
      })
    }
  }

  return (
    <ActionMenu
      groups={[
        {
          actions: [
            {
              label: t("actions.edit"),
              icon: <PencilSquare />,
              to: `/customer-groups/${group.id}/edit`,
            },
            {
              label: t("actions.remove"),
              onClick: onRemove,
              icon: <Trash />,
            },
          ],
        },
      ]}
    />
  )
}

const columnHelper =
  createColumnHelper<AdminCustomerGroupResponse["customer_group"]>()

const useColumns = (customerId: string) => {
  const columns = useCustomerGroupTableColumns()

  return useMemo(
    () => [
      ...columns,
      columnHelper.display({
        id: "actions",
        cell: ({ row }) => (
          <CustomerGroupRowActions
            group={row.original}
            customerId={customerId}
          />
        ),
      }),
    ],
    [columns]
  )
}

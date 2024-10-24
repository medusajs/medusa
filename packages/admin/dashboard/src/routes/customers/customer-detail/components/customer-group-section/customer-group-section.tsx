import { HttpTypes } from "@medusajs/types"
import {
  Button,
  Checkbox,
  Container,
  Heading,
  toast,
  usePrompt,
} from "@medusajs/ui"
import { RowSelectionState, createColumnHelper } from "@tanstack/react-table"
import { t } from "i18next"
import { useMemo, useState } from "react"

import { PencilSquare, Trash } from "@medusajs/icons"
import { keepPreviousData } from "@tanstack/react-query"
import { useTranslation } from "react-i18next"
import { Link } from "react-router-dom"
import { ActionMenu } from "../../../../../components/common/action-menu/index.ts"
import { DataTable } from "../../../../../components/table/data-table/index.ts"
import {
  customerGroupsQueryKeys,
  useCustomerGroups,
  useRemoveCustomersFromGroup,
} from "../../../../../hooks/api/customer-groups.tsx"
import { useCustomerGroupTableColumns } from "../../../../../hooks/table/columns/use-customer-group-table-columns.tsx"
import { useCustomerGroupTableFilters } from "../../../../../hooks/table/filters/use-customer-group-table-filters.tsx"
import { useCustomerGroupTableQuery } from "../../../../../hooks/table/query/use-customer-group-table-query.tsx"
import { useDataTable } from "../../../../../hooks/use-data-table.tsx"
import { sdk } from "../../../../../lib/client/index.ts"
import { queryClient } from "../../../../../lib/query-client.ts"
import { useBatchCustomerCustomerGroups } from "../../../../../hooks/api"

type CustomerGroupSectionProps = {
  customer: HttpTypes.AdminCustomer
}

const PAGE_SIZE = 10

export const CustomerGroupSection = ({
  customer,
}: CustomerGroupSectionProps) => {
  const prompt = usePrompt()

  const [rowSelection, setRowSelection] = useState<RowSelectionState>({})
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

  const { mutateAsync: batchCustomerCustomerGroups } =
    useBatchCustomerCustomerGroups(customer.id)

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
    rowSelection: {
      state: rowSelection,
      updater: setRowSelection,
    },
  })

  const handleRemove = async () => {
    const customerGroupIds = Object.keys(rowSelection)

    const res = await prompt({
      title: t("general.areYouSure"),
      description: t("customers.groups.removeMany", {
        groups: customer_groups
          ?.filter((g) => customerGroupIds.includes(g.id))
          .map((g) => g.name)
          .join(","),
      }),
      confirmText: t("actions.remove"),
      cancelText: t("actions.cancel"),
    })

    if (!res) {
      return
    }

    try {
      await batchCustomerCustomerGroups({ remove: customerGroupIds })

      toast.success(
        t("customers.groups.removed.success", {
          groups: customer_groups!
            .filter((cg) => customerGroupIds.includes(cg.id))
            .map((cg) => cg?.name),
        })
      )
    } catch (e) {
      toast.error(e.message)
    }
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
        orderBy={[
          { key: "name", label: t("fields.name") },
          { key: "created_at", label: t("fields.createdAt") },
          { key: "updated_at", label: t("fields.updatedAt") },
        ]}
        commands={[
          {
            action: handleRemove,
            label: t("actions.remove"),
            shortcut: "r",
          },
        ]}
        queryObject={raw}
        noRecords={{
          message: t("customers.groups.list.noRecordsMessage"),
        }}
      />
    </Container>
  )
}

const CustomerGroupRowActions = ({
  group,
  customerId,
}: {
  group: HttpTypes.AdminCustomerGroup
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

    await mutateAsync([customerId], {
      onError: (error) => {
        toast.error(error.message)
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

const columnHelper = createColumnHelper<HttpTypes.AdminCustomerGroup>()

const useColumns = (customerId: string) => {
  const columns = useCustomerGroupTableColumns()

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

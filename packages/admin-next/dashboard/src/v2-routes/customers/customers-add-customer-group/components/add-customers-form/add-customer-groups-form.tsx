import { zodResolver } from "@hookform/resolvers/zod"
import { Button, Checkbox, Hint, Tooltip, toast } from "@medusajs/ui"
import {
  OnChangeFn,
  RowSelectionState,
  createColumnHelper,
} from "@tanstack/react-table"
import { useEffect, useMemo, useState } from "react"
import { useForm } from "react-hook-form"
import { useTranslation } from "react-i18next"
import * as zod from "zod"

import { AdminCustomerGroupResponse } from "@medusajs/types"
import {
  RouteFocusModal,
  useRouteModal,
} from "../../../../../components/route-modal"
import { DataTable } from "../../../../../components/table/data-table"
import {
  useCustomerGroups,
  customerGroupsQueryKeys,
} from "../../../../../hooks/api/customer-groups"
import { useDataTable } from "../../../../../hooks/use-data-table"
import { useCustomerGroupTableColumns } from "../../../../../hooks/table/columns/use-customer-group-table-columns"
import { useCustomerGroupTableQuery } from "../../../../../hooks/table/query/use-customer-group-table-query"
import { useCustomerGroupTableFilters } from "../../../../../hooks/table/filters/use-customer-group-table-filters"
import { client } from "../../../../../lib/client"
import { queryClient } from "../../../../../lib/medusa"

type AddCustomerGroupsFormProps = {
  customerId: string
}

export const AddCustomerGroupsSchema = zod.object({
  customer_group_ids: zod.array(zod.string()).min(1),
})

const PAGE_SIZE = 10

export const AddCustomerGroupsForm = ({
  customerId,
}: AddCustomerGroupsFormProps) => {
  const { t } = useTranslation()
  const { handleSuccess } = useRouteModal()
  const [isPending, setIsPending] = useState(false)

  const form = useForm<zod.infer<typeof AddCustomerGroupsSchema>>({
    defaultValues: {
      customer_group_ids: [],
    },
    resolver: zodResolver(AddCustomerGroupsSchema),
  })

  const { setValue } = form

  const [rowSelection, setRowSelection] = useState<RowSelectionState>({})

  useEffect(() => {
    setValue(
      "customer_group_ids",
      Object.keys(rowSelection).filter((k) => rowSelection[k]),
      {
        shouldDirty: true,
        shouldTouch: true,
      }
    )
  }, [rowSelection, setValue])

  const { searchParams, raw } = useCustomerGroupTableQuery({
    pageSize: PAGE_SIZE,
  })
  const filters = useCustomerGroupTableFilters()

  const {
    customer_groups,
    count,
    isPending: isLoading,
    isError,
    error,
  } = useCustomerGroups({
    fields: "*customers",
    ...searchParams,
  })

  const updater: OnChangeFn<RowSelectionState> = (fn) => {
    const state = typeof fn === "function" ? fn(rowSelection) : fn

    const ids = Object.keys(state)

    setValue("customer_group_ids", ids, {
      shouldDirty: true,
      shouldTouch: true,
    })

    setRowSelection(state)
  }

  const columns = useColumns()

  const { table } = useDataTable({
    data: customer_groups ?? [],
    columns,
    count,
    enablePagination: true,
    enableRowSelection: (row) => {
      return !row.original.customers?.map((c) => c.id).includes(customerId)
    },
    getRowId: (row) => row.id,
    pageSize: PAGE_SIZE,
    rowSelection: {
      state: rowSelection,
      updater,
    },
  })

  const handleSubmit = form.handleSubmit(async (data) => {
    setIsPending(true)
    try {
      /**
       * TODO: use this for now until add customer groups to customers batch is implemented
       */
      const promises = data.customer_group_ids.map((id) =>
        client.customerGroups.addCustomers(id, { customer_ids: [customerId] })
      )

      await Promise.all(promises)

      await queryClient.invalidateQueries({
        queryKey: customerGroupsQueryKeys.lists(),
      })

      handleSuccess(`/customers/${customerId}`)
    } catch (e) {
      toast.error(t("general.error"), {
        description: e.message,
        dismissLabel: t("actions.close"),
      })
    } finally {
      setIsPending(false)
    }
  })

  if (isError) {
    throw error
  }

  return (
    <RouteFocusModal.Form form={form}>
      <form
        className="flex h-full flex-col overflow-hidden"
        onSubmit={handleSubmit}
      >
        <RouteFocusModal.Header>
          <div className="flex items-center justify-end gap-x-2">
            {form.formState.errors.customer_group_ids && (
              <Hint variant="error">
                {form.formState.errors.customer_group_ids.message}
              </Hint>
            )}
            <RouteFocusModal.Close asChild>
              <Button variant="secondary" size="small">
                {t("actions.cancel")}
              </Button>
            </RouteFocusModal.Close>
            <Button
              type="submit"
              variant="primary"
              size="small"
              isLoading={isPending}
            >
              {t("actions.save")}
            </Button>
          </div>
        </RouteFocusModal.Header>
        <RouteFocusModal.Body className="size-full overflow-hidden">
          <DataTable
            table={table}
            columns={columns}
            pageSize={PAGE_SIZE}
            count={count}
            filters={filters}
            orderBy={["name", "created_at", "updated_at"]}
            isLoading={isLoading}
            layout="fill"
            search
            queryObject={raw}
          />
        </RouteFocusModal.Body>
      </form>
    </RouteFocusModal.Form>
  )
}

const columnHelper =
  createColumnHelper<AdminCustomerGroupResponse["customer_group"]>()

const useColumns = () => {
  const { t } = useTranslation()
  const base = useCustomerGroupTableColumns()

  const columns = useMemo(
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
          const isPreSelected = !row.getCanSelect()
          const isSelected = row.getIsSelected() || isPreSelected

          const Component = (
            <Checkbox
              checked={isSelected}
              disabled={isPreSelected}
              onCheckedChange={(value) => row.toggleSelected(!!value)}
              onClick={(e) => {
                e.stopPropagation()
              }}
            />
          )

          if (isPreSelected) {
            return (
              <Tooltip
                content={t("customers.groups.alreadyAddedTooltip")}
                side="right"
              >
                {Component}
              </Tooltip>
            )
          }

          return Component
        },
      }),
      ...base,
    ],
    [t, base]
  )

  return columns
}

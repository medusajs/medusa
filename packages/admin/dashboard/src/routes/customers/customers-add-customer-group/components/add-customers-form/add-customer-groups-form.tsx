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

import { HttpTypes } from "@medusajs/types"
import {
  RouteFocusModal,
  useRouteModal,
} from "../../../../../components/modals"
import { DataTable } from "../../../../../components/table/data-table"
import { KeyboundForm } from "../../../../../components/utilities/keybound-form"
import { useCustomerGroups } from "../../../../../hooks/api/customer-groups"
import { useCustomerGroupTableColumns } from "../../../../../hooks/table/columns/use-customer-group-table-columns"
import { useCustomerGroupTableFilters } from "../../../../../hooks/table/filters/use-customer-group-table-filters"
import { useCustomerGroupTableQuery } from "../../../../../hooks/table/query/use-customer-group-table-query"
import { useDataTable } from "../../../../../hooks/use-data-table"
import { useBatchCustomerCustomerGroups } from "../../../../../hooks/api"

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

  const { mutateAsync: batchCustomerCustomerGroups } =
    useBatchCustomerCustomerGroups(customerId)

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
      await batchCustomerCustomerGroups({ add: data.customer_group_ids })

      toast.success(
        t("customers.groups.add.success", {
          groups: data.customer_group_ids
            .map((id) => customer_groups?.find((g) => g.id === id))
            .filter(Boolean)
            .map((cg) => cg?.name),
        })
      )

      handleSuccess(`/customers/${customerId}`)
    } catch (e) {
      toast.error(e.message)
    } finally {
      setIsPending(false)
    }
  })

  if (isError) {
    throw error
  }

  return (
    <RouteFocusModal.Form form={form}>
      <KeyboundForm
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
          </div>
        </RouteFocusModal.Header>
        <RouteFocusModal.Body className="size-full overflow-hidden">
          <DataTable
            table={table}
            columns={columns}
            pageSize={PAGE_SIZE}
            count={count}
            filters={filters}
            orderBy={[
              { key: "name", label: t("fields.name") },
              { key: "created_at", label: t("fields.createdAt") },
              { key: "updated_at", label: t("fields.updatedAt") },
            ]}
            isLoading={isLoading}
            layout="fill"
            search="autofocus"
            queryObject={raw}
            noRecords={{
              message: t("customers.groups.add.list.noRecordsMessage"),
            }}
          />
        </RouteFocusModal.Body>
        <RouteFocusModal.Footer>
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
        </RouteFocusModal.Footer>
      </KeyboundForm>
    </RouteFocusModal.Form>
  )
}

const columnHelper = createColumnHelper<HttpTypes.AdminCustomerGroup>()

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

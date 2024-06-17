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

import {
  RouteFocusModal,
  useRouteModal,
} from "../../../../../components/route-modal"
import { DataTable } from "../../../../../components/table/data-table"
import { useAddCustomersToGroup } from "../../../../../hooks/api/customer-groups"
import { useCustomers } from "../../../../../hooks/api/customers"
import { useCustomerTableColumns } from "../../../../../hooks/table/columns/use-customer-table-columns"
import { useCustomerTableFilters } from "../../../../../hooks/table/filters/use-customer-table-filters"
import { useCustomerTableQuery } from "../../../../../hooks/table/query/use-customer-table-query"
import { useDataTable } from "../../../../../hooks/use-data-table"
import { HttpTypes } from "@medusajs/types"

type AddCustomersFormProps = {
  customerGroupId: string
}

export const AddCustomersSchema = zod.object({
  customer_ids: zod.array(zod.string()).min(1),
})

const PAGE_SIZE = 10

export const AddCustomersForm = ({
  customerGroupId,
}: AddCustomersFormProps) => {
  const { t } = useTranslation()
  const { handleSuccess } = useRouteModal()

  const form = useForm<zod.infer<typeof AddCustomersSchema>>({
    defaultValues: {
      customer_ids: [],
    },
    resolver: zodResolver(AddCustomersSchema),
  })

  const { setValue } = form

  const [rowSelection, setRowSelection] = useState<RowSelectionState>({})

  useEffect(() => {
    setValue(
      "customer_ids",
      Object.keys(rowSelection).filter((k) => rowSelection[k]),
      {
        shouldDirty: true,
        shouldTouch: true,
      }
    )
  }, [rowSelection, setValue])

  const { searchParams, raw } = useCustomerTableQuery({ pageSize: PAGE_SIZE })
  const filters = useCustomerTableFilters()

  const { customers, count, isLoading, isError, error } = useCustomers({
    fields: "id,email,first_name,last_name,*groups",
    ...searchParams,
  })

  const updater: OnChangeFn<RowSelectionState> = (fn) => {
    const state = typeof fn === "function" ? fn(rowSelection) : fn

    const ids = Object.keys(state)

    setValue("customer_ids", ids, {
      shouldDirty: true,
      shouldTouch: true,
    })

    setRowSelection(state)
  }

  const columns = useColumns()

  const { table } = useDataTable({
    data: customers ?? [],
    columns,
    count,
    enablePagination: true,
    enableRowSelection: (row) => {
      return !row.original.groups?.map((gc) => gc.id).includes(customerGroupId)
    },
    getRowId: (row) => row.id,
    pageSize: PAGE_SIZE,
    rowSelection: {
      state: rowSelection,
      updater,
    },
  })

  const { mutateAsync, isPending } = useAddCustomersToGroup(customerGroupId)

  const handleSubmit = form.handleSubmit(async (data) => {
    await mutateAsync(
      {
        customer_ids: data.customer_ids,
      },
      {
        onSuccess: () => {
          toast.success(t("general.success"), {
            description: t("customerGroups.customers.add.successToast", {
              count: data.customer_ids.length,
            }),
            dismissLabel: t("actions.close"),
          })

          handleSuccess(`/customer-groups/${customerGroupId}`)
        },
      }
    )
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
            {form.formState.errors.customer_ids && (
              <Hint variant="error">
                {form.formState.errors.customer_ids.message}
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
            orderBy={[
              "email",
              "first_name",
              "last_name",
              "has_account",
              "created_at",
              "updated_at",
            ]}
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

const columnHelper = createColumnHelper<HttpTypes.AdminCustomer>()

const useColumns = () => {
  const { t } = useTranslation()
  const base = useCustomerTableColumns()

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
                content={t("customerGroups.customers.alreadyAddedTooltip")}
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

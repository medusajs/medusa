import { HttpTypes } from "@medusajs/types"
import { z } from "zod"
import { useLocalesTableQuery } from "../../../common/hooks/use-locales-table-query"
import { useRouteModal } from "../../../../../components/modals/route-modal-provider"
import { useTranslation } from "react-i18next"
import { useLocales, useUpdateStore } from "../../../../../hooks/api"
import { keepPreviousData } from "@tanstack/react-query"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import {
  createColumnHelper,
  OnChangeFn,
  RowSelectionState,
} from "@tanstack/react-table"
import { useMemo, useState } from "react"
import { useDataTable } from "../../../../../hooks/use-data-table"
import { Button, Checkbox, Hint, toast, Tooltip } from "@medusajs/ui"
import { RouteFocusModal } from "../../../../../components/modals/route-focus-modal"
import { KeyboundForm } from "../../../../../components/utilities/keybound-form"
import { _DataTable } from "../../../../../components/table/data-table"
import { useLocalesTableColumns } from "../../../common/hooks/use-locales-table-columns"

type AddLocalesFormProps = {
  store: HttpTypes.AdminStore
}

const AddLocalesSchema = z.object({
  locales: z.array(z.string()).min(1),
})

const PAGE_SIZE = 50
const PREFIX = "al"

export const AddLocalesForm = ({ store }: AddLocalesFormProps) => {
  const { t } = useTranslation()
  const { handleSuccess } = useRouteModal()

  const { raw, searchParams } = useLocalesTableQuery({
    pageSize: PAGE_SIZE,
    prefix: PREFIX,
  })

  const {
    locales,
    count,
    isPending: isLoading,
    isError,
    error,
  } = useLocales(searchParams, {
    placeholderData: keepPreviousData,
  })

  const form = useForm<z.infer<typeof AddLocalesSchema>>({
    defaultValues: {
      locales: [],
    },
    resolver: zodResolver(AddLocalesSchema),
  })

  const [rowSelection, setRowSelection] = useState<RowSelectionState>({})

  const { setValue } = form

  const updater: OnChangeFn<RowSelectionState> = (fn) => {
    const updated = typeof fn === "function" ? fn(rowSelection) : fn

    const ids = Object.keys(updated)
    setValue("locales", ids, {
      shouldDirty: true,
      shouldTouch: true,
    })

    setRowSelection(updated)
  }

  const preSelectedRows =
    store.supported_locales?.map((l) => l.locale_code) ?? []

  const columns = useColumns()

  const { table } = useDataTable({
    data: locales ?? [],
    columns,
    count: count,
    getRowId: (row) => row.code,
    enableRowSelection: (row) => !preSelectedRows.includes(row.original.code),
    enablePagination: true,
    pageSize: PAGE_SIZE,
    prefix: PREFIX,
    rowSelection: {
      state: rowSelection,
      updater,
    },
  })

  const { mutateAsync, isPending } = useUpdateStore(store.id)

  const handleSubmit = form.handleSubmit(async (data) => {
    const locales = Array.from(
      new Set([...data.locales, ...preSelectedRows])
    ) as string[]

    await mutateAsync(
      {
        supported_locales: locales.map((l) => ({
          locale_code: l,
        })),
      },
      {
        onSuccess: () => {
          toast.success(t("store.toast.localesUpdated"))
          handleSuccess()
        },
        onError: (error) => {
          toast.error(error.message)
        },
      }
    )
  })

  if (isError) {
    throw error
  }

  return (
    <RouteFocusModal.Form form={form}>
      <KeyboundForm
        onSubmit={handleSubmit}
        className="flex h-full flex-col overflow-hidden"
      >
        <RouteFocusModal.Header>
          <div className="flex flex-1 items-center justify-between">
            <div className="flex items-center">
              {form.formState.errors.locales && (
                <Hint variant="error">
                  {form.formState.errors.locales.message}
                </Hint>
              )}
            </div>
          </div>
        </RouteFocusModal.Header>
        <RouteFocusModal.Body className="flex flex-1 flex-col overflow-hidden">
          <_DataTable
            table={table}
            pageSize={PAGE_SIZE}
            count={count}
            columns={columns}
            layout="fill"
            pagination
            search="autofocus"
            prefix={PREFIX}
            orderBy={[
              { key: "name", label: t("fields.name") },
              { key: "code", label: t("fields.code") },
            ]}
            isLoading={isLoading}
            queryObject={raw}
          />
        </RouteFocusModal.Body>
        <RouteFocusModal.Footer>
          <div className="flex items-center justify-end gap-x-2">
            <RouteFocusModal.Close asChild>
              <Button size="small" variant="secondary">
                {t("actions.cancel")}
              </Button>
            </RouteFocusModal.Close>
            <Button size="small" type="submit" isLoading={isPending}>
              {t("actions.save")}
            </Button>
          </div>
        </RouteFocusModal.Footer>
      </KeyboundForm>
    </RouteFocusModal.Form>
  )
}

const columnHelper = createColumnHelper<HttpTypes.AdminLocale>()

const useColumns = () => {
  const { t } = useTranslation()
  const base = useLocalesTableColumns()

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
              <Tooltip content={t("store.localeAlreadyAdded")} side="right">
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
}

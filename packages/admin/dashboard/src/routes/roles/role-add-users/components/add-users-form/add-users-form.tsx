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
import { _DataTable } from "../../../../../components/table/data-table"
import { KeyboundForm } from "../../../../../components/utilities/keybound-form"
import { useAddRbacRoleUsers } from "../../../../../hooks/api/rbac-roles"
import { useUsers } from "../../../../../hooks/api/users"
import { useDataTable } from "../../../../../hooks/use-data-table"
import { useDate } from "../../../../../hooks/use-date"
import { useQueryParams } from "../../../../../hooks/use-query-params"
import { usePermissions } from "../../../../../providers/permissions-provider"

type AddUsersFormProps = {
  roleId: string
}

type UserWithRbacRoles = HttpTypes.AdminUser & {
  rbac_roles?: HttpTypes.AdminRbacRole[] | null
}

const AddUsersSchema = zod.object({
  user_ids: zod.array(zod.string()).min(1),
})

const PAGE_SIZE = 10

export const AddUsersForm = ({ roleId }: AddUsersFormProps) => {
  const { t } = useTranslation()
  const { handleSuccess } = useRouteModal()
  const { hasAllPermissions } = usePermissions()
  const canManageRole = hasAllPermissions(["user:update", "rbac_role:update"])

  const form = useForm<zod.infer<typeof AddUsersSchema>>({
    defaultValues: {
      user_ids: [],
    },
    resolver: zodResolver(AddUsersSchema),
  })

  const { setValue } = form

  const [rowSelection, setRowSelection] = useState<RowSelectionState>({})

  useEffect(() => {
    setValue(
      "user_ids",
      Object.keys(rowSelection).filter((k) => rowSelection[k]),
      {
        shouldDirty: true,
        shouldTouch: true,
      }
    )
  }, [rowSelection, setValue])

  useEffect(() => {
    if (!canManageRole && Object.keys(rowSelection).length) {
      setRowSelection({})
    }
  }, [canManageRole, rowSelection, setRowSelection])

  const queryObject = useQueryParams(["offset", "q", "order"])
  const { offset, q, order } = queryObject

  const {
    users,
    count,
    isPending: isLoading,
    isError,
    error,
  } = useUsers({
    limit: PAGE_SIZE,
    offset: offset ? Number(offset) : 0,
    q,
    order,
    fields: "id,email,first_name,last_name,created_at,rbac_roles.id",
  })

  const updater: OnChangeFn<RowSelectionState> = (fn) => {
    const state = typeof fn === "function" ? fn(rowSelection) : fn

    const ids = Object.keys(state)

    setValue("user_ids", ids, {
      shouldDirty: true,
      shouldTouch: true,
    })

    setRowSelection(state)
  }

  const columns = useColumns({ roleId })

  const { table } = useDataTable({
    data: users ?? [],
    columns,
    count,
    enablePagination: true,
    enableRowSelection: (row) => {
      const rowRoles = (row.original as UserWithRbacRoles)?.rbac_roles ?? []
      return (
        canManageRole && !rowRoles.some((rbacRole) => rbacRole.id === roleId)
      )
    },
    getRowId: (row) => row.id,
    pageSize: PAGE_SIZE,
    rowSelection: {
      state: rowSelection,
      updater,
    },
  })

  const { mutateAsync, isPending } = useAddRbacRoleUsers(roleId)

  const handleSubmit = form.handleSubmit(async (data) => {
    if (!canManageRole) {
      return
    }

    await mutateAsync(data.user_ids, {
      onSuccess: () => {
        toast.success(
          t("roles.users.add.successToast", {
            count: data.user_ids.length,
          })
        )

        handleSuccess(`/settings/roles/${roleId}`)
      },
      onError: (error) => {
        toast.error(error.message)
      },
    })
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
            {form.formState.errors.user_ids && (
              <Hint variant="error">
                {form.formState.errors.user_ids.message}
              </Hint>
            )}
          </div>
        </RouteFocusModal.Header>
        <RouteFocusModal.Body className="size-full overflow-hidden">
          <_DataTable
            table={table}
            columns={columns}
            pageSize={PAGE_SIZE}
            count={count}
            isLoading={isLoading}
            layout="fill"
            search="autofocus"
            orderBy={[
              { key: "email", label: t("fields.email") },
              { key: "first_name", label: t("fields.firstName") },
              { key: "last_name", label: t("fields.lastName") },
              { key: "created_at", label: t("fields.createdAt") },
              { key: "updated_at", label: t("fields.updatedAt") },
            ]}
            queryObject={queryObject}
            noRecords={{
              message: t("roles.users.add.list.noRecordsMessage"),
            }}
          />
        </RouteFocusModal.Body>
        <RouteFocusModal.Footer>
          <RouteFocusModal.Close asChild>
            <Button variant="secondary" size="small">
              {t("actions.cancel")}
            </Button>
          </RouteFocusModal.Close>
          {canManageRole && (
            <Button
              type="submit"
              variant="primary"
              size="small"
              isLoading={isPending}
            >
              {t("actions.save")}
            </Button>
          )}
        </RouteFocusModal.Footer>
      </KeyboundForm>
    </RouteFocusModal.Form>
  )
}

const columnHelper = createColumnHelper<HttpTypes.AdminUser>()

const useColumns = ({ roleId }: { roleId: string }) => {
  const { t } = useTranslation()
  const { getFullDate } = useDate()

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
          const rowRoles = (row.original as UserWithRbacRoles)?.rbac_roles ?? []
          const isAlreadyAdded = rowRoles.some(
            (rbacRole) => rbacRole.id === roleId
          )
          const isSelected = row.getIsSelected() || isAlreadyAdded

          const Component = (
            <Checkbox
              checked={isSelected}
              disabled={isAlreadyAdded}
              onCheckedChange={(value) => row.toggleSelected(!!value)}
              onClick={(e) => {
                e.stopPropagation()
              }}
            />
          )

          if (isAlreadyAdded) {
            return (
              <Tooltip
                content={t("roles.users.alreadyAddedTooltip")}
                side="right"
              >
                {Component}
              </Tooltip>
            )
          }

          return Component
        },
      }),
      columnHelper.accessor("first_name", {
        header: t("fields.firstName"),
        cell: ({ row }) => row.original.first_name || "-",
      }),
      columnHelper.accessor("last_name", {
        header: t("fields.lastName"),
        cell: ({ row }) => row.original.last_name || "-",
      }),
      columnHelper.accessor("email", {
        header: t("fields.email"),
        cell: ({ row }) => row.original.email,
      }),
      columnHelper.accessor("created_at", {
        header: t("fields.createdAt"),
        cell: ({ row }) => getFullDate({ date: row.original.created_at }),
      }),
    ],
    [t, getFullDate, roleId]
  )
}

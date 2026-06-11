import { Trash } from "@medusajs/icons"
import { HttpTypes } from "@medusajs/types"
import { Button, Checkbox, Container, Heading, usePrompt } from "@medusajs/ui"
import { RowSelectionState, createColumnHelper } from "@tanstack/react-table"
import { useEffect, useMemo, useState } from "react"
import { useTranslation } from "react-i18next"
import { Link } from "react-router-dom"

import { ActionMenu } from "../../../../../components/common/action-menu"
import { _DataTable } from "../../../../../components/table/data-table"
import {
  useRbacAssignableRoles,
  useRbacRoleUsers,
  useRemoveRbacRoleUsers,
} from "../../../../../hooks/api/rbac-roles"
import { useDataTable } from "../../../../../hooks/use-data-table"
import { useDate } from "../../../../../hooks/use-date"
import { useQueryParams } from "../../../../../hooks/use-query-params"
import { usePermissions } from "../../../../../providers/permissions-provider"

type RoleUsersSectionProps = {
  role: HttpTypes.AdminRbacRole
}

const PAGE_SIZE = 10

export const RoleUsersSection = ({ role }: RoleUsersSectionProps) => {
  const [rowSelection, setRowSelection] = useState<RowSelectionState>({})
  const { t } = useTranslation()
  const prompt = usePrompt()
  const { offset, order } = useQueryParams(["offset", "order"])
  const { hasAllPermissions } = usePermissions()

  const canManageRole = hasAllPermissions(["user:update", "rbac_role:update"])

  const { data: assignableData } = useRbacAssignableRoles(undefined, {
    enabled: canManageRole,
  })
  const isRoleAssignable = (assignableData?.roles ?? []).some(
    (r) => r.id === role.id
  )

  useEffect(() => {
    if (!isRoleAssignable && Object.keys(rowSelection).length) {
      setRowSelection({})
    }
  }, [isRoleAssignable, rowSelection, setRowSelection])

  const {
    users,
    count,
    isPending: isLoading,
    isError,
    error,
  } = useRbacRoleUsers(role.id, {
    limit: PAGE_SIZE,
    offset: offset ? parseInt(offset) : 0,
    order,
  })

  const columns = useColumns(isRoleAssignable)

  const { table } = useDataTable({
    data: users ?? [],
    columns,
    count,
    getRowId: (row) => row.id,
    enablePagination: true,
    enableRowSelection: isRoleAssignable,
    pageSize: PAGE_SIZE,
    rowSelection: {
      state: rowSelection,
      updater: setRowSelection,
    },
    meta: {
      roleId: role.id,
      isRoleAssignable,
    },
  })

  if (isError) {
    throw error
  }

  const { mutateAsync } = useRemoveRbacRoleUsers(role.id)

  const handleRemove = async () => {
    if (!isRoleAssignable) {
      return
    }

    const keys = Object.keys(rowSelection)

    if (!keys.length) {
      return
    }

    const res = await prompt({
      title: t("roles.users.remove.title", {
        count: keys.length,
      }),
      description: t("roles.users.remove.description", {
        count: keys.length,
      }),
      confirmText: t("actions.continue"),
      cancelText: t("actions.cancel"),
    })

    if (!res) {
      return
    }

    await mutateAsync(keys, {
      onSuccess: () => {
        setRowSelection({})
      },
    })
  }

  return (
    <Container className="divide-y p-0">
      <div className="flex items-center justify-between px-6 py-4">
        <Heading level="h2">{t("users.domain")}</Heading>
        {isRoleAssignable && (
          <Link to="add-users">
            <Button variant="secondary" size="small">
              {t("general.add")}
            </Button>
          </Link>
        )}
      </div>
      <_DataTable
        table={table}
        columns={columns}
        pageSize={PAGE_SIZE}
        isLoading={isLoading}
        count={count}
        navigateTo={(row) => `/settings/users/${row.original.id}`}
        orderBy={[
          { key: "email", label: t("fields.email") },
          { key: "first_name", label: t("fields.firstName") },
          { key: "last_name", label: t("fields.lastName") },
          { key: "created_at", label: t("fields.createdAt") },
          { key: "updated_at", label: t("fields.updatedAt") },
        ]}
        commands={
          isRoleAssignable
            ? [
                {
                  action: handleRemove,
                  label: t("actions.remove"),
                  shortcut: "r",
                },
              ]
            : undefined
        }
        noRecords={{
          message: t("roles.users.list.noRecordsMessage"),
        }}
        pagination
      />
    </Container>
  )
}

const RoleUserActions = ({
  user,
  roleId,
  isRoleAssignable,
}: {
  user: HttpTypes.AdminUser
  roleId: string
  isRoleAssignable: boolean
}) => {
  const { t } = useTranslation()
  const prompt = usePrompt()
  const { mutateAsync } = useRemoveRbacRoleUsers(roleId)

  if (!isRoleAssignable) {
    return null
  }

  const handleRemove = async () => {
    const res = await prompt({
      title: t("roles.users.remove.title", {
        count: 1,
      }),
      description: t("roles.users.remove.description", {
        count: 1,
      }),
      confirmText: t("actions.continue"),
      cancelText: t("actions.cancel"),
    })

    if (!res) {
      return
    }

    await mutateAsync([user.id])
  }

  return (
    <ActionMenu
      groups={[
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

const columnHelper = createColumnHelper<HttpTypes.AdminUser>()

const useColumns = (isRoleAssignable: boolean) => {
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
              disabled={!isRoleAssignable}
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
              disabled={!row.getCanSelect()}
              onCheckedChange={(value) => row.toggleSelected(!!value)}
              onClick={(e) => {
                e.stopPropagation()
              }}
            />
          )
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
      columnHelper.display({
        id: "actions",
        cell: ({ row, table }) => {
          const { roleId, isRoleAssignable: rowisRoleAssignable } = table
            .options.meta as {
            roleId: string
            isRoleAssignable: boolean
          }

          return (
            <RoleUserActions
              user={row.original}
              roleId={roleId}
              isRoleAssignable={rowisRoleAssignable}
            />
          )
        },
      }),
    ],
    [t, getFullDate, isRoleAssignable]
  )
}

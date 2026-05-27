import { PencilSquare, Trash } from "@medusajs/icons"
import { HttpTypes } from "@medusajs/types"
import {
  Container,
  createDataTableColumnHelper,
  toast,
  usePrompt,
} from "@medusajs/ui"
import { keepPreviousData } from "@tanstack/react-query"
import { useCallback, useMemo } from "react"
import { useTranslation } from "react-i18next"
import { useNavigate } from "react-router-dom"

import { DataTable } from "../../../../../components/data-table"
import { useDataTableDateFilters } from "../../../../../components/data-table/helpers/general/use-data-table-date-filters"
import { ListSummary } from "../../../../../components/common/list-summary"
import {
  useDeleteRbacRoleLazy,
  useRbacRoles,
} from "../../../../../hooks/api/rbac-roles"
import { useDate } from "../../../../../hooks/use-date"
import { useQueryParams } from "../../../../../hooks/use-query-params"
import type { Permission } from "../../../../../lib/permissions"
import { usePermissions } from "../../../../../providers/permissions-provider"

const PAGE_SIZE = 20

export const RoleListTable = () => {
  const { t } = useTranslation()
  const { hasPermission } = usePermissions()

  const { q, order, offset, created_at } = useQueryParams([
    "q",
    "order",
    "offset",
    "created_at",
  ])

  const { roles, count, isPending, isError, error } = useRbacRoles(
    {
      q,
      order,
      offset: offset ? parseInt(offset) : undefined,
      limit: PAGE_SIZE,
      created_at: created_at ? JSON.parse(created_at) : undefined,
      fields:
        "id,name,description,created_at,users.id,users.first_name,users.last_name,users.email",
    },
    {
      placeholderData: keepPreviousData,
    }
  )

  const columns = useColumns({ hasPermission })
  const filters = useFilters()

  if (isError) {
    throw error
  }

  const canCreate = hasPermission("rbac_role:create")

  return (
    <Container className="divide-y p-0">
      <DataTable
        data={roles}
        columns={columns}
        filters={filters}
        getRowId={(row) => row.id}
        rowHref={(row) => `${row.id}`}
        rowCount={count}
        pageSize={PAGE_SIZE}
        heading={t("roles.domain")}
        subHeading={t("roles.subtitle")}
        isLoading={isPending}
        action={
          canCreate
            ? {
                label: t("actions.create"),
                to: "create",
              }
            : undefined
        }
        emptyState={{
          empty: {
            heading: t("roles.list.empty.heading"),
            description: t("roles.list.empty.description"),
          },
          filtered: {
            heading: t("roles.list.filtered.heading"),
            description: t("roles.list.filtered.description"),
          },
        }}
      />
    </Container>
  )
}

type RoleWithUsers = HttpTypes.AdminRbacRole & {
  users_link?: { user?: HttpTypes.AdminUser | null }[]
}

const columnHelper = createDataTableColumnHelper<RoleWithUsers>()

const useColumns = ({
  hasPermission,
}: {
  hasPermission: (permission: Permission) => boolean
}) => {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const prompt = usePrompt()
  const { getFullDate } = useDate()

  const { mutateAsync: deleteRole } = useDeleteRbacRoleLazy()

  const handleEdit = useCallback(
    (role: HttpTypes.AdminRbacRole) => {
      navigate(`/settings/roles/${role.id}/edit`)
    },
    [navigate]
  )

  const handleDelete = useCallback(
    async (role: HttpTypes.AdminRbacRole) => {
      const confirmed = await prompt({
        title: t("roles.delete.title"),
        description: t("roles.delete.description", { name: role.name }),
        confirmText: t("actions.delete"),
        cancelText: t("actions.cancel"),
      })

      if (!confirmed) {
        return
      }

      try {
        await deleteRole(role.id)
        toast.success(t("roles.delete.successToast", { name: role.name }))
      } catch (error) {
        toast.error((error as Error).message)
      }
    },
    [prompt, deleteRole, t]
  )

  const canUpdate = hasPermission("rbac_role:update")
  const canDelete = hasPermission("rbac_role:delete")

  return useMemo(() => {
    const baseColumns = [
      columnHelper.accessor("name", {
        header: t("fields.name"),
        enableSorting: true,
        sortAscLabel: t("filters.sorting.alphabeticallyAsc"),
        sortDescLabel: t("filters.sorting.alphabeticallyDesc"),
      }),
      columnHelper.accessor("description", {
        header: t("fields.description"),
        cell: ({ row }) => {
          return row.original.description || "-"
        },
      }),
      columnHelper.display({
        id: "users",
        header: t("users.domain"),
        cell: ({ row }) => {
          const users =
            row.original.users_link
              ?.map((link) => link.user)
              .filter((user): user is HttpTypes.AdminUser => !!user) ?? []

          if (!users.length) {
            return "-"
          }

          const labels = users.map((user) => {
            const fullName = `${user.first_name || ""} ${
              user.last_name || ""
            }`.trim()
            return fullName || user.email || user.id
          })

          return (
            <div className="flex items-center">
              <ListSummary inline n={1} list={labels} />
            </div>
          )
        },
      }),
      columnHelper.accessor("created_at", {
        header: t("fields.createdAt"),
        cell: ({ row }) => {
          return <span>{getFullDate({ date: row.original.created_at })}</span>
        },
        enableSorting: true,
        sortAscLabel: t("filters.sorting.dateAsc"),
        sortDescLabel: t("filters.sorting.dateDesc"),
      }),
    ]

    if (!canUpdate && !canDelete) {
      return baseColumns
    }

    const groups: {
      label: string
      icon: React.ReactNode
      onClick: (ctx: { row: { original: HttpTypes.AdminRbacRole } }) => void
    }[][] = []

    if (canUpdate) {
      groups.push([
        {
          label: t("actions.edit"),
          icon: <PencilSquare />,
          onClick: (ctx) => handleEdit(ctx.row.original),
        },
      ])
    }

    if (canDelete) {
      groups.push([
        {
          label: t("actions.delete"),
          icon: <Trash />,
          onClick: (ctx) => handleDelete(ctx.row.original),
        },
      ])
    }

    return [
      ...baseColumns,
      columnHelper.action({
        actions: groups,
      }),
    ]
  }, [t, getFullDate, handleEdit, handleDelete, canUpdate, canDelete])
}

const useFilters = () => {
  const dateFilters = useDataTableDateFilters()

  return useMemo(() => {
    return dateFilters.filter((filter) => filter.id === "created_at")
  }, [dateFilters])
}

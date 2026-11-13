import { PencilSquare, Trash } from "@medusajs/icons"
import { HttpTypes } from "@medusajs/types"
import { Container, createDataTableColumnHelper, toast } from "@medusajs/ui"
import { keepPreviousData } from "@tanstack/react-query"
import { ReactNode, useCallback, useMemo } from "react"
import { useTranslation } from "react-i18next"
import { useNavigate } from "react-router-dom"

import { DataTable } from "../../../../../components/data-table"
import { useDataTableDateFilters } from "../../../../../components/data-table/helpers/general/use-data-table-date-filters"
import {
  useDeleteRbacRoleLazy,
  useRbacRoles,
} from "../../../../../hooks/api/rbac-roles"
import { useDate } from "../../../../../hooks/use-date"
import { useQueryParams } from "../../../../../hooks/use-query-params"
import {
  useRbacPolicyPermissions,
  useRbacRolePermissions,
} from "../../../../../hooks/use-resource-permissions"
import { SUPER_ADMIN_ROLE_ID } from "../../../common/constants"
import { useConfirmDeleteRole } from "../../../common/hooks"

const PAGE_SIZE = 20

export const RoleListTable = () => {
  const { t } = useTranslation()
  const {
    canCreate: canCreateRole,
    canUpdate,
    canDelete,
  } = useRbacRolePermissions()
  const { canRead: canReadPolicies } = useRbacPolicyPermissions()

  const canCreate = canCreateRole && canReadPolicies

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
      fields: "id,name,description,created_at",
    },
    {
      placeholderData: keepPreviousData,
    }
  )

  const columns = useColumns({ canUpdate, canDelete })
  const filters = useFilters()

  if (isError) {
    throw error
  }

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

const columnHelper = createDataTableColumnHelper<HttpTypes.AdminRbacRole>()

const useColumns = ({
  canUpdate,
  canDelete,
}: {
  canUpdate: boolean
  canDelete: boolean
}) => {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const confirmDelete = useConfirmDeleteRole()
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
      const confirmed = await confirmDelete(role)

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
    [confirmDelete, deleteRole, t]
  )

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

    type RoleAction = {
      label: string
      icon: ReactNode
      onClick: (ctx: { row: { original: HttpTypes.AdminRbacRole } }) => void
    }

    return [
      ...baseColumns,
      columnHelper.action({
        actions: (ctx) => {
          const groups: RoleAction[][] = []

          if (canUpdate) {
            groups.push([
              {
                label: t("actions.edit"),
                icon: <PencilSquare />,
                onClick: (ctx) => handleEdit(ctx.row.original),
              },
            ])
          }

          // The super admin role can't be deleted, the backend rejects it.
          if (canDelete && ctx.row.original.id !== SUPER_ADMIN_ROLE_ID) {
            groups.push([
              {
                label: t("actions.delete"),
                icon: <Trash />,
                onClick: (ctx) => handleDelete(ctx.row.original),
              },
            ])
          }

          return groups
        },
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

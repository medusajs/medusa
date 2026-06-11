import { HttpTypes } from "@medusajs/types"
import { Container, createDataTableColumnHelper } from "@medusajs/ui"
import { keepPreviousData } from "@tanstack/react-query"
import { useMemo } from "react"
import { useTranslation } from "react-i18next"

import { PermissionGuard } from "../../../../../components/common/permission-guard"
import { DataTable } from "../../../../../components/data-table"
import { useRbacPolicyRoles } from "../../../../../hooks/api/rbac-policies"
import { useQueryParams } from "../../../../../hooks/use-query-params"
import { usePermissions } from "../../../../../providers/permissions-provider"

type PolicyRolesSectionProps = {
  policy: HttpTypes.AdminRbacPolicy
}

type RoleWithUsers = HttpTypes.AdminRbacRole & {
  users?: { id: string }[] | null
}

const PAGE_SIZE = 10
const PREFIX = "pr"

export const PolicyRolesSection = ({ policy }: PolicyRolesSectionProps) => {
  const { t } = useTranslation()
  const { offset } = useQueryParams(["offset"], PREFIX)
  const { hasPermission } = usePermissions()
  const canReadRoles = hasPermission("rbac_role:read")

  const { roles, count, isPending, isError, error } = useRbacPolicyRoles(
    policy.id,
    {
      offset: offset ? parseInt(offset) : 0,
      limit: PAGE_SIZE,
    },
    {
      placeholderData: keepPreviousData,
      enabled: canReadRoles,
    }
  )

  const columns = useColumns()

  if (isError) {
    throw error
  }

  return (
    <PermissionGuard permission="rbac_role:read">
      <Container className="divide-y p-0">
        <DataTable
          data={(roles as RoleWithUsers[]) ?? []}
          columns={columns}
          getRowId={(row) => row.id}
          rowHref={(row) => `/settings/roles/${row.id}`}
          rowCount={count}
          pageSize={PAGE_SIZE}
          heading={t("policies.fields.roles")}
          headingLevel="h2"
          isLoading={isPending}
          prefix={PREFIX}
          enableSearch={false}
          emptyState={{
            empty: {
              heading: t("policies.roles.empty.heading"),
              description: t("policies.roles.empty.description"),
            },
            filtered: {
              heading: t("policies.list.filtered.heading"),
              description: t("policies.list.filtered.description"),
            },
          }}
        />
      </Container>
    </PermissionGuard>
  )
}

const columnHelper = createDataTableColumnHelper<RoleWithUsers>()

const useColumns = () => {
  const { t } = useTranslation()

  return useMemo(() => {
    return [
      columnHelper.accessor("name", {
        header: t("fields.name"),
      }),
      columnHelper.accessor("description", {
        header: t("fields.description"),
        cell: ({ row }) => row.original.description || "-",
      }),
      columnHelper.display({
        id: "user_count",
        header: t("policies.fields.users"),
        cell: ({ row }) => {
          const users = row.original.users ?? []
          return <span>{users.length}</span>
        },
      }),
    ]
  }, [t])
}

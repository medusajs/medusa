import { HttpTypes } from "@medusajs/types"
import { Container, createDataTableColumnHelper } from "@medusajs/ui"
import { keepPreviousData } from "@tanstack/react-query"
import { useMemo } from "react"
import { useTranslation } from "react-i18next"

import { DataTable } from "../../../../../components/data-table"
import { useUserRoles } from "../../../../../hooks/api/users"
import { useQueryParams } from "../../../../../hooks/use-query-params"

const PAGE_SIZE = 10
const PREFIX = "ur"

const columnHelper = createDataTableColumnHelper<HttpTypes.AdminRbacRole>()

const useColumns = () => {
  const { t } = useTranslation()

  return useMemo(
    () => [
      columnHelper.accessor("name", {
        header: t("fields.name"),
      }),
      columnHelper.accessor("description", {
        header: t("fields.description"),
        cell: ({ row }) => row.original.description || "-",
      }),
    ],
    [t]
  )
}

type UserRoleSectionProps = {
  user: HttpTypes.AdminUser
}

export const UserRoleSection = ({ user }: UserRoleSectionProps) => {
  const { t } = useTranslation()
  const { offset } = useQueryParams(["offset"], PREFIX)

  const { roles, count, isPending, isError, error } = useUserRoles(
    user.id,
    {
      offset: offset ? parseInt(offset) : undefined,
      limit: PAGE_SIZE,
    },
    {
      placeholderData: keepPreviousData,
    }
  )

  const columns = useColumns()

  if (isError) {
    throw error
  }

  return (
    <Container className="divide-y p-0">
      <DataTable
        data={roles ?? []}
        columns={columns}
        getRowId={(row) => row.id}
        rowHref={(row) => `/settings/roles/${row.id}`}
        rowCount={count ?? 0}
        pageSize={PAGE_SIZE}
        prefix={PREFIX}
        heading={t("roles.domain")}
        headingLevel="h2"
        enableSearch={false}
        isLoading={isPending}
        emptyState={{
          empty: {
            heading: t("general.noRecordsTitle"),
            description: t("general.noRecordsMessage"),
          },
        }}
      />
    </Container>
  )
}

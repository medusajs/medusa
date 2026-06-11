// TODO: V1 policies are read-only in the dashboard. They're defined in code via
// `definePolicies()`. The Create button and per-row Edit / Delete
// actions are commented out below — uncomment to re-enable the full CRUD UI
// once policy management is opened to admins.

// import { PencilSquare, Trash } from "@medusajs/icons"
import { HttpTypes } from "@medusajs/types"
import {
  Container,
  createDataTableColumnHelper,
  createDataTableFilterHelper,
  // toast,
  // usePrompt,
} from "@medusajs/ui"
import { keepPreviousData /*, useMutation */ } from "@tanstack/react-query"
import { useMemo /*, useCallback */ } from "react"
import { useTranslation } from "react-i18next"
// import { useNavigate } from "react-router-dom"

import { DataTable } from "../../../../../components/data-table"
import { useDataTableDateFilters } from "../../../../../components/data-table/helpers/general/use-data-table-date-filters"
import {
  // rbacPoliciesQueryKeys,
  useRbacPolicies,
} from "../../../../../hooks/api/rbac-policies"
// import { rbacRolesQueryKeys } from "../../../../../hooks/api/rbac-roles"
import { useDate } from "../../../../../hooks/use-date"
import { useQueryParams } from "../../../../../hooks/use-query-params"
// import { sdk } from "../../../../../lib/client"
// import { queryClient } from "../../../../../lib/query-client"
// import { usePermissions } from "../../../../../providers/permissions-provider"

const PAGE_SIZE = 20

export const PolicyListTable = () => {
  const { t } = useTranslation()
  // const { hasPermission } = usePermissions()

  const { q, order, offset, created_at, resource, operation } = useQueryParams([
    "q",
    "order",
    "offset",
    "created_at",
    "resource",
    "operation",
  ])

  const { policies, count, isPending, isError, error } = useRbacPolicies(
    {
      q,
      order,
      offset: offset ? parseInt(offset) : undefined,
      limit: PAGE_SIZE,
      created_at: created_at ? JSON.parse(created_at) : undefined,
      resource: resource ? JSON.parse(resource) : undefined,
      operation: operation ? JSON.parse(operation) : undefined,
      fields:
        "id,key,resource,operation,name,description,created_at,updated_at",
    },
    {
      placeholderData: keepPreviousData,
    }
  )

  const columns = useColumns()
  const filters = useFilters()

  if (isError) {
    throw error
  }

  // const canCreate = hasPermission("rbac_policy:create")

  return (
    <Container className="divide-y p-0">
      <DataTable
        data={policies}
        columns={columns}
        filters={filters}
        getRowId={(row) => row.id}
        rowHref={(row) => `${row.id}`}
        rowCount={count}
        pageSize={PAGE_SIZE}
        heading={t("policies.domain")}
        subHeading={t("policies.subtitle")}
        isLoading={isPending}
        // action={{
        //   label: t("actions.create"),
        //   to: "create",
        //   disabled: !canCreate,
        //   tooltip: canCreate
        //     ? undefined
        //     : t("permissions.accessDenied.action"),
        // }}
        emptyState={{
          empty: {
            heading: t("policies.list.empty.heading"),
            description: t("policies.list.empty.description"),
          },
          filtered: {
            heading: t("policies.list.filtered.heading"),
            description: t("policies.list.filtered.description"),
          },
        }}
      />
    </Container>
  )
}

const columnHelper = createDataTableColumnHelper<HttpTypes.AdminRbacPolicy>()

const useColumns = () => {
  const { t } = useTranslation()
  // const navigate = useNavigate()
  // const prompt = usePrompt()
  const { getFullDate } = useDate()
  // const { hasPermission } = usePermissions()

  // const { mutateAsync: deletePolicy } = useMutation({
  //   mutationFn: (id: string) => sdk.admin.rbacPolicy.delete(id),
  //   onSuccess: (_data, id) => {
  //     queryClient.invalidateQueries({
  //       queryKey: rbacPoliciesQueryKeys.lists(),
  //     })
  //     queryClient.invalidateQueries({
  //       queryKey: rbacPoliciesQueryKeys.detail(id),
  //     })
  //     queryClient.invalidateQueries({ queryKey: rbacRolesQueryKeys.all })
  //   },
  // })

  // const handleEdit = useCallback(
  //   (policy: HttpTypes.AdminRbacPolicy) => {
  //     navigate(`/settings/policies/${policy.id}/edit`)
  //   },
  //   [navigate]
  // )

  // const handleDelete = useCallback(
  //   async (policy: HttpTypes.AdminRbacPolicy) => {
  //     const confirmed = await prompt({
  //       title: t("policies.delete.title"),
  //       description: t("policies.delete.description", { key: policy.key }),
  //       confirmText: t("actions.delete"),
  //       cancelText: t("actions.cancel"),
  //     })
  //
  //     if (!confirmed) {
  //       return
  //     }
  //
  //     try {
  //       await deletePolicy(policy.id)
  //       toast.success(
  //         t("policies.delete.successToast", { key: policy.key })
  //       )
  //     } catch (error) {
  //       toast.error((error as Error).message)
  //     }
  //   },
  //   [prompt, deletePolicy, t]
  // )

  return useMemo(() => {
    return [
      columnHelper.accessor("key", {
        header: t("fields.key"),
        enableSorting: true,
        sortAscLabel: t("filters.sorting.alphabeticallyAsc"),
        sortDescLabel: t("filters.sorting.alphabeticallyDesc"),
      }),
      columnHelper.accessor("resource", {
        header: t("fields.resource"),
        enableSorting: true,
        sortAscLabel: t("filters.sorting.alphabeticallyAsc"),
        sortDescLabel: t("filters.sorting.alphabeticallyDesc"),
        cell: ({ row }) => {
          const resource = row.original.resource
          return t(`permissions.resources.${resource}`, {
            defaultValue: resource,
          })
        },
      }),
      columnHelper.accessor("operation", {
        header: t("fields.operation"),
        enableSorting: true,
        sortAscLabel: t("filters.sorting.alphabeticallyAsc"),
        sortDescLabel: t("filters.sorting.alphabeticallyDesc"),
        cell: ({ row }) => {
          const operation = row.original.operation
          return t(`permissions.actions.${operation}`, {
            defaultValue: operation,
          })
        },
      }),
      columnHelper.accessor("description", {
        header: t("fields.description"),
        cell: ({ row }) => row.original.description || "-",
      }),
      columnHelper.accessor("created_at", {
        header: t("fields.createdAt"),
        cell: ({ row }) => (
          <span>{getFullDate({ date: row.original.created_at })}</span>
        ),
        enableSorting: true,
        sortAscLabel: t("filters.sorting.dateAsc"),
        sortDescLabel: t("filters.sorting.dateDesc"),
      }),
      // columnHelper.action({
      //   actions: (ctx) => {
      //     const policy = ctx.row.original
      //     const groups: {
      //       label: string
      //       icon: React.ReactNode
      //       onClick: () => void
      //     }[][] = []
      //
      //     if (hasPermission("rbac_policy:update")) {
      //       groups.push([
      //         {
      //           label: t("actions.edit"),
      //           icon: <PencilSquare />,
      //           onClick: () => handleEdit(policy),
      //         },
      //       ])
      //     }
      //
      //     if (hasPermission("rbac_policy:delete")) {
      //       groups.push([
      //         {
      //           label: t("actions.delete"),
      //           icon: <Trash />,
      //           onClick: () => handleDelete(policy),
      //         },
      //       ])
      //     }
      //
      //     return groups as any
      //   },
      // }),
    ]
  }, [t, getFullDate])
}

const filterHelper = createDataTableFilterHelper<HttpTypes.AdminRbacPolicy>()

const useFilters = () => {
  const dateFilters = useDataTableDateFilters()
  const { t } = useTranslation()

  return useMemo(() => {
    return [
      ...dateFilters.filter((filter) => filter.id === "created_at"),
      filterHelper.accessor("resource", {
        type: "string",
        label: t("fields.resource"),
      }),
      filterHelper.accessor("operation", {
        type: "string",
        label: t("fields.operation"),
      }),
    ]
  }, [dateFilters, t])
}

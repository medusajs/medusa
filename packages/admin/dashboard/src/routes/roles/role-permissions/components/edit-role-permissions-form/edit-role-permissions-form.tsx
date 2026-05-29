import { zodResolver } from "@hookform/resolvers/zod"
import { HttpTypes } from "@medusajs/types"
import {
  Button,
  createDataTableColumnHelper,
  DataTableRowSelectionState,
  toast,
} from "@medusajs/ui"
import { keepPreviousData, useMutation } from "@tanstack/react-query"
import { useEffect, useMemo, useState } from "react"
import { useForm } from "react-hook-form"
import { useTranslation } from "react-i18next"
import * as zod from "zod"

import { DataTable } from "../../../../../components/data-table"
import { RouteDrawer, useRouteModal } from "../../../../../components/modals"
import { KeyboundForm } from "../../../../../components/utilities/keybound-form"
import { useRbacAssignablePolicies } from "../../../../../hooks/api/rbac-policies"
import {
  rbacRolesQueryKeys,
  useAddRbacRolePolicies,
} from "../../../../../hooks/api/rbac-roles"
import { useQueryParams } from "../../../../../hooks/use-query-params"
import { sdk } from "../../../../../lib/client"
import { queryClient } from "../../../../../lib/query-client"

const EditRolePermissionsSchema = zod.object({
  policies: zod.array(zod.string()).optional(),
})

type EditRolePermissionsFormProps = {
  role: HttpTypes.AdminRbacRole
}

const PAGE_SIZE = 20
const PREFIX = "rp"

export const EditRolePermissionsForm = ({
  role,
}: EditRolePermissionsFormProps) => {
  const { t } = useTranslation()
  const { handleSuccess } = useRouteModal()

  const form = useForm<zod.infer<typeof EditRolePermissionsSchema>>({
    defaultValues: {
      policies: role.policies?.map((policy) => policy.id) ?? [],
    },
    resolver: zodResolver(EditRolePermissionsSchema),
  })

  const initialState =
    role.policies?.reduce((acc, policy) => {
      acc[policy.id] = true
      return acc
    }, {} as DataTableRowSelectionState) ?? {}

  const [rowSelection, setRowSelection] =
    useState<DataTableRowSelectionState>(initialState)

  useEffect(() => {
    const ids = Object.keys(rowSelection).filter((id) => rowSelection[id])
    form.setValue("policies", ids, {
      shouldDirty: true,
      shouldTouch: true,
    })
  }, [rowSelection, form])

  const { q, order, offset } = useQueryParams(["q", "order", "offset"], PREFIX)

  const {
    data: pageData,
    isPending: isLoading,
    isError,
    error,
  } = useRbacAssignablePolicies(
    {
      q,
      order,
      offset: offset ? parseInt(offset) : 0,
      limit: PAGE_SIZE,
      fields: "id,key,resource,operation,description",
    },
    {
      placeholderData: keepPreviousData,
    }
  )

  const visiblePolicies = pageData?.policies ?? []
  const count = pageData?.count ?? 0

  // Unpaginated assignable id set, used only to scope the diff on submit so we
  // never strip policies the actor cannot see.
  const { data: allAssignable, isPending: isAssignableSetLoading } =
    useRbacAssignablePolicies()
  const assignableIds = useMemo(
    () => new Set((allAssignable?.policies ?? []).map((p) => p.id)),
    [allAssignable?.policies]
  )

  const columns = usePolicyColumns()

  const { mutateAsync: addPolicies, isPending: isAdding } =
    useAddRbacRolePolicies(role.id)

  const { mutateAsync: removePolicies, isPending: isRemoving } = useMutation({
    mutationFn: async (policyIds: string[]) => {
      await Promise.all(
        policyIds.map((policyId) =>
          sdk.admin.rbacRole.removePolicy(role.id, policyId)
        )
      )
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: rbacRolesQueryKeys.policies(role.id),
      })
      queryClient.invalidateQueries({
        queryKey: rbacRolesQueryKeys.detail(role.id),
      })
      queryClient.invalidateQueries({ queryKey: rbacRolesQueryKeys.lists() })
    },
  })

  const handleSubmit = form.handleSubmit(async (data) => {
    const selectedPolicies = data.policies ?? []
    const existingPolicies = role.policies?.map((policy) => policy.id) ?? []

    const toAdd = selectedPolicies.filter(
      (policyId) => !existingPolicies.includes(policyId)
    )
    // Only consider policies the actor is allowed to assign — never strip
    // existing policies that the actor cannot see.
    const toRemove = existingPolicies
      .filter((policyId) => assignableIds.has(policyId))
      .filter((policyId) => !selectedPolicies.includes(policyId))

    try {
      if (toAdd.length) {
        await addPolicies({ policies: toAdd })
      }

      if (toRemove.length) {
        await removePolicies(toRemove)
      }

      handleSuccess()
    } catch (e) {
      const errorMessage = e instanceof Error ? e.message : "Unknown error"
      toast.error(errorMessage)
    }
  })

  if (isError) {
    throw error
  }

  return (
    <RouteDrawer.Form form={form}>
      <KeyboundForm
        className="flex flex-1 flex-col overflow-hidden"
        onSubmit={handleSubmit}
      >
        <RouteDrawer.Body className="-mx-4 flex flex-1 flex-col overflow-hidden p-0">
          <DataTable
            data={visiblePolicies}
            columns={columns}
            getRowId={(row) => row.id}
            rowCount={count}
            isLoading={isLoading}
            pageSize={PAGE_SIZE}
            rowSelection={{
              state: rowSelection,
              onRowSelectionChange: setRowSelection,
            }}
            autoFocusSearch
            layout="fill"
            emptyState={{
              empty: {
                heading: t("roles.permissions.empty.heading"),
                description: t("roles.permissions.empty.description"),
              },
              filtered: {
                heading: t("roles.permissions.filtered.heading"),
                description: t("roles.permissions.filtered.description"),
              },
            }}
            prefix={PREFIX}
          />
        </RouteDrawer.Body>
        <RouteDrawer.Footer className="shrink-0">
          <div className="flex items-center justify-end gap-x-2">
            <RouteDrawer.Close asChild>
              <Button size="small" variant="secondary">
                {t("actions.cancel")}
              </Button>
            </RouteDrawer.Close>
            <Button
              size="small"
              type="submit"
              isLoading={isAdding || isRemoving}
              disabled={isAssignableSetLoading}
            >
              {t("actions.save")}
            </Button>
          </div>
        </RouteDrawer.Footer>
      </KeyboundForm>
    </RouteDrawer.Form>
  )
}

const columnHelper =
  createDataTableColumnHelper<
    HttpTypes.AdminRbacAssignablePoliciesListResponse["policies"][number]
  >()

const usePolicyColumns = () => {
  const { t } = useTranslation()

  return useMemo(() => {
    return [
      columnHelper.select(),
      columnHelper.accessor("key", {
        header: t("fields.key"),
      }),
      columnHelper.accessor("resource", {
        header: t("fields.resource"),
        cell: ({ row }) => {
          const resource = row.original.resource

          return t(`permissions.resources.${resource}`, {
            defaultValue: resource,
          })
        },
      }),
      columnHelper.accessor("operation", {
        header: t("fields.operation"),
        cell: ({ row }) => {
          const operation = row.original.operation

          return t(`permissions.actions.${operation}`, {
            defaultValue: operation,
          })
        },
      }),
      columnHelper.accessor("description", {
        header: t("fields.description"),
        cell: ({ row }) => {
          return row.original.description || "-"
        },
      }),
    ]
  }, [t])
}

import { zodResolver } from "@hookform/resolvers/zod"
import { HttpTypes } from "@medusajs/types"
import { Button, toast, usePrompt } from "@medusajs/ui"
import { useEffect, useMemo, useState } from "react"
import { useForm } from "react-hook-form"
import { useTranslation } from "react-i18next"
import * as zod from "zod"

import {
  RouteFocusModal,
  useRouteModal,
} from "../../../../../components/modals"
import { KeyboundForm } from "../../../../../components/utilities/keybound-form"
import {
  useAddRbacRolePolicies,
  useRemoveRbacRolePolicies,
} from "../../../../../hooks/api/rbac-roles"
import {
  PermissionsMatrix,
  PermissionsSummary,
} from "../../../common/components"
import { usePermissionsMatrix } from "../../../common/hooks"
import { clearSelection, diffSelection } from "../../../common/utils"

const EditRolePermissionsSchema = zod.object({
  policies: zod.array(zod.string()).optional(),
})

type EditRolePermissionsFormProps = {
  role: HttpTypes.AdminRbacRole
}

export const EditRolePermissionsForm = ({
  role,
}: EditRolePermissionsFormProps) => {
  const { t } = useTranslation()
  const { handleSuccess } = useRouteModal()
  const prompt = usePrompt()

  const initialIds = useMemo(
    () => role.policies?.map((policy) => policy.id) ?? [],
    [role.policies]
  )

  const form = useForm<zod.infer<typeof EditRolePermissionsSchema>>({
    defaultValues: {
      policies: initialIds,
    },
    resolver: zodResolver(EditRolePermissionsSchema),
  })

  const [selection, setSelection] = useState<Set<string>>(
    () => new Set(initialIds)
  )

  useEffect(() => {
    form.setValue("policies", [...selection], {
      shouldDirty: true,
      shouldTouch: true,
    })
  }, [selection, form])

  const { matrix, assignableIds, wildcardPolicies, isPending, isError, error } =
    usePermissionsMatrix(role.policies)

  const { mutateAsync: addPolicies, isPending: isAdding } =
    useAddRbacRolePolicies(role.id)
  const { mutateAsync: removePolicies, isPending: isRemoving } =
    useRemoveRbacRolePolicies(role.id)

  // Policies the actor cannot assign are never part of the removal.
  const { toAdd, toRemove } = diffSelection(
    initialIds,
    selection,
    assignableIds
  )

  const handleClearAll = async () => {
    const cleared = clearSelection(matrix, selection)

    if (cleared.size === selection.size) {
      return
    }

    const confirmed = await prompt({
      title: t("roles.permissions.matrix.confirm.clear.title"),
      description: t("roles.permissions.matrix.confirm.clear.descriptionEdit"),
      confirmText: t("roles.permissions.matrix.clearAll"),
      cancelText: t("actions.cancel"),
      variant: "confirmation",
    })

    if (!confirmed) {
      return
    }

    setSelection(cleared)
  }

  const handleSubmit = form.handleSubmit(async () => {
    try {
      if (toAdd.length) {
        await addPolicies({ policies: toAdd })
      }

      if (toRemove.length) {
        await removePolicies(toRemove)
      }

      toast.success(t("roles.permissions.manage.successToast"))

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
    <RouteFocusModal.Form form={form}>
      <KeyboundForm
        className="flex h-full flex-col overflow-hidden"
        onSubmit={handleSubmit}
      >
        <RouteFocusModal.Body className="flex flex-1 flex-col overflow-hidden">
          <div className="flex size-full flex-col overflow-y-auto lg:grid lg:grid-cols-[1fr_360px] lg:grid-rows-[minmax(0,1fr)] lg:overflow-hidden">
            <div className="flex flex-col gap-y-4 p-6 lg:min-h-0 lg:overflow-y-auto lg:p-8 [&>*]:shrink-0">
              <PermissionsMatrix
                matrix={matrix}
                selection={selection}
                onSelectionChange={setSelection}
                onClearAll={handleClearAll}
                isLoading={isPending}
              />
            </div>
            <div className="shrink-0 border-t bg-ui-bg-subtle p-6 lg:min-h-0 lg:overflow-y-auto lg:border-s lg:border-t-0">
              <PermissionsSummary
                name={role.name}
                matrix={matrix}
                selection={selection}
                changes={{ added: toAdd.length, removed: toRemove.length }}
                wildcardKeys={wildcardPolicies
                  .filter((policy) => selection.has(policy.id))
                  .map((policy) => policy.key)}
              />
            </div>
          </div>
        </RouteFocusModal.Body>
        <RouteFocusModal.Footer>
          <div className="flex items-center justify-end gap-x-2">
            <RouteFocusModal.Close asChild>
              <Button size="small" variant="secondary">
                {t("actions.cancel")}
              </Button>
            </RouteFocusModal.Close>
            <Button
              size="small"
              type="submit"
              isLoading={isAdding || isRemoving}
              disabled={isPending || toAdd.length + toRemove.length === 0}
            >
              {t("actions.save")}
            </Button>
          </div>
        </RouteFocusModal.Footer>
      </KeyboundForm>
    </RouteFocusModal.Form>
  )
}

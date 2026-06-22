// TODO: V1 policies are read-only in the dashboard (defined in code via
// `definePolicies()``). The Edit / Delete action menu is commented out
// below — uncomment to re-enable when policy management is opened to admins.

// import { PencilSquare, Trash } from "@medusajs/icons"
import { HttpTypes } from "@medusajs/types"
import {
  Container,
  Heading,
  // Hint,
  // toast,
  // usePrompt,
} from "@medusajs/ui"
import { useTranslation } from "react-i18next"
// import { useNavigate } from "react-router-dom"

// import { ActionMenu } from "../../../../../components/common/action-menu"
import { SectionRow } from "../../../../../components/common/section"
// import { useDeleteRbacPolicy } from "../../../../../hooks/api/rbac-policies"
// import { usePermissions } from "../../../../../providers/permissions-provider"

type PolicyGeneralSectionProps = {
  policy: HttpTypes.AdminRbacPolicy
}

export const PolicyGeneralSection = ({ policy }: PolicyGeneralSectionProps) => {
  const { t } = useTranslation()
  // const navigate = useNavigate()
  // const prompt = usePrompt()
  // const { hasPermission } = usePermissions()

  // const { mutateAsync: deletePolicy, isPending: isDeleting } =
  //   useDeleteRbacPolicy(policy.id)

  // const handleDelete = async () => {
  //   const confirmed = await prompt({
  //     title: t("policies.delete.title"),
  //     description: t("policies.delete.description", { key: policy.key }),
  //     confirmText: t("actions.delete"),
  //     cancelText: t("actions.cancel"),
  //   })
  //
  //   if (!confirmed) {
  //     return
  //   }
  //
  //   try {
  //     await deletePolicy()
  //     toast.success(t("policies.delete.successToast", { key: policy.key }))
  //     navigate("/settings/policies", { replace: true })
  //   } catch (error) {
  //     toast.error((error as Error).message)
  //   }
  // }

  // const canUpdate = hasPermission("rbac_policy:update")
  // const canDelete = hasPermission("rbac_policy:delete")

  return (
    <Container className="divide-y p-0">
      <div className="flex items-center justify-between px-6 py-4">
        <Heading>{policy.name ?? policy.key}</Heading>
        {/*
        <ActionMenu
          groups={[
            {
              actions: [
                {
                  icon: <PencilSquare />,
                  label: t("actions.edit"),
                  to: `edit`,
                  disabled: !canUpdate,
                  disabledTooltip: (
                    <Hint variant="error">
                      {t("permissions.accessDenied.action")}
                    </Hint>
                  ),
                },
              ],
            },
            {
              actions: [
                {
                  icon: <Trash />,
                  label: t("actions.delete"),
                  onClick: handleDelete,
                  disabled: !canDelete || isDeleting,
                  disabledTooltip: (
                    <Hint variant="error">
                      {t("permissions.accessDenied.action")}
                    </Hint>
                  ),
                },
              ],
            },
          ]}
        />
        */}
      </div>
      <SectionRow title={t("fields.key")} value={policy.key} />
      <SectionRow title={t("fields.resource")} value={policy.resource} />
      <SectionRow title={t("fields.operation")} value={policy.operation} />
      <SectionRow title={t("fields.name")} value={policy.name} />
      <SectionRow title={t("fields.description")} value={policy.description} />
    </Container>
  )
}

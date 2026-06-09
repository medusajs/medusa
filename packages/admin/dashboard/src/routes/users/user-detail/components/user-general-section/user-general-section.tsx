import { PencilSquare, Trash } from "@medusajs/icons"
import { HttpTypes } from "@medusajs/types"
import { Container, Heading, Text, toast, usePrompt } from "@medusajs/ui"
import { useTranslation } from "react-i18next"
import { useNavigate } from "react-router-dom"
import {
  ActionGroup,
  ActionMenu,
} from "../../../../../components/common/action-menu"
import { useDeleteUser } from "../../../../../hooks/api/users"
import { useUserPermissions } from "../../../../../hooks/use-resource-permissions"

type UserGeneralSectionProps = {
  user: HttpTypes.AdminUser
}

export const UserGeneralSection = ({ user }: UserGeneralSectionProps) => {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const prompt = usePrompt()
  const { canUpdate, canDelete } = useUserPermissions()

  const { mutateAsync } = useDeleteUser(user.id)

  const name = [user.first_name, user.last_name].filter(Boolean).join(" ")

  const handleDeleteUser = async () => {
    const res = await prompt({
      title: t("general.areYouSure"),
      description: t("users.deleteUserWarning", {
        name: name ?? user.email,
      }),
      verificationText: name ?? user.email,
      verificationInstruction: t("general.typeToConfirm"),
      confirmText: t("actions.delete"),
      cancelText: t("actions.cancel"),
    })

    if (!res) {
      return
    }

    await mutateAsync(undefined, {
      onSuccess: () => {
        toast.success(t("users.deleteUserSuccess", { name: user.email }))
        navigate("..")
      },
      onError: (error) => {
        toast.error(error.message)
      },
    })
  }

  return (
    <Container className="divide-y p-0">
      <div className="flex items-center justify-between px-6 py-4">
        <Heading>{user.email}</Heading>
        {(() => {
          const groups: ActionGroup[] = []

          if (canUpdate) {
            groups.push({
              actions: [
                {
                  label: t("actions.edit"),
                  to: "edit",
                  icon: <PencilSquare />,
                },
              ],
            })
          }

          if (canDelete) {
            groups.push({
              actions: [
                {
                  label: t("actions.delete"),
                  onClick: handleDeleteUser,
                  icon: <Trash />,
                },
              ],
            })
          }

          return groups.length > 0 ? <ActionMenu groups={groups} /> : null
        })()}
      </div>
      <div className="text-ui-fg-subtle grid grid-cols-2 items-center px-6 py-4">
        <Text size="small" leading="compact" weight="plus">
          {t("fields.name")}
        </Text>
        <Text size="small" leading="compact">
          {name ?? "-"}
        </Text>
      </div>
    </Container>
  )
}

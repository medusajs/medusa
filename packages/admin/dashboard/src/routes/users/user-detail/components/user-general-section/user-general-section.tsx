import { Link, PencilSquare, Trash } from "@medusajs/icons"
import { HttpTypes } from "@medusajs/types"
import { Container, Heading, Text, toast, usePrompt } from "@medusajs/ui"
import copy from "copy-to-clipboard"
import { useTranslation } from "react-i18next"
import { useNavigate } from "react-router-dom"
import { ActionMenu } from "../../../../../components/common/action-menu"
import {
  useDeleteUser,
  useGenerateUserResetPasswordToken,
  useUserAuthProviders,
} from "../../../../../hooks/api/users"

type UserGeneralSectionProps = {
  user: HttpTypes.AdminUser
}

const RESET_PASSWORD_URL = `${window.location.origin}${
  __BASE__ === "/" ? "" : __BASE__
}/reset-password?token=`

export const UserGeneralSection = ({ user }: UserGeneralSectionProps) => {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const prompt = usePrompt()

  const { mutateAsync } = useDeleteUser(user.id)
  const { mutate: generateResetPasswordToken } =
    useGenerateUserResetPasswordToken(user.id)
  const { providers } = useUserAuthProviders(user.id)

  // emailpass is the only provider the reset password flow the dashboard handles.
  const canResetPassword = !!providers?.includes("emailpass")

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

  const handleCopyResetPasswordLink = () => {
    generateResetPasswordToken(undefined, {
      onSuccess: ({ token }) => {
        copy(`${RESET_PASSWORD_URL}${token}`)

        toast.success(t("users.copyResetPasswordLinkSuccess"), {
          description: t("users.copyResetPasswordLinkHint"),
        })
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
        <ActionMenu
          groups={[
            {
              actions: [
                {
                  label: t("actions.edit"),
                  to: "edit",
                  icon: <PencilSquare />,
                },
              ],
            },
            ...(canResetPassword
              ? [
                  {
                    actions: [
                      {
                        label: t("users.copyResetPasswordLink"),
                        onClick: handleCopyResetPasswordLink,
                        icon: <Link />,
                      },
                    ],
                  },
                ]
              : []),
            {
              actions: [
                {
                  label: t("actions.delete"),
                  onClick: handleDeleteUser,
                  icon: <Trash />,
                },
              ],
            },
          ]}
        />
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

import { PencilSquare, SquareTwoStack, Trash, XCircle } from "@medusajs/icons"
import { AdminApiKeyResponse } from "@medusajs/types"
import { toast, usePrompt } from "@medusajs/ui"
import { useTranslation } from "react-i18next"
import { ActionMenu } from "../../../../../components/common/action-menu"
import {
  useDeleteApiKey,
  useRevokeApiKey,
} from "../../../../../hooks/api/api-keys"

export const ApiKeyRowActions = ({
  apiKey,
}: {
  apiKey: AdminApiKeyResponse["api_key"]
}) => {
  const { mutateAsync: revokeAsync } = useRevokeApiKey(apiKey.id)
  const { mutateAsync: deleteAsync } = useDeleteApiKey(apiKey.id)

  const { t } = useTranslation()
  const prompt = usePrompt()

  const handleDelete = async () => {
    const res = await prompt({
      title: t("general.areYouSure"),
      description: t("apiKeyManagement.delete.warning", {
        title: apiKey.title,
      }),
      confirmText: t("actions.delete"),
      cancelText: t("actions.cancel"),
    })

    if (!res) {
      return
    }

    await deleteAsync(undefined, {
      onSuccess: () => {
        toast.success(t("general.success"), {
          description: t("apiKeyManagement.delete.successToast", {
            title: apiKey.title,
          }),
          dismissLabel: t("general.close"),
        })
      },
      onError: (err) => {
        toast.error(t("general.error"), {
          description: err.message,
          dismissLabel: t("general.close"),
        })
      },
    })
  }

  const handleRevoke = async () => {
    const res = await prompt({
      title: t("general.areYouSure"),
      description: t("apiKeyManagement.revoke.warning", {
        title: apiKey.title,
      }),
      confirmText: t("apiKeyManagement.actions.revoke"),
      cancelText: t("actions.cancel"),
    })

    if (!res) {
      return
    }

    await revokeAsync(undefined, {
      onSuccess: () => {
        toast.success(t("general.success"), {
          description: t("apiKeyManagement.revoke.successToast", {
            title: apiKey.title,
          }),
          dismissLabel: t("general.close"),
        })
      },
      onError: (err) => {
        toast.error(t("general.error"), {
          description: err.message,
          dismissLabel: t("general.close"),
        })
      },
    })
  }

  const handleCopyToken = () => {
    navigator.clipboard.writeText(apiKey.token)
    toast.success(t("general.success"), {
      description: t("apiKeyManagement.actions.copySuccessToast"),
      dismissLabel: t("general.close"),
    })
  }

  return (
    <ActionMenu
      groups={[
        {
          actions: [
            {
              icon: <PencilSquare />,
              label: t("actions.edit"),
              to: `${apiKey.id}/edit`,
            },
            ...(apiKey.type !== "secret"
              ? [
                  {
                    label: t("apiKeyManagement.actions.copy"),
                    onClick: handleCopyToken,
                    icon: <SquareTwoStack />,
                  },
                ]
              : []),
          ],
        },
        {
          actions: [
            {
              icon: <XCircle />,
              label: t("apiKeyManagement.actions.revoke"),
              onClick: handleRevoke,
            },
            {
              icon: <Trash />,
              label: t("actions.delete"),
              onClick: handleDelete,
            },
          ],
        },
      ]}
    />
  )
}

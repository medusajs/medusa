import { PencilSquare, Trash, XCircle } from "@medusajs/icons"
import { AdminApiKeyResponse } from "@medusajs/types"
import { usePrompt } from "@medusajs/ui"
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
      description: t("apiKeyManagement.warnings.delete", {
        title: apiKey.title,
      }),
      confirmText: t("actions.delete"),
      cancelText: t("actions.cancel"),
    })

    if (!res) {
      return
    }

    await deleteAsync()
  }

  const handleRevoke = async () => {
    const res = await prompt({
      title: t("general.areYouSure"),
      description: t("apiKeyManagement.warnings.revoke", {
        title: apiKey.title,
      }),
      confirmText: t("apiKeyManagement.actions.revoke"),
      cancelText: t("actions.cancel"),
    })

    if (!res) {
      return
    }

    await revokeAsync(undefined)
  }

  return (
    <ActionMenu
      groups={[
        {
          actions: [
            {
              icon: <PencilSquare />,
              label: t("actions.edit"),
              to: `/settings/api-key-management/${apiKey.id}`,
            },
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

import { PencilSquare, Trash, XCircle } from "@medusajs/icons"
import { PublishableApiKey } from "@medusajs/medusa"
import {
  Container,
  Copy,
  Heading,
  StatusBadge,
  Text,
  usePrompt,
} from "@medusajs/ui"
import {
  useAdminDeletePublishableApiKey,
  useAdminRevokePublishableApiKey,
  useAdminUser,
} from "medusa-react"
import { useTranslation } from "react-i18next"
import { ActionMenu } from "../../../../../components/common/action-menu"
import { Skeleton } from "../../../../../components/common/skeleton"
import { UserLink } from "../../../../../components/common/user-link"

type ApiKeyGeneralSectionProps = {
  apiKey: PublishableApiKey
}

export const ApiKeyGeneralSection = ({ apiKey }: ApiKeyGeneralSectionProps) => {
  const { t } = useTranslation()
  const prompt = usePrompt()

  const { mutateAsync: revokeAsync } = useAdminRevokePublishableApiKey(
    apiKey.id
  )
  const { mutateAsync: deleteAsync } = useAdminDeletePublishableApiKey(
    apiKey.id
  )

  const handleDelete = async () => {
    const res = await prompt({
      title: t("general.areYouSure"),
      description: t("apiKeyManagement.deleteKeyWarning", {
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
      description: t("apiKeyManagement.revokeKeyWarning", {
        title: apiKey.title,
      }),
      confirmText: t("apiKeyManagement.revoke"),
      cancelText: t("actions.cancel"),
    })

    if (!res) {
      return
    }

    await revokeAsync()
  }

  const dangerousActions = [
    {
      icon: <Trash />,
      label: t("actions.delete"),
      onClick: handleDelete,
    },
  ]

  if (!apiKey.revoked_at) {
    dangerousActions.unshift({
      icon: <XCircle />,
      label: t("apiKeyManagement.revoke"),
      onClick: handleRevoke,
    })
  }

  return (
    <Container className="divide-y p-0">
      <div className="flex items-center justify-between px-6 py-4">
        <Heading>{apiKey.title}</Heading>
        <div className="flex items-center gap-x-2">
          <StatusBadge color={apiKey.revoked_at ? "red" : "green"}>
            {apiKey.revoked_at ? t("general.revoked") : t("general.active")}
          </StatusBadge>
          <ActionMenu
            groups={[
              {
                actions: [
                  {
                    label: t("actions.edit"),
                    icon: <PencilSquare />,
                    to: `/settings/api-key-management/${apiKey.id}/edit`,
                  },
                ],
              },
              {
                actions: dangerousActions,
              },
            ]}
          />
        </div>
      </div>
      <div className="grid grid-cols-2 items-center px-6 py-4">
        <Text size="small" leading="compact" weight="plus">
          {t("fields.key")}
        </Text>
        <div className="bg-ui-bg-subtle border-ui-border-base box-border flex w-fit cursor-default items-center gap-x-0.5 overflow-hidden rounded-full border pl-2 pr-1">
          <Text size="xsmall" leading="compact" className="truncate">
            {apiKey.id}
          </Text>
          <Copy
            content={apiKey.id}
            variant="mini"
            className="text-ui-fg-subtle"
          />
        </div>
      </div>
      <div className="grid grid-cols-2 items-center px-6 py-4">
        <Text size="small" leading="compact" weight="plus">
          {t("apiKeyManagement.createdBy")}
        </Text>
        <ActionBy userId={apiKey.created_by} />
      </div>
      {apiKey.revoked_at && (
        <div className="grid grid-cols-2 items-center px-6 py-4">
          <Text size="small" leading="compact" weight="plus">
            {t("apiKeyManagement.revokedBy")}
          </Text>
          <ActionBy userId={apiKey.revoked_by} />
        </div>
      )}
    </Container>
  )
}

const ActionBy = ({ userId }: { userId: string | null }) => {
  const { user, isLoading, isError, error } = useAdminUser(userId!, {
    enabled: !!userId,
  })

  if (!userId) {
    return (
      <Text size="small" className="text-ui-fg-subtle">
        -
      </Text>
    )
  }

  if (isError) {
    throw error
  }

  if (isLoading) {
    return (
      <div className="grid grid-cols-[20px_1fr]">
        <Skeleton className="h-5 w-5 rounded-full" />
        <Skeleton className="w-full max-w-[220px]" />
      </div>
    )
  }

  if (!user) {
    return (
      <Text size="small" className="text-ui-fg-subtle">
        -
      </Text>
    )
  }

  return <UserLink {...user} />
}

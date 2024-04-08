import { PencilSquare, Trash, XCircle } from "@medusajs/icons"
import { ApiKeyDTO } from "@medusajs/types"
import {
  Container,
  Copy,
  Heading,
  StatusBadge,
  Text,
  usePrompt,
} from "@medusajs/ui"
import { useTranslation } from "react-i18next"
import { useNavigate } from "react-router-dom"
import { ActionMenu } from "../../../../../components/common/action-menu"
import { Skeleton } from "../../../../../components/common/skeleton"
import { UserLink } from "../../../../../components/common/user-link"
import {
  useDeleteApiKey,
  useRevokeApiKey,
} from "../../../../../hooks/api/api-keys"
import { useUser } from "../../../../../hooks/api/users"
import { useDate } from "../../../../../hooks/use-date"
import { ApiKeyType } from "../../../common/constants"

type ApiKeyGeneralSectionProps = {
  apiKey: ApiKeyDTO
}

export const ApiKeyGeneralSection = ({ apiKey }: ApiKeyGeneralSectionProps) => {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const prompt = usePrompt()
  const { getFullDate } = useDate()

  const { mutateAsync: revokeAsync } = useRevokeApiKey(apiKey.id)
  const { mutateAsync: deleteAsync } = useDeleteApiKey(apiKey.id)

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

    await deleteAsync(undefined, {
      onSuccess: () => {
        navigate("..", { replace: true })
      },
    })
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
        <div className="flex items-center gap-x-4">
          <div className="flex items-center gap-x-2">
            <StatusBadge
              color={apiKey.type === ApiKeyType.PUBLISHABLE ? "green" : "blue"}
            >
              {apiKey.revoked_at ? t("general.revoked") : t("general.active")}
            </StatusBadge>
            <StatusBadge color={apiKey.revoked_at ? "red" : "green"}>
              {apiKey.revoked_at ? t("general.revoked") : t("general.active")}
            </StatusBadge>
          </div>
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
            {apiKey.redacted}
          </Text>
          <Copy
            content={apiKey.token}
            variant="mini"
            className="text-ui-fg-subtle"
          />
        </div>
      </div>
      <div className="text-ui-fg-subtle grid grid-cols-2 items-center px-6 py-4">
        <Text size="small" leading="compact" weight="plus">
          {t("fields.key")}
        </Text>
        <Text size="small" leading="compact">
          {apiKey.last_used_at
            ? getFullDate({ date: apiKey.last_used_at, includeTime: true })
            : "-"}
        </Text>
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
  const { user, isLoading, isError, error } = useUser(userId!, undefined, {
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

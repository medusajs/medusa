import { PencilSquare, Trash, XCircle } from "@medusajs/icons"
import { ApiKeyDTO } from "@medusajs/types"
import {
  Badge,
  Container,
  Copy,
  Heading,
  StatusBadge,
  Text,
  toast,
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
import {
  getApiKeyStatusProps,
  getApiKeyTypeProps,
  prettifyRedactedToken,
} from "../../../common/utils"

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
        toast.success(
          t("apiKeyManagement.delete.successToast", {
            title: apiKey.title,
          })
        )
        navigate("..", { replace: true })
      },
      onError: (err) => {
        toast.error(err.message)
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
        toast.success(
          t("apiKeyManagement.revoke.successToast", {
            title: apiKey.title,
          })
        )
      },
      onError: (err) => {
        toast.error(err.message)
      },
    })
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
      label: t("apiKeyManagement.actions.revoke"),
      onClick: handleRevoke,
    })
  }

  const apiKeyStatus = getApiKeyStatusProps(apiKey.revoked_at, t)
  const apiKeyType = getApiKeyTypeProps(apiKey.type, t)

  return (
    <Container className="divide-y p-0">
      <div className="flex items-center justify-between px-6 py-4">
        <Heading>{apiKey.title}</Heading>
        <div className="flex items-center gap-x-4">
          <div className="flex items-center gap-x-2">
            <StatusBadge color={apiKeyStatus.color}>
              {apiKeyStatus.label}
            </StatusBadge>
          </div>
          <ActionMenu
            groups={[
              {
                actions: [
                  {
                    label: t("actions.edit"),
                    icon: <PencilSquare />,
                    to: "edit",
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
      <div className="text-ui-fg-subtle grid grid-cols-2 items-center px-6 py-4">
        <Text size="small" leading="compact" weight="plus">
          {t("fields.key")}
        </Text>
        {apiKey.type === "secret" ? (
          <Badge size="2xsmall" className="w-fit">
            {prettifyRedactedToken(apiKey.redacted)}
          </Badge>
        ) : (
          <Copy asChild content={apiKey.token}>
            <Badge size="2xsmall" className="w-fit max-w-40 cursor-pointer">
              <Text size="xsmall" leading="compact" className="truncate">
                {prettifyRedactedToken(apiKey.redacted)}
              </Text>
            </Badge>
          </Copy>
        )}
      </div>
      <div className="text-ui-fg-subtle grid grid-cols-2 items-center px-6 py-4">
        <Text size="small" leading="compact" weight="plus">
          {t("fields.type")}
        </Text>
        <Text size="small" leading="compact">
          {apiKeyType.label}
        </Text>
      </div>
      <div className="text-ui-fg-subtle grid grid-cols-2 items-center px-6 py-4">
        <Text size="small" leading="compact" weight="plus">
          {t("apiKeyManagement.fields.lastUsedAtLabel")}
        </Text>
        <Text size="small" leading="compact">
          {apiKey.last_used_at
            ? getFullDate({ date: apiKey.last_used_at, includeTime: true })
            : "-"}
        </Text>
      </div>
      <div className="text-ui-fg-subtle grid grid-cols-2 items-center px-6 py-4">
        <Text size="small" leading="compact" weight="plus">
          {t("apiKeyManagement.fields.createdByLabel")}
        </Text>
        <ActionBy userId={apiKey.created_by} />
      </div>
      {apiKey.revoked_at && (
        <>
          <div className="text-ui-fg-subtle grid grid-cols-2 items-center px-6 py-4">
            <Text size="small" leading="compact" weight="plus">
              {t("apiKeyManagement.fields.revokedAtLabel")}
            </Text>
            <Text size="small" leading="compact">
              {getFullDate({ date: apiKey.revoked_at, includeTime: true })}
            </Text>
          </div>
          <div className="text-ui-fg-subtle grid grid-cols-2 items-center px-6 py-4">
            <Text size="small" leading="compact" weight="plus">
              {t("apiKeyManagement.fields.revokedByLabel")}
            </Text>
            <ActionBy userId={apiKey.revoked_by} />
          </div>
        </>
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

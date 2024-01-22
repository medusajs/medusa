import {
  ArrowUpRightOnBox,
  PencilSquare,
  Trash,
  XCircle,
} from "@medusajs/icons"
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
import { Link } from "react-router-dom"
import { ActionMenu } from "../../../../../components/common/action-menu"
import { Skeleton } from "../../../../../components/common/skeleton"

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
      confirmText: t("general.delete"),
      cancelText: t("general.cancel"),
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
      cancelText: t("general.cancel"),
    })

    if (!res) {
      return
    }

    await revokeAsync()
  }

  return (
    <Container className="p-0 divide-y">
      <div className="px-6 py-4 flex items-center justify-between">
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
                    label: t("general.edit"),
                    icon: <PencilSquare />,
                    to: `/settings/api-key-management/${apiKey.id}/edit`,
                  },
                ],
              },
              {
                actions: [
                  {
                    icon: <XCircle />,
                    label: t("apiKeyManagement.revoke"),
                    onClick: handleRevoke,
                  },
                  {
                    icon: <Trash />,
                    label: t("general.delete"),
                    onClick: handleDelete,
                  },
                ],
              },
            ]}
          />
        </div>
      </div>
      <div className="grid grid-cols-2 px-6 py-4">
        <Text size="small" leading="compact" weight="plus">
          {t("fields.key")}
        </Text>
        <div
          className="bg-ui-tag-neutral-bg border border-ui-tag-neutral-border text-ui-tag-neutral-text flex items-center gap-x-0.5 w-fit rounded-full pl-2 pr-1 py-px cursor-default overflow-hidden"
          onClick={(e) => e.stopPropagation()}
        >
          <Text
            size="small"
            weight="plus"
            leading="compact"
            className="truncate"
          >
            {apiKey.id}
          </Text>
          <Copy content={apiKey.id} variant="mini" />
        </div>
      </div>
      <div className="grid grid-cols-2 px-6 py-4">
        <Text size="small" leading="compact" weight="plus">
          {t("apiKeyManagement.createdBy")}
        </Text>
        <ActionBy userId={apiKey.created_by} />
      </div>
      {apiKey.revoked_at && (
        <div className="grid grid-cols-2 px-6 py-4">
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
    return <Skeleton className="max-w-[220px] w-full" />
  }

  if (!user) {
    return (
      <Text size="small" className="text-ui-fg-subtle">
        -
      </Text>
    )
  }

  const name = [user.first_name, user.last_name].filter(Boolean).join(" ")

  return (
    <Link
      to={`/settings/users/${user.id}`}
      className="flex items-center gap-x-2 text-ui-fg-interactive hover:text-ui-fg-interactive-hover transition-fg w-fit outline-none focus-visible:text-ui-fg-interactive-hover focus-visible:underline underline-offset-2"
    >
      <Text size="small">{name || user.email}</Text>
      <ArrowUpRightOnBox />
    </Link>
  )
}

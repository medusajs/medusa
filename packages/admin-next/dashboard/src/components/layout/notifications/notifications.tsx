import {
  ArrowDownTray,
  BellAlert,
  BellAlertDone,
  InformationCircleSolid,
} from "@medusajs/icons"
import { Drawer, Heading, IconButton, Text } from "@medusajs/ui"
import { useEffect, useState } from "react"
import { useTranslation } from "react-i18next"
import { HttpTypes } from "@medusajs/types"
import { formatDistance } from "date-fns"
import { InfiniteList } from "../../common/infinite-list"
import { sdk } from "../../../lib/client"
import { notificationQueryKeys } from "../../../hooks/api"
import { TFunction } from "i18next"

interface NotificationData {
  title: string
  description?: string
  file?: {
    filename?: string
    url?: string
    mimeType?: string
  }
}

export const Notifications = () => {
  const [open, setOpen] = useState(false)
  const { t } = useTranslation()

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "n" && (e.metaKey || e.ctrlKey)) {
        setOpen((prev) => !prev)
      }
    }

    document.addEventListener("keydown", onKeyDown)

    return () => {
      document.removeEventListener("keydown", onKeyDown)
    }
  }, [])

  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <Drawer.Trigger asChild>
        <IconButton
          variant="transparent"
          className="text-ui-fg-muted hover:text-ui-fg-subtle"
        >
          <BellAlert />
        </IconButton>
      </Drawer.Trigger>
      <Drawer.Content>
        <Drawer.Header>
          <Drawer.Title asChild>
            <Heading>{t("notifications.domain")}</Heading>
          </Drawer.Title>
          <Drawer.Description className="sr-only">
            {t("notifications.accessibility.description")}
          </Drawer.Description>
        </Drawer.Header>
        <Drawer.Body className="overflow-y-auto px-0">
          <InfiniteList<
            HttpTypes.AdminNotificationListResponse,
            HttpTypes.AdminNotification,
            HttpTypes.AdminNotificationListParams
          >
            responseKey="notifications"
            queryKey={notificationQueryKeys.all}
            queryFn={(params) => sdk.admin.notification.list(params)}
            queryOptions={{ enabled: open }}
            renderEmpty={() => <NotificationsEmptyState t={t} />}
            renderItem={(notification) => {
              return (
                <Notification
                  key={notification.id}
                  notification={notification}
                />
              )
            }}
          />
        </Drawer.Body>
      </Drawer.Content>
    </Drawer>
  )
}

const Notification = ({
  notification,
}: {
  notification: HttpTypes.AdminNotification
}) => {
  const data = notification.data as unknown as NotificationData | undefined

  // We need at least the title to render a notification in the feed
  if (!data?.title) {
    return null
  }

  return (
    <>
      <div className="flex items-start justify-center gap-3 border-b p-6">
        <div className="text-ui-fg-muted flex size-5 items-center justify-center">
          <InformationCircleSolid />
        </div>
        <div className="flex w-full flex-col gap-y-3">
          <div>
            <div className="align-center flex flex-row justify-between">
              <Text size="small" leading="compact" weight="plus">
                {data.title}
              </Text>
              <Text
                as={"span"}
                className="text-ui-fg-subtle"
                size="small"
                leading="compact"
                weight="plus"
              >
                {formatDistance(notification.created_at, new Date(), {
                  addSuffix: true,
                })}
              </Text>
            </div>
            {!!data.description && (
              <Text
                className="text-ui-fg-subtle whitespace-pre-line"
                size="small"
              >
                {data.description}
              </Text>
            )}
          </div>
          <NotificationFile file={data.file} />
        </div>
      </div>
    </>
  )
}

const NotificationFile = ({ file }: { file: NotificationData["file"] }) => {
  if (!file?.url) {
    return null
  }

  return (
    <div className="shadow-elevation-card-rest bg-ui-bg-component transition-fg rounded-md px-3 py-2">
      <div className="flex w-full flex-row items-center justify-between gap-2">
        <Text size="small" leading="compact">
          {file?.filename ?? file.url}
        </Text>
        <IconButton variant="transparent" asChild>
          <a href={file.url} download={file.filename ?? `${Date.now()}`}>
            <ArrowDownTray />
          </a>
        </IconButton>
      </div>
    </div>
  )
}

const NotificationsEmptyState = ({ t }: { t: TFunction }) => {
  return (
    <div className="flex h-full flex-col items-center justify-center">
      <BellAlertDone />
      <Text size="small" leading="compact" weight="plus" className="mt-3">
        {t("notifications.emptyState.title")}
      </Text>
      <Text
        size="small"
        className="text-ui-fg-muted mt-1 max-w-[294px] text-center"
      >
        {t("notifications.emptyState.description")}
      </Text>
    </div>
  )
}

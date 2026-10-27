import { defineWidgetConfig } from "@medusajs/admin-sdk"
import { ArrowUpRightOnBox, Sparkles } from "@medusajs/icons"
import { Badge, Drawer, Heading, IconButton, Text, toast } from "@medusajs/ui"
import { useEffect, useState } from "react"
import { CloudAnnouncement } from "../../types"
import { useCloudAnnouncements } from "../hooks/announcements"
import { useCloudHints } from "../hooks/hints"
import {
  getLastSeenAt,
  getLastToastedId,
  setLastSeenAt,
  setLastToastAt,
  setLastToastedId,
} from "../lib/storage"

const TOAST_MAX_AGE_MS = 14 * 24 * 60 * 60 * 1000

const publishedAt = (announcement: CloudAnnouncement) =>
  announcement.published_at ? Date.parse(announcement.published_at) : 0

const formatDate = (value: string | null) =>
  value
    ? new Date(value).toLocaleDateString(undefined, {
        year: "numeric",
        month: "short",
        day: "numeric",
      })
    : null

const CloudAnnouncementsWidget = () => {
  useCloudHints()
  const { announcements } = useCloudAnnouncements()
  const [open, setOpen] = useState(false)
  // Lags behind storage until the drawer closes, so items opened as unread stay marked while viewed.
  const [lastSeenAt, setLastSeenAtState] = useState(getLastSeenAt)

  const latest = announcements[0]
  const isUnread = (announcement: CloudAnnouncement) =>
    publishedAt(announcement) > (lastSeenAt ? Date.parse(lastSeenAt) : 0)

  const hasUnread = announcements.some(isUnread)

  useEffect(() => {
    if (
      !latest ||
      !isUnread(latest) ||
      getLastToastedId() === latest.id ||
      Date.now() - publishedAt(latest) > TOAST_MAX_AGE_MS
    ) {
      return
    }

    setLastToastedId(latest.id)
    setLastToastAt(Date.now())
    toast.info(latest.title, {
      description: latest.subtitle ?? undefined,
      duration: 10000,
      dismissable: true,
      action: {
        label: "View",
        altText: "View Medusa Cloud announcements",
        onClick: () => handleOpenChange(true),
      },
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [latest?.id])

  const handleOpenChange = (shouldOpen: boolean) => {
    setOpen(shouldOpen)

    if (shouldOpen) {
      if (latest?.published_at) {
        setLastSeenAt(latest.published_at)
      }
    } else {
      setLastSeenAtState(getLastSeenAt())
    }
  }

  if (!announcements.length) {
    return null
  }

  return (
    <Drawer open={open} onOpenChange={handleOpenChange}>
      <Drawer.Trigger asChild>
        <IconButton
          variant="transparent"
          size="small"
          className="text-ui-fg-muted hover:text-ui-fg-subtle relative"
          aria-label="What's new in Medusa Cloud"
        >
          <Sparkles />
          {hasUnread && (
            <span className="bg-ui-tag-blue-icon absolute right-1 top-1 size-1.5 rounded-full" />
          )}
        </IconButton>
      </Drawer.Trigger>
      <Drawer.Content>
        <Drawer.Header>
          <Drawer.Title asChild>
            <Heading>What's new</Heading>
          </Drawer.Title>
          <Drawer.Description className="sr-only">
            The latest announcements from Medusa Cloud
          </Drawer.Description>
        </Drawer.Header>
        <Drawer.Body className="overflow-y-auto px-0 py-0">
          {announcements.map((announcement) => (
            <AnnouncementItem
              key={announcement.id}
              announcement={announcement}
              unread={isUnread(announcement)}
            />
          ))}
        </Drawer.Body>
      </Drawer.Content>
    </Drawer>
  )
}

const AnnouncementItem = ({
  announcement,
  unread,
}: {
  announcement: CloudAnnouncement
  unread: boolean
}) => {
  const date = formatDate(announcement.published_at)

  return (
    <div className="flex flex-col gap-y-3 border-b p-6">
      {announcement.image_url && (
        <img
          src={announcement.image_url}
          alt=""
          className="aspect-video w-full rounded-md object-cover"
        />
      )}
      <div className="flex flex-col gap-y-1">
        <div className="flex items-center justify-between gap-x-2">
          <Text size="small" leading="compact" weight="plus">
            {announcement.title}
          </Text>
          {unread && (
            <Badge size="2xsmall" color="blue">
              New
            </Badge>
          )}
        </div>
        {announcement.subtitle && (
          <Text size="small" className="text-ui-fg-subtle">
            {announcement.subtitle}
          </Text>
        )}
      </div>
      <div className="flex items-center justify-between">
        {date && (
          <Text size="xsmall" className="text-ui-fg-muted">
            {date}
          </Text>
        )}
        {announcement.link_url && (
          <a
            href={announcement.link_url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-ui-fg-interactive hover:text-ui-fg-interactive-hover txt-compact-small-plus flex items-center gap-x-1"
          >
            Learn more
            <ArrowUpRightOnBox />
          </a>
        )}
      </div>
    </div>
  )
}

export const config = defineWidgetConfig({
  zone: "topbar",
})

export default CloudAnnouncementsWidget

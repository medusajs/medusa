import { defineWidgetConfig } from "@medusajs/admin-sdk"
import { XMark } from "@medusajs/icons"
import { Button, Container, Drawer, IconButton, Text } from "@medusajs/ui"
import { KeyboardEvent, useMemo, useState } from "react"
import { useLocation } from "react-router-dom"
import { CloudAnnouncement } from "../../types"
import { AnnouncementDetails } from "../components/announcement-details"
import { useCloudAnnouncements } from "../hooks/announcements"
import { getAnnouncementForPath } from "../lib/announcements"
import {
  addDismissedAnnouncementId,
  getDismissedAnnouncementIds,
} from "../lib/storage"

const CloudAnnouncementCardWidget = () => {
  const { announcements } = useCloudAnnouncements()
  const { pathname } = useLocation()
  const [dismissedId, setDismissedId] = useState<string | null>(null)
  const [details, setDetails] = useState<CloudAnnouncement | null>(null)

  // Storage is read only when the page changes, so the next announcement waits for the next page.
  const announcement = useMemo(
    () =>
      getAnnouncementForPath(pathname, announcements, {
        dismissedIds: getDismissedAnnouncementIds(),
      }),
    [pathname, announcements]
  )

  const dismiss = (announcement: CloudAnnouncement) => {
    addDismissedAnnouncementId(announcement.id)
    setDismissedId(announcement.id)
  }

  const viewDetails = (announcement: CloudAnnouncement) => {
    dismiss(announcement)
    setDetails(announcement)
  }

  return (
    <>
      {announcement && announcement.id !== dismissedId && (
        <Container
          role="status"
          aria-live="polite"
          onKeyDown={(event: KeyboardEvent) =>
            event.key === "Escape" && dismiss(announcement)
          }
          className="animate-in fade-in-0 slide-in-from-bottom-2 overflow-hidden p-0 duration-150"
        >
          {announcement.image_url && (
            <img
              src={announcement.image_url}
              alt=""
              className="h-24 w-full border-b object-cover"
            />
          )}
          <div className="flex flex-col gap-y-1 p-3">
            <div className="flex items-start gap-x-2">
              <Text
                size="small"
                leading="compact"
                weight="plus"
                className="line-clamp-2 flex-1"
              >
                {announcement.title}
              </Text>
              <IconButton
                size="2xsmall"
                variant="transparent"
                className="text-ui-fg-muted -mr-1 shrink-0"
                onClick={() => dismiss(announcement)}
                aria-label="Dismiss"
              >
                <XMark />
              </IconButton>
            </div>
            {announcement.subtitle && (
              <Text size="small" className="text-ui-fg-subtle line-clamp-3">
                {announcement.subtitle}
              </Text>
            )}
            <div className="mt-2 flex empty:hidden">
              {announcement.content ? (
                <Button
                  size="small"
                  className="flex-1"
                  onClick={() => viewDetails(announcement)}
                >
                  View details
                </Button>
              ) : (
                announcement.link_url && (
                  <Button size="small" className="flex-1" asChild>
                    <a
                      href={announcement.link_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={() => dismiss(announcement)}
                    >
                      Learn more
                    </a>
                  </Button>
                )
              )}
            </div>
          </div>
        </Container>
      )}
      <Drawer
        open={!!details}
        onOpenChange={(open) => !open && setDetails(null)}
      >
        <Drawer.Content>
          {details && <AnnouncementDetails announcement={details} />}
        </Drawer.Content>
      </Drawer>
    </>
  )
}

export const config = defineWidgetConfig({
  zone: "sidebar.settings.before",
})

export default CloudAnnouncementCardWidget

import { ArrowUpRightOnBox, ArrowUturnLeft } from "@medusajs/icons"
import { Button, Drawer, Heading, IconButton } from "@medusajs/ui"
import { useMemo } from "react"
import { CloudAnnouncement } from "../../types"
import { sanitizeHtml } from "../lib/sanitize"

const contentClassName = [
  "txt-small text-ui-fg-subtle flex flex-col gap-y-4",
  "[&_h1]:txt-compact-large-plus [&_h2]:txt-compact-medium-plus [&_h3]:txt-compact-small-plus [&_h4]:txt-compact-small-plus",
  "[&_h1]:text-ui-fg-base [&_h2]:text-ui-fg-base [&_h3]:text-ui-fg-base [&_h4]:text-ui-fg-base [&_strong]:text-ui-fg-base [&_b]:text-ui-fg-base",
  "[&_a]:text-ui-fg-interactive [&_a:hover]:text-ui-fg-interactive-hover",
  "[&_ul]:list-disc [&_ol]:list-decimal [&_ul]:pl-5 [&_ol]:pl-5 [&_li+li]:mt-2",
  "[&_blockquote]:border-ui-border-strong [&_blockquote]:border-l-2 [&_blockquote]:pl-3",
  "[&_code]:txt-compact-xsmall [&_code]:bg-ui-bg-subtle [&_code]:rounded [&_code]:px-1 [&_code]:font-mono",
  "[&_pre]:bg-ui-contrast-bg-base [&_pre]:text-ui-contrast-fg-primary [&_pre]:overflow-x-auto [&_pre]:rounded-lg [&_pre]:p-3",
  "[&_pre_code]:bg-transparent [&_pre_code]:p-0",
  "[&_img]:shadow-borders-base [&_img]:max-w-full [&_img]:rounded-lg",
  "[&_hr]:border-ui-border-base",
].join(" ")

export const AnnouncementDetails = ({
  announcement,
  onBack,
}: {
  announcement: CloudAnnouncement
  onBack?: () => void
}) => {
  const html = useMemo(
    () => sanitizeHtml(announcement.content ?? ""),
    [announcement.content]
  )

  return (
    <>
      <Drawer.Header>
        <div className="flex items-center gap-x-2">
          {onBack && (
            <IconButton
              size="2xsmall"
              variant="transparent"
              className="-ml-1"
              onClick={onBack}
              aria-label="Back to all announcements"
            >
              <ArrowUturnLeft className="text-ui-fg-muted" />
            </IconButton>
          )}
          <Drawer.Title asChild>
            <Heading level="h2">{announcement.title}</Heading>
          </Drawer.Title>
        </div>
        <Drawer.Description className="sr-only">
          {announcement.subtitle ?? announcement.title}
        </Drawer.Description>
      </Drawer.Header>
      <Drawer.Body className="flex flex-col gap-y-6 overflow-y-auto p-6">
        {announcement.image_url && (
          <img
            src={announcement.image_url}
            alt=""
            className="shadow-borders-base aspect-video w-full rounded-lg object-cover"
          />
        )}
        <div
          className={contentClassName}
          dangerouslySetInnerHTML={{ __html: html }}
        />
      </Drawer.Body>
      <Drawer.Footer>
        <Drawer.Close asChild>
          <Button variant="secondary" size="small">
            Close
          </Button>
        </Drawer.Close>
        {announcement.link_url && (
          <Button size="small" asChild>
            <a
              href={announcement.link_url}
              target="_blank"
              rel="noopener noreferrer"
            >
              Learn more
              <ArrowUpRightOnBox />
            </a>
          </Button>
        )}
      </Drawer.Footer>
    </>
  )
}

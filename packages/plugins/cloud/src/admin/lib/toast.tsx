import { ArrowUpRightOnBox, SidebarRight, Sparkles } from "@medusajs/icons"
import { toast } from "@medusajs/ui"
import { CloudAnnouncement } from "../../types"
import { isAlert } from "./announcements"

/**
 * Shows an announcement as a toast that stays until it's dismissed. Its action
 * opens the details drawer when the announcement has content, or else its link.
 */
export const showAnnouncementToast = (
  announcement: CloudAnnouncement,
  onViewDetails: (announcement: CloudAnnouncement) => void
) => {
  const getAction = () => {
    if (announcement.content) {
      return {
        label: "View details",
        altText: `View details about: ${announcement.title}`,
        icon: <SidebarRight />,
        onClick: () => {
          toast.dismiss(toastId)
          onViewDetails(announcement)
        },
      }
    }

    if (announcement.link_url) {
      return {
        label: "Learn more",
        altText: `Learn more about: ${announcement.title}`,
        icon: <ArrowUpRightOnBox />,
        onClick: () => {
          toast.dismiss(toastId)
          window.open(announcement.link_url!, "_blank", "noopener,noreferrer")
        },
      }
    }
  }

  const toastId = toast(announcement.title, {
    description: announcement.subtitle ?? undefined,
    icon: (
      <Sparkles
        className={
          isAlert(announcement)
            ? "text-ui-tag-orange-icon"
            : "text-ui-tag-purple-icon"
        }
      />
    ),
    media: announcement.image_url ? (
      <img src={announcement.image_url} alt="" />
    ) : undefined,
    duration: Infinity,
    dismissable: true,
    action: getAction(),
  })
}

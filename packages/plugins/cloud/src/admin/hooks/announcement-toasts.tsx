import { useEffect } from "react"
import { useLocation } from "react-router-dom"
import { CloudAnnouncement } from "../../types"
import { getAnnouncementForPath } from "../lib/announcements"
import { addShownAnnouncementId, getShownAnnouncementIds } from "../lib/storage"
import { showAnnouncementToast } from "../lib/toast"

/**
 * When a page opens, shows the announcement for that page as a toast.
 */
export const useAnnouncementToasts = (
  announcements: CloudAnnouncement[],
  onViewDetails: (announcement: CloudAnnouncement) => void
) => {
  const { pathname } = useLocation()

  useEffect(() => {
    if (!announcements.length) {
      return
    }

    const announcement = getAnnouncementForPath(pathname, announcements, {
      shownIds: getShownAnnouncementIds(),
    })

    if (!announcement) {
      return
    }

    addShownAnnouncementId(announcement.id)
    showAnnouncementToast(announcement, onViewDetails)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname, announcements])
}

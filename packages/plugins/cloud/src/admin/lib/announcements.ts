import { CloudAnnouncement } from "../../types"

export const isAlert = (announcement: CloudAnnouncement) =>
  announcement.type === "warning" || announcement.type === "incident"

const normalizePath = (path: string) => path.replace(/\/+$/, "") || "/"

/**
 * Returns the announcement to show as a toast on a page, if any. An
 * announcement whose `admin_path` matches the page wins over one without an
 * `admin_path`, which can be shown on any page. Each announcement is shown
 * once per browser.
 */
export const getAnnouncementForPath = (
  pathname: string,
  announcements: CloudAnnouncement[],
  { shownIds }: { shownIds: string[] }
): CloudAnnouncement | undefined => {
  const path = normalizePath(pathname)
  const newAnnouncements = announcements.filter(
    (announcement) => !shownIds.includes(announcement.id)
  )

  return (
    newAnnouncements.find(
      (announcement) =>
        announcement.admin_path &&
        normalizePath(announcement.admin_path) === path
    ) ?? newAnnouncements.find((announcement) => !announcement.admin_path)
  )
}

import { CloudAnnouncement } from "../../types"

const normalizePath = (path: string) => path.replace(/\/+$/, "") || "/"

/**
 * Returns the announcement to show in the sidebar card on a page, if any. An
 * announcement whose `admin_path` matches the page wins over one without an
 * `admin_path`, which can be shown on any page. Dismissed announcements are
 * left out.
 */
export const getAnnouncementForPath = (
  pathname: string,
  announcements: CloudAnnouncement[],
  { dismissedIds }: { dismissedIds: string[] }
): CloudAnnouncement | undefined => {
  const path = normalizePath(pathname)
  const pending = announcements.filter(
    (announcement) => !dismissedIds.includes(announcement.id)
  )

  return (
    pending.find(
      (announcement) =>
        announcement.admin_path &&
        normalizePath(announcement.admin_path) === path
    ) ?? pending.find((announcement) => !announcement.admin_path)
  )
}

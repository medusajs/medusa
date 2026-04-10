"use client"

import React, { useEffect, useMemo, useState } from "react"
import { CloudAnnouncement } from "types"
import { useSiteConfig } from "../../../providers/SiteConfig"
import { getAnnouncements } from "../../../utils/get-announcements"
import { ContentMenuSection } from "../Section"
import clsx from "clsx"
import { useIsBrowser } from "../../../providers"

export const ContentMenuWhatsNew = () => {
  const {
    config: { version },
  } = useSiteConfig()
  const [announcements, setAnnouncements] = React.useState<CloudAnnouncement[]>(
    []
  )
  // merge announcements with the version announcement so that:
  // - we only show three announcements in total
  // - if there's no version announcement, we show the announcements as-is
  // - we sort the announcements based on their published date, showing the most recent ones first
  const mergedAnnouncements = useMemo(() => {
    if (!version) {
      // announcements are already sorted by published date and sliced to 3
      return announcements
    }

    const versionAnnouncement: CloudAnnouncement = {
      id: `version-${version.number}`,
      title: `v${version.number} is live`,
      subtitle: `See new features and improvements`,
      published_at: new Date(version.releaseDate),
      created_at: new Date(version.releaseDate),
      link_url: version.releaseUrl,
    }

    if (!announcements.length) {
      return [versionAnnouncement]
    }

    return [versionAnnouncement, ...announcements]
      .sort((a, b) => {
        const dateA = (a.published_at || a.created_at).getTime()
        const dateB = (b.published_at || b.created_at).getTime()
        return dateB - dateA
      })
      .slice(0, 3)
  }, [announcements, version])

  useEffect(() => {
    getAnnouncements()
      .then(setAnnouncements)
      .catch((e) => {
        // fail silently, we don't want to break the page if announcements can't be loaded
        console.error("Failed to load announcements", e)
      })
  }, [])

  if (!mergedAnnouncements.length) {
    return null
  }

  return (
    <ContentMenuSection title="What's new" hideChildrenDivider>
      <div className="px-docs_1 pt-docs_1 flex flex-col">
        {mergedAnnouncements.map((announcement, index) => (
          <Announcement key={index} announcement={announcement} />
        ))}
      </div>
    </ContentMenuSection>
  )
}

const Announcement = ({
  announcement,
}: {
  announcement: CloudAnnouncement
}) => {
  const { isBrowser } = useIsBrowser()
  const [isNew, setIsNew] = useState(false)
  useEffect(() => {
    if (!isBrowser) {
      return
    }

    const hasSeenAnnouncement = localStorage.getItem(
      `seen-announcement-${announcement.id}`
    )

    setIsNew(!hasSeenAnnouncement)
  }, [isBrowser, announcement.id])

  const enableHasSeenAnnouncement = () => {
    localStorage.setItem(`seen-announcement-${announcement.id}`, "true")
    setIsNew(false)
  }

  return (
    <div
      className="flex gap-docs_0.5 items-start last:[&_card]:!mb-0"
      onMouseOver={enableHasSeenAnnouncement}
    >
      <AnnouncementTracker isNew={isNew} />
      <div
        className={clsx(
          "flex flex-col px-docs_0.5 py-docs_0.25 rounded-docs_DEFAULT overflow-hidden relative",
          "bg-medusa-bg-component shadow-elevation-card-rest dark:shadow-elevation-card-rest-dark",
          "hover:shadow-elevation-card-hover dark:hover:shadow-elevation-card-hover-dark",
          "card mb-docs_0.75"
        )}
      >
        <span className="text-2x-small-plus text-medusa-fg-base truncate">
          {announcement.title}
        </span>
        <span className="text-2x-small-plus text-medusa-fg-subtle truncate">
          {announcement.subtitle}
        </span>
        <a
          href={announcement.link_url}
          target="_blank"
          rel="noopener noreferrer"
          className="absolute top-0 left-0 w-full h-full"
          title="Read more"
          aria-label="Read more"
        />
      </div>
    </div>
  )
}

const AnnouncementTracker = ({ isNew }: { isNew: boolean }) => {
  return (
    <div className="flex flex-col gap-docs_0.125 items-center h-full">
      <div className={clsx("h-docs_0.75 w-docs_0.75 relative rounded-full")}>
        <div
          className={clsx(
            "absolute top-0 left-0 w-full h-full rounded-full opacity-20",
            isNew && "bg-medusa-tag-orange-icon"
          )}
        />
        <div
          className={clsx(
            "w-[5px] h-[5px] rounded-full",
            "border-[0.5px] border-medusa-alphas-alpha-10",
            "absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2",
            isNew ? "bg-medusa-tag-orange-icon" : "bg-medusa-fg-disabled"
          )}
        />
      </div>
      <div className="flex-1 h-full w-[1.5px] bg-medusa-alphas-alpha-10" />
    </div>
  )
}

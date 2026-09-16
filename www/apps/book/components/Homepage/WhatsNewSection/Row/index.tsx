"use client"

import clsx from "clsx"
import { DocsTrackingEvents, useAnalytics, useModal } from "docs-ui"
import Link from "next/link"
import HomepageNewsletterForm from "../../NewsletterForm"
import { WhatsNewItem } from "../data"

const MONTHS = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
]

const formatDate = (date: string) => {
  const [year, month, day] = date.split("-")

  return `${day} ${MONTHS[parseInt(month, 10) - 1]} ${year}`
}

type HomepageWhatsNewRowProps = {
  item: WhatsNewItem
  position: number
  isLast: boolean
}

const HomepageWhatsNewRow = ({
  item,
  position,
  isLast,
}: HomepageWhatsNewRowProps) => {
  const { setModalProps } = useModal()
  const { track } = useAnalytics()

  const trackClick = () => {
    track({
      event: {
        event: DocsTrackingEvents.WHATS_NEW_ITEM_CLICK,
        options: {
          item_title: item.title,
          item_tag: item.tag,
          item_link: item.link ?? null,
          item_date: item.date ?? null,
          item_coming_soon: !!item.comingSoon,
          item_position: position,
        },
      },
    })
  }

  const className = clsx(
    "w-full text-left flex-1 flex flex-col gap-0.5 px-2 py-1.5",
    "sm:grid sm:grid-cols-[96px_minmax(0,1fr)_auto] sm:items-center sm:gap-1.5",
    "transition-colors",
    item.comingSoon
      ? "bg-medusa-bg-highlight hover:bg-medusa-bg-highlight-hover"
      : "hover:bg-medusa-bg-base-hover",
    !isLast && "border-b border-medusa-border-base"
  )

  const content = (
    <>
      {item.comingSoon ? (
        <span
          className={clsx(
            "text-code-paragraph-2xsmall font-monospace uppercase",
            "text-medusa-tag-blue-text"
          )}
        >
          [Soon]
        </span>
      ) : (
        <span
          className={clsx(
            "text-code-paragraph-xsmall font-monospace",
            "text-medusa-fg-subtle"
          )}
        >
          {formatDate(item.date)}
        </span>
      )}
      <h3 className="text-medium-plus text-medusa-fg-base">{item.title}</h3>
      <span
        className={clsx(
          "w-fit whitespace-nowrap rounded-full px-0.5 py-0.25",
          "text-code-paragraph-2xsmall font-monospace",
          "border border-medusa-tag-neutral-border text-medusa-tag-neutral-text",
          item.comingSoon ? "bg-medusa-bg-base" : "bg-medusa-tag-neutral-bg"
        )}
      >
        {item.tag}
      </span>
    </>
  )

  if (item.comingSoon) {
    return (
      <button
        type="button"
        className={clsx(className, "appearance-none cursor-pointer")}
        onClick={() => {
          trackClick()
          setModalProps({
            title: `${item.title} is coming soon`,
            children: (
              <div className="flex flex-col gap-1">
                <p className="text-medium text-medusa-fg-subtle">
                  Subscribe to our newsletter to be the first to know when it
                  ships.
                </p>
                <HomepageNewsletterForm autoFocus />
              </div>
            ),
          })
        }}
      >
        {content}
      </button>
    )
  }

  return (
    <Link href={item.link} className={className} onClick={trackClick}>
      {content}
    </Link>
  )
}

export default HomepageWhatsNewRow

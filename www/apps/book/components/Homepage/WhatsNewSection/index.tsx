import clsx from "clsx"
import { HeadlineTags } from "docs-ui"
import HomepageWhatsNewRow from "./Row"
import { MAX_WHATS_NEW_ITEMS, whatsNewItems, WhatsNewItem } from "./data"

const sortItems = (a: WhatsNewItem, b: WhatsNewItem) => {
  if (!!a.comingSoon !== !!b.comingSoon) {
    return a.comingSoon ? -1 : 1
  }

  return (b.date ?? "").localeCompare(a.date ?? "")
}

const HomepageWhatsNewSection = () => {
  const items = [...whatsNewItems].sort(sortItems).slice(0, MAX_WHATS_NEW_ITEMS)

  return (
    <div
      className={clsx(
        "w-full flex flex-col md:flex-row",
        "border-b border-medusa-border-base"
      )}
    >
      <div
        className={clsx(
          "p-2 w-full md:w-1/3 flex flex-col justify-center gap-0.75",
          "bg-medusa-bg-component",
          "border-b border-medusa-border-base md:border-b-0 md:border-r"
        )}
      >
        <HeadlineTags tags={["What's New"]} className="!justify-start" />
        <h2 className="text-h1 text-medusa-fg-base">
          New features, releases, and guides.
        </h2>
        <p className="txt-large text-medusa-fg-base">
          Learn more about what we&apos;re shipping.
        </p>
      </div>
      <div className="w-full md:w-2/3 flex flex-col">
        {items.map((item, index) => (
          <HomepageWhatsNewRow
            key={index}
            item={item}
            isLast={index === items.length - 1}
          />
        ))}
      </div>
    </div>
  )
}

export default HomepageWhatsNewSection

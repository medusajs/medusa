import React, { type ReactNode } from "react"
import clsx from "clsx"
import Link from "@docusaurus/Link"
import {
  findFirstSidebarItemLink,
  useDocById,
} from "@docusaurus/theme-common/internal"
import isInternalUrl from "@docusaurus/isInternalUrl"
import { translate } from "@docusaurus/Translate"
import {
  ModifiedDocCard,
  ModifiedDocCardItemCategory,
  ModifiedDocCardItemLink,
  ModifiedSidebarItem,
} from "@medusajs/docs"
import { Badge } from "docs-ui"
import Icons from "../Icon"
import BorderedIcon from "../../components/BorderedIcon"

type ModifiedProps = {
  item: ModifiedDocCard
}

function CardContainer({
  href,
  children,
  className,
}: {
  href: string
  children: ReactNode
  className?: string
}): JSX.Element {
  return (
    <article className={`card-wrapper margin-bottom--lg`}>
      <Link
        href={href}
        className={clsx(
          "card",
          "bg-medusa-bg-subtle dark:bg-medusa-bg-base",
          "rounded shadow-card-rest dark:shadow-card-rest-dark",
          "transition-all duration-200 ease-ease",
          "flex p-1 !pb-1.5 h-full",
          className
        )}
      >
        {children}
      </Link>
    </article>
  )
}

function CardLayout({
  href,
  icon,
  title,
  description,
  html,
  containerClassName,
  isSoon = false,
  badge,
}: ModifiedDocCard): JSX.Element {
  const isHighlighted = containerClassName?.includes("card-highlighted")
  return (
    <CardContainer
      href={href}
      className={clsx(
        containerClassName,
        !isSoon &&
          "hover:bg-medusa-bg-subtle-hover dark:hover:bg-medusa-bg-base-hover",
        isSoon && "pointer-events-none",
        isHighlighted &&
          "md:before:content-[''] md:before:absolute md:before:top-0 before:right-0 md:before:w-1/2 md:before:h-full md:before:bg-no-repeat md:before:bg-cover md:before:bg-card-highlighted dark:md:before:bg-card-highlighted-dark",
        !isSoon && "hover:shadow-card-hover dark:hover:shadow-card-hover-dark"
      )}
    >
      <div className={clsx("mb-1 flex justify-between items-center")}>
        {icon}
        {isSoon && <Badge variant={"purple"}>Guide coming soon</Badge>}
        {badge && <Badge {...badge} />}
      </div>
      <div className={clsx("w-[calc(100%-20px)] [&>*:last-child]:mb-0")}>
        <span
          className={clsx(
            "text-compact-medium-plus text-medusa-fg-base",
            "mb-0.25 block",
            "transition-all duration-200 ease-ease",
            isSoon && "group-hover:text-medusa-fg-disabled"
          )}
          title={title}
        >
          {title}
        </span>
        {description && (
          <p
            className={clsx(
              "text-medium text-medusa-fg-subtle",
              "transition-all duration-200 ease-ease",
              isSoon && "group-hover:text-medusa-fg-disabled",
              isHighlighted && "md:w-1/2"
            )}
            title={description}
          >
            {description}
          </p>
        )}
        {html && (
          <p
            className={clsx(
              "text-compact-medium text-medusa-fg-subtle",
              "transition-all duration-200 ease-ease",
              isSoon && "group-hover:text-medusa-fg-disabled",
              isHighlighted && "md:w-1/2"
            )}
            dangerouslySetInnerHTML={{
              __html: html,
            }}
          ></p>
        )}
      </div>
    </CardContainer>
  )
}

function getCardIcon(item: ModifiedSidebarItem): JSX.Element {
  if (item.customProps?.themedImage) {
    return (
      <BorderedIcon
        icon={{
          light: item.customProps.themedImage.light,
          dark: item.customProps.themedImage.dark,
        }}
        iconWrapperClassName={clsx("p-[6px]")}
        iconClassName={clsx("h-[20px] w-[20px]")}
      />
    )
  } else if (item.customProps?.image) {
    return (
      <BorderedIcon
        icon={{
          light: item.customProps.image,
        }}
        iconWrapperClassName={clsx("p-[6px]")}
        iconClassName={clsx("h-[20px] w-[20px]")}
      />
    )
  } else if (item.customProps?.icon) {
    return (
      <BorderedIcon
        IconComponent={item.customProps.icon}
        iconWrapperClassName={clsx("p-[6px]")}
        iconClassName={clsx("h-[20px] w-[20px]")}
      />
    )
  } else if (
    item.customProps?.iconName &&
    Object.hasOwn(Icons, item.customProps?.iconName)
  ) {
    return (
      <BorderedIcon
        IconComponent={Icons[item.customProps?.iconName]}
        iconWrapperClassName={clsx("p-[6px]")}
        iconClassName={clsx("h-[20px] w-[20px]")}
      />
    )
  } else {
    return (
      <div
        className={clsx(
          // "card-icon-wrapper",
          "no-zoom-img"
        )}
      >
        {isInternalUrl(
          "href" in item ? item.href : "value" in item ? item.value : "#"
        )
          ? "📄️"
          : "🔗"}
      </div>
    )
  }
}

function CardCategory({
  item,
}: {
  item: ModifiedDocCardItemCategory
}): JSX.Element | null {
  const href = findFirstSidebarItemLink(item)
  const icon = getCardIcon(item)

  // Unexpected: categories that don't have a link have been filtered upfront
  if (!href) {
    return null
  }

  return (
    <CardLayout
      {...item}
      href={href}
      icon={icon}
      title={item.label}
      // eslint-disable-next-line @docusaurus/string-literal-i18n-messages
      description={translate(
        {
          message: item.customProps?.description || "{count} items",
          id: "theme.docs.DocCard.categoryDescription",
          description:
            "The default description for a category card in the generated index about how many items this category includes",
        },
        { count: item.items.length }
      )}
      containerClassName={item.customProps?.className}
      isSoon={item.customProps?.isSoon}
      badge={item.customProps?.badge}
    />
  )
}

function CardLink({ item }: { item: ModifiedDocCardItemLink }): JSX.Element {
  const icon = getCardIcon(item)
  const doc = useDocById(item.docId ?? undefined)
  return (
    <CardLayout
      {...item}
      icon={icon}
      title={item.label}
      description={item.customProps?.description || doc?.description}
      html={item.customProps?.html}
      containerClassName={item.customProps?.className}
      isSoon={item.customProps?.isSoon}
      badge={item.customProps?.badge}
    />
  )
}

export default function DocCard({ item }: ModifiedProps): JSX.Element {
  switch (item.type) {
    case "link":
      return <CardLink item={item} />
    case "category":
      return <CardCategory item={item} />
    default:
      throw new Error(`unknown item type ${JSON.stringify(item)}`)
  }
}

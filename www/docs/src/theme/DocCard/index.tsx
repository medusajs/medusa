import React, { type ReactNode } from "react"
import clsx from "clsx"
import Link from "@docusaurus/Link"
import {
  findFirstCategoryLink,
  useDocById,
} from "@docusaurus/theme-common/internal"
import isInternalUrl from "@docusaurus/isInternalUrl"
import { translate } from "@docusaurus/Translate"
import BorderedIcon from "@site/src/components/BorderedIcon"
import Badge from "@site/src/components/Badge"
import Icons from "@site/src/theme/Icon"
import {
  ModifiedDocCard,
  ModifiedDocCardItemCategory,
  ModifiedDocCardItemLink,
  ModifiedSidebarItem,
} from "@medusajs/docs"

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
          "tw-bg-medusa-bg-subtle dark:tw-bg-medusa-bg-base-dark",
          "tw-rounded tw-shadow-card-rest dark:tw-shadow-card-rest-dark",
          "tw-transition-all tw-duration-200 tw-ease-ease",
          "tw-flex tw-p-1 !tw-pb-1.5 tw-h-full",
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
          "hover:tw-bg-medusa-bg-subtle-hover dark:hover:tw-bg-medusa-bg-base-hover-dark",
        isSoon && "tw-pointer-events-none",
        isHighlighted &&
          "md:before:tw-content-[''] md:before:tw-absolute md:before:tw-top-0 before:tw-right-0 md:before:tw-w-1/2 md:before:tw-h-full md:before:tw-bg-no-repeat md:before:tw-bg-cover md:before:tw-bg-card-highlighted dark:md:before:tw-bg-card-highlighted-dark",
        !isSoon &&
          "hover:tw-shadow-card-hover dark:hover:tw-shadow-card-hover-dark"
      )}
    >
      <div
        className={clsx("tw-mb-1 tw-flex tw-justify-between tw-items-center")}
      >
        {icon}
        {isSoon && <Badge variant={"purple"}>Guide coming soon</Badge>}
        {badge && <Badge {...badge} />}
      </div>
      <div className={clsx("tw-w-[calc(100%-20px)] [&>*:last-child]:tw-mb-0")}>
        <span
          className={clsx(
            "tw-text-label-regular-plus tw-text-medusa-text-base dark:tw-text-medusa-text-base-dark",
            "tw-mb-[4px] tw-block",
            "tw-transition-all tw-duration-200 tw-ease-ease",
            isSoon &&
              "group-hover:tw-text-medusa-text-disabled dark:group-hover:tw-text-medusa-text-disabled-dark"
          )}
          title={title}
        >
          {title}
        </span>
        {description && (
          <p
            className={clsx(
              "tw-text-body-regular tw-text-medusa-text-subtle dark:tw-text-medusa-text-subtle-dark",
              "tw-transition-all tw-duration-200 tw-ease-ease",
              isSoon &&
                "group-hover:tw-text-medusa-text-disabled dark:group-hover:tw-text-medusa-text-disabled-dark",
              isHighlighted && "md:tw-w-1/2"
            )}
            title={description}
          >
            {description}
          </p>
        )}
        {html && (
          <p
            className={clsx(
              "tw-text-label-regular tw-text-medusa-text-subtle dark:tw-text-medusa-text-subtle-dark",
              "tw-transition-all tw-duration-200 tw-ease-ease",
              isSoon &&
                "group-hover:tw-text-medusa-text-disabled dark:group-hover:tw-text-medusa-text-disabled-dark",
              isHighlighted && "md:tw-w-1/2"
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
        iconWrapperClassName={clsx("tw-p-[6px]")}
        iconClassName={clsx("tw-h-[20px] tw-w-[20px]")}
      />
    )
  } else if (item.customProps?.image) {
    return (
      <BorderedIcon
        icon={{
          light: item.customProps.image,
        }}
        iconWrapperClassName={clsx("tw-p-[6px]")}
        iconClassName={clsx("tw-h-[20px] tw-w-[20px]")}
      />
    )
  } else if (item.customProps?.icon) {
    return (
      <BorderedIcon
        IconComponent={item.customProps.icon}
        iconWrapperClassName={clsx("tw-p-[6px]")}
        iconClassName={clsx("tw-h-[20px] tw-w-[20px]")}
      />
    )
  } else if (
    item.customProps?.iconName &&
    Object.hasOwn(Icons, item.customProps?.iconName)
  ) {
    return (
      <BorderedIcon
        IconComponent={Icons[item.customProps?.iconName]}
        iconWrapperClassName={clsx("tw-p-[6px]")}
        iconClassName={clsx("tw-h-[20px] tw-w-[20px]")}
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
  const href = findFirstCategoryLink(item)
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

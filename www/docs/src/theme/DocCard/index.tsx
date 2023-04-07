import React, { type ReactNode } from "react"
import clsx from "clsx"
import Link from "@docusaurus/Link"
import {
  findFirstCategoryLink,
  useDocById,
} from "@docusaurus/theme-common/internal"
import isInternalUrl from "@docusaurus/isInternalUrl"
import { translate } from "@docusaurus/Translate"
import type { Props } from "@theme/DocCard"

import styles from "./styles.module.css"
import BorderedIcon from "@site/src/components/BorderedIcon"
import Badge, { BadgeProps } from "@site/src/components/Badge"
import Icons from "@site/src/theme/Icon"
import {
  ModifiedPropSidebarItemCategory,
  ModifiedPropSidebarItemLink,
  ModifiedSidebarItem,
} from "@medusajs/docs"

type ModifiedProps = {
  item: ModifiedSidebarItem
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
        className={clsx("card", styles.cardContainer, className)}
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
}: {
  href: string
  icon: ReactNode
  title: string
  description?: string
  html?: string
  containerClassName?: string
  isSoon?: boolean
  badge?: BadgeProps
}): JSX.Element {
  return (
    <CardContainer
      href={href}
      className={clsx(containerClassName, isSoon && styles.cardSoon)}
    >
      <div className={clsx(styles.cardIconContainer)}>
        {icon}
        {isSoon && <Badge variant={"purple"}>Guide coming soon</Badge>}
        {badge && <Badge {...badge} />}
      </div>
      <div className={clsx(styles.contentContainer)}>
        <span className={clsx(styles.cardTitle)} title={title}>
          {title}
        </span>
        {description && (
          <p className={clsx(styles.cardDescription)} title={description}>
            {description}
          </p>
        )}
        {html && (
          <p
            className={clsx(styles.cardDescription)}
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
        wrapperClassName="card-icon-wrapper"
        iconClassName={"card-icon"}
      />
    )
  } else if (item.customProps?.image) {
    return (
      <BorderedIcon
        icon={{
          light: item.customProps.image,
        }}
        wrapperClassName="card-icon-wrapper"
        iconClassName={"card-icon"}
      />
    )
  } else if (item.customProps?.icon) {
    return (
      <BorderedIcon
        IconComponent={item.customProps.icon}
        wrapperClassName="card-icon-wrapper"
        iconClassName={"card-icon"}
      />
    )
  } else if (
    item.customProps?.iconName &&
    Object.hasOwn(Icons, item.customProps?.iconName)
  ) {
    return (
      <BorderedIcon
        IconComponent={Icons[item.customProps?.iconName]}
        wrapperClassName="card-icon-wrapper"
        iconClassName={"card-icon"}
      />
    )
  } else {
    return (
      <div className={clsx("card-icon-wrapper", "no-zoom-img")}>
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
  item: ModifiedPropSidebarItemCategory
}): JSX.Element | null {
  const href = findFirstCategoryLink(item)
  const icon = getCardIcon(item)
  // Unexpected: categories that don't have a link have been filtered upfront
  if (!href) {
    return null
  }
  return (
    <CardLayout
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

function CardLink({
  item,
}: {
  item: ModifiedPropSidebarItemLink
}): JSX.Element {
  const icon = getCardIcon(item)
  const doc = useDocById(item.docId ?? undefined)

  return (
    <CardLayout
      href={item.href}
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

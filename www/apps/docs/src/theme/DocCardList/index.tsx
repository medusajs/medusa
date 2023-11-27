import React from "react"
import clsx from "clsx"
import {
  useCurrentSidebarCategory,
  filterDocCardListItems,
} from "@docusaurus/theme-common"
import DocCard from "@theme/DocCard"
import type { Props } from "@theme/DocCardList"

type ModifiedProps = {
  colSize?: string
} & Props

function DocCardListForCurrentSidebarCategory({
  className,
  ...rest
}: ModifiedProps) {
  const category = useCurrentSidebarCategory()
  return <DocCardList className={className} {...rest} items={category.items} />
}

export default function DocCardList(props: ModifiedProps): JSX.Element {
  const { items, className } = props
  if (!items) {
    return <DocCardListForCurrentSidebarCategory {...props} />
  }
  const filteredItems = filterDocCardListItems(items).filter(
    (item) => !item.customProps?.exclude_from_doclist
  )
  return (
    <section
      className={clsx("cards-grid", `grid-${props.colSize || "4"}`, className)}
    >
      {filteredItems.map((item, index) => (
        <DocCard item={item} key={index} />
      ))}
    </section>
  )
}

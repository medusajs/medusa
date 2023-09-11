import React from "react"
import clsx from "clsx"
import {
  useCurrentSidebarCategory,
  filterDocCardListItems,
} from "@docusaurus/theme-common"
import DocCard from "@theme/DocCard"
import type { Props } from "@theme/DocCardList"

function DocCardListForCurrentSidebarCategory({ className }: Props) {
  const category = useCurrentSidebarCategory()
  return <DocCardList items={category.items} className={className} />
}

type ModifiedProps = {
  colSize?: string
} & Props

export default function DocCardList(props: ModifiedProps): JSX.Element {
  const { items, className } = props
  if (!items) {
    return <DocCardListForCurrentSidebarCategory {...props} />
  }
  const filteredItems = filterDocCardListItems(items)
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

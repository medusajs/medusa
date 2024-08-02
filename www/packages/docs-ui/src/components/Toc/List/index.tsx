import React from "react"
import { ToCItem } from "types"

export type TocListProps = {
  items: ToCItem[]
}

export const TocList = ({ items }: TocListProps) => {
  return (
    <ul>
      {items.map((item, key) => (
        <li key={key}>
          {item.title}
          {item.children && <TocList items={item.children} />}
        </li>
      ))}
    </ul>
  )
}

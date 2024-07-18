import React, { useRef } from "react"
import { useObserveWidth } from "../../../hooks/use-observe-width"
import Badge from "../../fundamentals/badge"

export type GiftCardVariant = {
  prices: {
    currency_code: string
    amount: number
  }[]
}

type TagGridProps = {
  tags: string[]
  badgeVariant: "primary" | "danger" | "success" | "warning" | "default"
}

const TagGrid: React.FC<TagGridProps> = ({ tags, badgeVariant }) => {
  const containerRef = useRef(null)
  const width = useObserveWidth(containerRef)
  const columns = Math.max(Math.floor(width / 70) - 1, 1)
  const visibleTags = tags.slice(0, columns)
  const remainder = tags.length - columns

  return (
    <div className="gap-x-2xsmall flex w-1/2 items-center" ref={containerRef}>
      {visibleTags?.map((tag, index) => {
        return (
          <Badge className="me-2xsmall" key={index} variant={badgeVariant}>
            {tag}
          </Badge>
        )
      })}
      {remainder > 0 && <Badge variant="default">+{remainder}</Badge>}
    </div>
  )
}

export default TagGrid

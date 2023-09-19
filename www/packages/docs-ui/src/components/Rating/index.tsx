"use client"

import React, { useRef, useState } from "react"
import clsx from "clsx"
import { Star, StarSolid } from "@medusajs/icons"
import { Button } from "@/components"
import { useAnalytics } from "@/providers"

export type RatingProps = {
  event?: string
  className?: string
  onRating?: () => void
} & React.HTMLAttributes<HTMLDivElement>

export const Rating: React.FC<RatingProps> = ({
  event = "rating",
  className = "",
  onRating,
}) => {
  const [rating, setRating] = useState(0)
  const [hoverRating, setHoverRating] = useState(0)
  const starElms = useRef<HTMLElement[]>([])
  const starArr = Array.from(Array(5).keys())
  const { track } = useAnalytics()

  const handleRating = (selectedRating: number) => {
    if (rating) {
      return
    }
    setHoverRating(0)
    setRating(selectedRating)
    for (let i = 0; i < selectedRating; i++) {
      starElms.current[i].classList.add("animate-tada")
    }
    track(
      event,
      {
        rating: selectedRating,
      },
      () => onRating?.()
    )
  }

  return (
    <div className={clsx("flex gap-docs_0.5", className)}>
      {starArr.map((i) => {
        const isSelected =
          (rating !== 0 && rating - 1 >= i) ||
          (hoverRating !== 0 && hoverRating - 1 >= i)
        return (
          <Button
            variant="clear"
            buttonRef={(element) => {
              if (starElms.current.length - 1 < i) {
                starElms.current.push(element as HTMLElement)
              }
            }}
            key={i}
            onMouseOver={() => {
              if (!rating) {
                setHoverRating(i + 1)
              }
            }}
            onMouseLeave={() => {
              if (!rating) {
                setHoverRating(0)
              }
            }}
            onClick={() => handleRating(i + 1)}
          >
            {!isSelected && <Star />}
            {isSelected && (
              <StarSolid className="text-medusa-tag-orange-icon dark:text-medusa-tag-orange-icon-dark" />
            )}
          </Button>
        )
      })}
    </div>
  )
}

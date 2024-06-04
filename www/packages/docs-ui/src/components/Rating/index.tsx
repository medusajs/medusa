"use client"

import React, { useCallback, useEffect, useRef, useState } from "react"
import clsx from "clsx"
import { Star, StarSolid } from "@medusajs/icons"
import { Button, Label, TextArea } from "@/components"
import { useAnalytics, useNotifications } from "@/providers"

export type RatingProps = {
  event?: string
  className?: string
  onRating?: (rating?: number) => void
  additionalQuestion?: string
  parentNotificationId?: string
} & React.HTMLAttributes<HTMLDivElement>

export const Rating: React.FC<RatingProps> = ({
  event = "rating",
  className = "",
  onRating,
  additionalQuestion = "What should we improve?",
  parentNotificationId,
}) => {
  const [rating, setRating] = useState(0)
  const [additionalFeedback, setAdditionalFeedback] = useState("")
  const [hoverRating, setHoverRating] = useState(0)
  const starElms = useRef<HTMLElement[]>([])
  const starArr = Array.from(Array(5).keys())
  const { track } = useAnalytics()
  const { updateNotification } = useNotifications(true) || {}

  const submitTracking = useCallback(
    (selectedRating?: number, feedback?: string) => {
      track(
        event,
        {
          rating: selectedRating || rating,
          additionalFeedback: feedback || additionalFeedback,
        },
        () => onRating?.(selectedRating || rating)
      )
    },
    [rating, additionalFeedback]
  )

  const handleRating = (selectedRating: number) => {
    if (rating) {
      return
    }
    setHoverRating(0)
    setRating(selectedRating)
    if (selectedRating >= 4) {
      for (let i = 0; i < selectedRating; i++) {
        starElms.current[i].classList.add("animate-tada")
      }
      submitTracking(selectedRating)
    }
  }

  useEffect(() => {
    if (
      rating > 0 &&
      rating < 4 &&
      parentNotificationId &&
      updateNotification
    ) {
      // update parent notification ID
      updateNotification(parentNotificationId, {
        closeButtonText: "Submit",
        onClose: () => submitTracking(rating, additionalFeedback),
      })
    }
  }, [additionalFeedback, rating])

  return (
    <div className={clsx("flex flex-col gap-docs_1")}>
      <div className={clsx("flex gap-docs_0.5", className)}>
        {starArr.map((i) => {
          const isSelected =
            (rating !== 0 && rating - 1 >= i) ||
            (hoverRating !== 0 && hoverRating - 1 >= i)
          return (
            <Button
              variant="transparent"
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
                <StarSolid className="text-medusa-tag-orange-icon" />
              )}
            </Button>
          )
        })}
      </div>
      {rating !== 0 && rating < 4 && (
        <div
          className={clsx(
            "text-medusa-fg-subtle",
            "flex flex-col gap-docs_0.5"
          )}
        >
          <Label>{additionalQuestion}</Label>
          <TextArea
            placeholder="I didn't like..."
            rows={4}
            onChange={(e) => setAdditionalFeedback(e.target.value)}
            value={additionalFeedback}
            className="w-full"
          />
        </div>
      )}
    </div>
  )
}

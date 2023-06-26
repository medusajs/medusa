import { useUser } from "@site/src/providers/User"
import IconStar from "@site/src/theme/Icon/Star"
import IconStarSolid from "@site/src/theme/Icon/StarSolid"
import clsx from "clsx"
import React, { useRef, useState } from "react"

type RatingProps = {
  event?: string
  className?: string
  onRating?: () => void
} & React.HTMLAttributes<HTMLDivElement>

const Rating: React.FC<RatingProps> = ({
  event = "rating",
  className = "",
  onRating,
}) => {
  const [rating, setRating] = useState(0)
  const [hoverRating, setHoverRating] = useState(0)
  const starElms = useRef<HTMLElement[]>([])
  const starArr = Array.from(Array(5).keys())
  const { track } = useUser()

  const handleRating = (selectedRating: number) => {
    if (rating) {
      return
    }
    setHoverRating(0)
    setRating(selectedRating)
    for (let i = 0; i < selectedRating; i++) {
      starElms.current[i].classList.add("animate__animated", "animate__tada")
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
    <div className={clsx("tw-flex tw-gap-0.5", className)}>
      {starArr.map((i) => {
        const isSelected =
          (rating !== 0 && rating - 1 >= i) ||
          (hoverRating !== 0 && hoverRating - 1 >= i)
        return (
          <button
            className="transparent-button"
            ref={(element) => {
              if (starElms.current.length - 1 < i) {
                starElms.current.push(element)
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
            {!isSelected && <IconStar />}
            {isSelected && (
              <IconStarSolid iconColorClassName="tw-fill-medusa-tag-orange-icon dark:tw-fill-medusa-tag-orange-icon-dark" />
            )}
          </button>
        )
      })}
    </div>
  )
}

export default Rating

import { LearningPathStepType } from "@/providers"
import { Rating } from "docs-ui"
import React from "react"

export type LearningPathFinishType =
  | {
      type: "rating"
      step: Omit<LearningPathStepType, "descriptionJSX"> & {
        eventName?: string
      }
    }
  | {
      type: "custom"
      step: LearningPathStepType & {
        descriptionJSX: JSX.Element
      }
    }

type LearningPathFinishProps = LearningPathFinishType & {
  onRating?: () => void
}

export const LearningPathFinish = ({
  type,
  step,
  onRating,
}: LearningPathFinishProps) => {
  return (
    <>
      {type === "rating" && (
        <Rating event={step.eventName} onRating={onRating} />
      )}
      {type === "custom" && (
        <span className="text-compact-small text-medusa-fg-subtle">
          {step.descriptionJSX}
        </span>
      )}
    </>
  )
}

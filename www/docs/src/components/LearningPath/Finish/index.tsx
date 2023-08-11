import { LearningPathStepType } from "@site/src/providers/LearningPath"
import React from "react"
import Rating from "../../Rating"

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

const LearningPathFinish: React.FC<LearningPathFinishProps> = ({
  type,
  step,
  onRating,
}) => {
  return (
    <>
      {type === "rating" && (
        <Rating event={step.eventName} onRating={onRating} />
      )}
      {type === "custom" && (
        <span className="tw-text-label-small tw-text-medusa-text-subtle dark:tw-text-medusa-text-subtle-dark">
          {step.descriptionJSX}
        </span>
      )}
    </>
  )
}

export default LearningPathFinish

import { LearningPathStepType } from "@site/src/providers/LearningPath"
import React from "react"
import LearningPathStepActions from "./Actions"

type LearningPathStepProps = {
  step: LearningPathStepType
  onFinish?: () => void
}

const LearningPathStep: React.FC<LearningPathStepProps> = ({
  step,
  ...rest
}) => {
  return (
    <div>
      {step?.descriptionJSX && (
        <span className="tw-text-label-small tw-text-medusa-text-subtle dark:tw-text-medusa-text-subtle-dark tw-mb-1 tw-block">
          {step.descriptionJSX}
        </span>
      )}
      <LearningPathStepActions {...rest} />
    </div>
  )
}

export default LearningPathStep

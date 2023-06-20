import Button from "@site/src/components/Button"
import { useLearningPath } from "@site/src/providers/LearningPath"
import React from "react"

type LearningPathStepActionsType = {
  onFinish?: () => void
  onClose?: () => void
} & React.AllHTMLAttributes<HTMLDivElement>

const LearningPathStepActions: React.FC<LearningPathStepActionsType> = ({
  onFinish,
  onClose,
}) => {
  const { hasNextStep, nextStep, endPath } = useLearningPath()

  const handleFinish = () => {
    if (onFinish) {
      onFinish()
    } else {
      endPath()
    }
  }

  return (
    <div className="tw-flex tw-gap-0.5 tw-p-1 tw-justify-end tw-items-center">
      <Button onClick={onClose}>Close</Button>
      {hasNextStep() && (
        <Button onClick={nextStep} btnTypeClassName="btn-inverted">
          Next
        </Button>
      )}
      {!hasNextStep() && (
        <Button onClick={handleFinish} btnTypeClassName="btn-inverted">
          Finish
        </Button>
      )}
    </div>
  )
}

export default LearningPathStepActions

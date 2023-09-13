import React from "react"
import { useLearningPath } from "../../../../providers/LearningPath"
import { Button } from "docs-ui"

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
    <div className="flex gap-0.5 p-1 justify-end items-center">
      <Button onClick={onClose}>Close</Button>
      {hasNextStep() && (
        <Button onClick={nextStep} variant="primary">
          Next
        </Button>
      )}
      {!hasNextStep() && (
        <Button onClick={handleFinish} variant="primary">
          Finish
        </Button>
      )}
    </div>
  )
}

export default LearningPathStepActions

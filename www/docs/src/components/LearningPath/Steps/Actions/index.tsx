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
    <div className="flex gap-0.5 p-1 justify-end items-center">
      <Button onClick={onClose}>Close</Button>
      {hasNextStep() && (
        <Button onClick={nextStep} btnTypeClassName="btn-primary">
          Next
        </Button>
      )}
      {!hasNextStep() && (
        <Button onClick={handleFinish} btnTypeClassName="btn-primary">
          Finish
        </Button>
      )}
    </div>
  )
}

export default LearningPathStepActions

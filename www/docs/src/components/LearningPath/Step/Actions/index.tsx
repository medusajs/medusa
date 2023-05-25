import Button from "@site/src/components/Button"
import { useLearningPath } from "@site/src/providers/LearningPath"
import React from "react"

type LearningPathStepActionsType = {
  onFinish?: () => void
} & React.AllHTMLAttributes<HTMLDivElement>

const LearningPathStepActions: React.FC<LearningPathStepActionsType> = ({
  onFinish,
}) => {
  const {
    hasNextStep,
    nextStep,
    hasPreviousStep,
    previousStep,
    endPath,
    isCurrentPath,
    goToCurrentPath,
  } = useLearningPath()

  const handleFinish = () => {
    if (onFinish) {
      onFinish()
    } else {
      endPath()
    }
  }

  return (
    <div className="tw-flex tw-gap-[4px]">
      {hasPreviousStep() && <Button onClick={previousStep}>Back</Button>}
      {!isCurrentPath() && (
        <Button onClick={goToCurrentPath}>Go to Current Step</Button>
      )}
      {hasNextStep() && <Button onClick={nextStep}>Next</Button>}
      {!hasNextStep() && <Button onClick={handleFinish}>Finish</Button>}
    </div>
  )
}

export default LearningPathStepActions

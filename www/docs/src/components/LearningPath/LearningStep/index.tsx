import React from "react"
import { useLearningPath } from "@site/src/providers/LearningPath"
import Notification, { NotificationProps } from "../../Notification"
import Button from "../../Button"

type LearningStepProps = {
  notificationProps?: NotificationProps
}

const LearningStep: React.FC<LearningStepProps> = ({ notificationProps }) => {
  const {
    hasNextStep,
    nextStep,
    path,
    currentStep,
    hasPreviousStep,
    previousStep,
    endPath,
  } = useLearningPath()
  const step = path.steps[currentStep]

  const handleClose = () => {
    endPath()
  }

  return (
    <Notification
      title={`${path.label}: Step ${currentStep + 1}`}
      text={step?.description}
      onClose={handleClose}
      {...notificationProps}
    >
      <div className="tw-flex tw-gap-[4px]">
        {hasPreviousStep() && <Button onClick={previousStep}>Back</Button>}
        {hasNextStep() && <Button onClick={nextStep}>Next</Button>}
        {!hasNextStep() && <Button onClick={handleClose}>Finish</Button>}
      </div>
    </Notification>
  )
}

export default LearningStep

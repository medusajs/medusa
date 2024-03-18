import React from "react"
import { useLearningPath } from "../../../../providers/LearningPath"
import { Button } from "docs-ui"
import { ArrowDownLeftMini, ArrowDownMini } from "@medusajs/icons"

type LearningPathStepActionsType = {
  onFinish?: () => void
  onClose?: () => void
  setCollapsed: React.Dispatch<React.SetStateAction<boolean>>
} & React.AllHTMLAttributes<HTMLDivElement>

export const LearningPathStepActions = ({
  onFinish,
  onClose,
  setCollapsed,
}: LearningPathStepActionsType) => {
  const { hasNextStep, nextStep, endPath } = useLearningPath()

  const handleFinish = () => {
    if (onFinish) {
      onFinish()
    } else {
      endPath()
    }
  }

  return (
    <div className="flex p-docs_1 justify-between items-center">
      <div>
        <Button
          onClick={() => setCollapsed(true)}
          variant="secondary"
          className="!text-medusa-fg-subtle !p-[6px]"
        >
          <ArrowDownLeftMini className="flip-y hidden md:inline" />
          <ArrowDownMini className="inline md:hidden" />
        </Button>
      </div>
      <div className="flex gap-docs_0.5 items-center">
        {hasNextStep() && (
          <>
            <Button onClick={onClose} variant="secondary">
              Close
            </Button>
            <Button onClick={nextStep} variant="primary">
              Next
            </Button>
          </>
        )}
        {!hasNextStep() && (
          <Button onClick={handleFinish} variant="primary">
            Finish
          </Button>
        )}
      </div>
    </div>
  )
}

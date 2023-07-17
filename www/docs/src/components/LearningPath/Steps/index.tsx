import { useLearningPath } from "@site/src/providers/LearningPath"
import React from "react"
import LearningPathStepActions from "./Actions"
import clsx from "clsx"
import IconCircleDottedLine from "@site/src/theme/Icon/CircleDottedLine"
import IconCheckCircleSolid from "@site/src/theme/Icon/CheckCircleSolid"
import IconCircleMiniSolid from "@site/src/theme/Icon/CircleMiniSolid"
import Link from "@docusaurus/Link"

type LearningPathStepsProps = {
  onFinish?: () => void
  onClose?: () => void
}

const LearningPathSteps: React.FC<LearningPathStepsProps> = ({ ...rest }) => {
  const { path, currentStep, goToStep } = useLearningPath()

  if (!path) {
    return <></>
  }

  return (
    <div>
      {path.steps.map((step, index) => (
        <div
          className={clsx(
            "tw-border-0 tw-border-b tw-border-solid tw-border-medusa-border-base dark:tw-border-medusa-border-base-dark",
            "tw-relative tw-p-1"
          )}
          key={index}
        >
          <div className={clsx("tw-flex tw-items-center tw-gap-1")}>
            <div className="tw-w-2 tw-flex-none tw-flex tw-items-center tw-justify-center">
              {index === currentStep && (
                <IconCircleDottedLine
                  className="tw-shadow-active dark:tw-shadow-active-dark tw-rounded-full"
                  iconColorClassName="tw-stroke-medusa-icon-interactive dark:tw-stroke-medusa-icon-interactive-dark"
                />
              )}
              {index < currentStep && (
                <IconCheckCircleSolid iconColorClassName="tw-fill-medusa-icon-interactive dark:tw-fill-medusa-icon-interactive-dark" />
              )}
              {index > currentStep && <IconCircleMiniSolid />}
            </div>
            <span
              className={clsx(
                "tw-text-label-regular-plus tw-text-medusa-text-base dark:tw-text-medusa-text-base-dark"
              )}
            >
              {step.title}
            </span>
          </div>
          {index === currentStep && (
            <div className={clsx("tw-flex tw-items-center tw-gap-1")}>
              <div className="tw-w-2 tw-flex-none"></div>
              <div
                className={clsx(
                  "tw-text-body-regular tw-text-medusa-text-subtle dark:tw-text-medusa-text-subtle-dark tw-mt-1"
                )}
              >
                {step.descriptionJSX ?? step.description}
              </div>
            </div>
          )}
          {index < currentStep && (
            <Link
              href={step.path}
              className={clsx(
                "tw-absolute tw-top-0 tw-left-0 tw-w-full tw-h-full"
              )}
              onClick={(e) => {
                e.preventDefault()
                goToStep(index)
              }}
            />
          )}
        </div>
      ))}
      <LearningPathStepActions {...rest} />
    </div>
  )
}

export default LearningPathSteps

import { useLearningPath } from "@site/src/providers/LearningPath"
import { useNotifications } from "@site/src/providers/NotificationProvider"
import { getLearningPath } from "@site/src/utils/learning-paths"
import clsx from "clsx"
import React from "react"
import useBaseUrl from "@docusaurus/useBaseUrl"
import Button from "../Button"
import IconCircleMiniSolid from "@site/src/theme/Icon/CircleMiniSolid"
import LearningPathIcon from "./Icon"

type LearningPathProps = {
  pathName: string
  className?: string
} & React.AllHTMLAttributes<HTMLDivElement>

const LearningPath: React.FC<LearningPathProps> = ({
  pathName,
  className = "",
}) => {
  const path = getLearningPath(pathName)
  if (!path) {
    throw new Error("Learning path does not exist.")
  }
  const { startPath, path: currentPath } = useLearningPath()
  const notificationContext = useNotifications()

  const handleClick = () => {
    if (notificationContext && currentPath?.notificationId) {
      notificationContext.removeNotification(currentPath.notificationId)
    }
    startPath(path)
  }

  return (
    <div
      className={clsx(
        "tw-rounded tw-shadow-card-rest dark:tw-shadow-card-rest-dark tw-bg-docs-bg-surface dark:tw-bg-docs-bg-surface-dark tw-mt-1.5 tw-mb-4",
        className
      )}
    >
      <div
        className={clsx(
          "tw-flex tw-items-center tw-gap-1 tw-p-1 tw-border-0 tw-border-b tw-border-solid tw-border-medusa-border-base dark:tw-border-medusa-border-base-dark"
        )}
      >
        <LearningPathIcon />
        <div className={clsx("tw-flex-auto")}>
          <span
            className={clsx(
              "tw-text-medusa-text-base dark:tw-text-medusa-text-base-dark tw-text-label-large-plus tw-block"
            )}
          >
            {path.label}
          </span>
          {path.description && (
            <span
              className={clsx(
                "tw-text-medusa-text-subtle dark:tw-text-medusa-text-subtle-dark tw-text-label-regular tw-mt-[4px] tw-inline-block"
              )}
            >
              {path.description}
            </span>
          )}
        </div>
        <Button onClick={handleClick} className={clsx("tw-flex-initial")}>
          Start Path
        </Button>
      </div>
      {path.steps.map((step, index) => (
        <div
          className={clsx(
            "tw-flex tw-items-center tw-p-1 tw-gap-1",
            index !== path.steps.length - 1 &&
              "tw-border-0 tw-border-b tw-border-solid tw-border-medusa-border-base dark:tw-border-medusa-border-base-dark"
          )}
          key={index}
        >
          <div
            className={clsx("tw-w-3 tw-flex tw-items-center tw-justify-center")}
          >
            <IconCircleMiniSolid iconColorClassName="tw-stroke-medusa-icon-muted dark:tw-stroke-medusa-icon-muted-dark" />
          </div>
          <span
            className={clsx(
              "tw-text-medusa-text-base dark:tw-text-medusa-text-base-dark tw-text-label-regular-plus"
            )}
          >
            {step.title}
          </span>
        </div>
      ))}
    </div>
  )
}

export default LearningPath

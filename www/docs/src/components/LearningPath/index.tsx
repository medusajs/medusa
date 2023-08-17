import { useLearningPath } from "@site/src/providers/LearningPath"
import { useNotifications } from "@site/src/providers/NotificationProvider"
import { getLearningPath } from "@site/src/utils/learning-paths"
import clsx from "clsx"
import React from "react"
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
    throw new Error(`Learning path ${pathName} does not exist.`)
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
        "rounded shadow-card-rest dark:shadow-card-rest-dark bg-docs-bg-surface dark:bg-docs-bg-surface-dark mt-1.5 mb-4",
        className
      )}
    >
      <div
        className={clsx(
          "flex items-center gap-1 p-1 border-0 border-b border-solid border-medusa-border-base dark:border-medusa-border-base-dark"
        )}
      >
        <LearningPathIcon />
        <div className={clsx("basis-3/4")}>
          <span
            className={clsx(
              "text-medusa-fg-base dark:text-medusa-fg-base-dark text-compact-large-plus block"
            )}
          >
            {path.label}
          </span>
          {path.description && (
            <span
              className={clsx(
                "text-medusa-fg-subtle dark:text-medusa-fg-subtle-dark text-compact-medium mt-0.25 inline-block"
              )}
            >
              {path.description}
            </span>
          )}
        </div>
        <Button onClick={handleClick} className={clsx("basis-1/4 max-w-fit")}>
          Start Path
        </Button>
      </div>
      {path.steps.map((step, index) => (
        <div
          className={clsx(
            "flex items-center p-1 gap-1",
            index !== path.steps.length - 1 &&
              "border-0 border-b border-solid border-medusa-border-base dark:border-medusa-border-base-dark"
          )}
          key={index}
        >
          <div className={clsx("w-3 flex items-center justify-center")}>
            <IconCircleMiniSolid iconColorClassName="stroke-medusa-fg-muted dark:stroke-medusa-fg-muted-dark" />
          </div>
          <span
            className={clsx(
              "text-medusa-fg-base dark:text-medusa-fg-base-dark text-compact-medium-plus"
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

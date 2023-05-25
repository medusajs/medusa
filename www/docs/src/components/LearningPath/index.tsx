import { useLearningPath } from "@site/src/providers/LearningPath"
import { useNotifications } from "@site/src/providers/NotificationProvider"
import { getLearningPath } from "@site/src/utils/learning-paths"
import clsx from "clsx"
import React from "react"

type LearningPathProps = {
  pathName: string
  className?: string
  children?: React.ReactNode
}

const LearningPath: React.FC<LearningPathProps> = ({
  pathName,
  className = "",
  children,
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
    <div className={clsx("tw-relative", "tw-group", className)}>
      {children}
      <button
        className={clsx(
          "tw-absolute tw-top-0 tw-left-0 tw-w-full tw-h-full tw-z-[4] tw-rounded transparent-button"
        )}
        onClick={handleClick}
      ></button>
    </div>
  )
}

export default LearningPath

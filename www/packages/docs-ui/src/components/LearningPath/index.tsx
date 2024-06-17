"use client"

import clsx from "clsx"
import React from "react"
import { LearningPathIcon } from "./Icon"
import { getLearningPath } from "@/utils"
import { useLearningPath } from "@/providers"
import { Button, Link } from "@/components"
import { useNotifications } from "@/providers"
import { CircleMiniSolid } from "@medusajs/icons"

type LearningPathProps = {
  pathName: string
  className?: string
} & React.AllHTMLAttributes<HTMLDivElement>

export const LearningPath = ({
  pathName,
  className = "",
}: LearningPathProps) => {
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
        "rounded shadow-elevation-card-rest dark:shadow-elevation-card-rest-dark bg-docs-bg-surface mt-docs_1.5 mb-docs_4",
        className
      )}
    >
      <div
        className={clsx(
          "flex items-center gap-docs_1 p-docs_1 border-0 border-b border-solid border-medusa-border-base"
        )}
      >
        <LearningPathIcon />
        <div className={clsx("basis-3/4")}>
          <span
            className={clsx(
              "text-medusa-fg-base text-compact-large-plus block"
            )}
          >
            {path.label}
          </span>
          {path.description && (
            <span
              className={clsx(
                "text-medusa-fg-subtle text-compact-medium mt-docs_0.25 inline-block"
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
            "flex items-center p-docs_1 gap-docs_1 relative",
            index !== path.steps.length - 1 &&
              "border-0 border-b border-solid border-medusa-border-base"
          )}
          key={index}
        >
          <div className={clsx("w-docs_3 flex items-center justify-center")}>
            <CircleMiniSolid className="text-medusa-fg-muted" />
          </div>
          <span
            className={clsx("text-medusa-fg-base text-compact-medium-plus")}
          >
            {step.title}
          </span>
          <Link
            href={step.path}
            className={clsx("absolute top-0 left-0 w-full h-full")}
          />
        </div>
      ))}
    </div>
  )
}

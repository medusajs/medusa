"use client"

import clsx from "clsx"
import React from "react"
import { useLearningPath } from "../../.."

type LearningPathIconProps = {
  className?: string
  imgClassName?: string
} & React.AllHTMLAttributes<HTMLDivElement>

export const LearningPathIcon = ({
  className = "",
  imgClassName = "",
}: LearningPathIconProps) => {
  const { baseUrl } = useLearningPath()

  return (
    <div
      className={clsx(
        "rounded-full shadow-elevation-card-rest dark:shadow-elevation-card-rest-dark w-docs_3 h-docs_3 bg-medusa-bg-base",
        "flex justify-center items-center flex-none",
        className
      )}
    >
      <img
        src={`${baseUrl}/images/learning-path-img.png`}
        className={clsx("rounded-full w-docs_2.5 h-docs_2.5", imgClassName)}
      />
    </div>
  )
}

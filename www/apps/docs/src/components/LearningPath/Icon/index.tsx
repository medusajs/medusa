import useBaseUrl from "@docusaurus/useBaseUrl"
import clsx from "clsx"
import React from "react"

type LearningPathIconProps = {
  className?: string
  imgClassName?: string
} & React.AllHTMLAttributes<HTMLDivElement>

const LearningPathIcon: React.FC<LearningPathIconProps> = ({
  className = "",
  imgClassName = "",
}) => {
  return (
    <div
      className={clsx(
        "rounded-full shadow-card-rest dark:shadow-card-rest-dark w-3 h-3 bg-medusa-bg-base",
        "flex justify-center items-center flex-none",
        className
      )}
    >
      <img
        src={useBaseUrl("/img/learning-path-img.png")}
        className={clsx("rounded-full w-2.5 h-2.5 no-zoom-img", imgClassName)}
      />
    </div>
  )
}

export default LearningPathIcon

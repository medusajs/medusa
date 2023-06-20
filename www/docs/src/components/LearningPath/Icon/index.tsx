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
        "tw-rounded-full tw-shadow-card-rest dark:tw-shadow-card-rest-dark tw-w-3 tw-h-3 tw-bg-button-neutral dark:tw-bg-button-neutral-dark",
        "tw-flex tw-justify-center tw-items-center tw-flex-none",
        className
      )}
    >
      <img
        src={useBaseUrl("/img/learning-path-img.png")}
        className={clsx(
          "tw-rounded-full tw-w-[40px] tw-h-[40px] no-zoom-img",
          imgClassName
        )}
      />
    </div>
  )
}

export default LearningPathIcon

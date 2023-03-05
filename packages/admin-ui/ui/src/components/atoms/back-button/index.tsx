import clsx from "clsx"
import React from "react"
import { useNavigate } from "react-router-dom"
import ArrowLeftIcon from "../../fundamentals/icons/arrow-left-icon"

type Props = {
  path?: string
  label?: string
  className?: string
}

const BackButton = ({ path, label = "Go back", className }: Props) => {
  const navigate = useNavigate()
  return (
    <button
      onClick={() => {
        path ? navigate(path) : navigate(-1)
      }}
      className={clsx("px-small py-xsmall", className)}
    >
      <div className="flex items-center gap-x-xsmall text-grey-50 inter-grey-40 inter-small-semibold">
        <ArrowLeftIcon size={20} />
        <span className="ml-1">{label}</span>
      </div>
    </button>
  )
}

export default BackButton

import clsx from "clsx"
import React from "react"
import { useNavigate } from "react-router-dom"
import ChevronRightIcon from "../../fundamentals/icons/chevron-right-icon"

type BreadcrumbProps = React.HtmlHTMLAttributes<HTMLDivElement> & {
  previousRoute?: string
  previousBreadcrumb?: string
  currentPage: string
}

const Breadcrumb: React.FC<BreadcrumbProps> = ({
  previousRoute = "/a/settings",
  previousBreadcrumb = "Settings",
  currentPage,
  className,
  ...props
}) => {
  const navigate = useNavigate()
  return (
    <div
      className={clsx(
        "w-full flex items-center inter-small-semibold text-grey-50 mb-4",
        className
      )}
      {...props}
    >
      <span
        className="text-violet-60 cursor-pointer"
        onClick={() => navigate(previousRoute)}
      >
        {previousBreadcrumb}
      </span>
      <span className="mx-0.5">
        <ChevronRightIcon size={16} />
      </span>
      <span>{currentPage}</span>
    </div>
  )
}

export default Breadcrumb

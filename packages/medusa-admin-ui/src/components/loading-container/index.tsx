import * as React from "react"
import Spinner from "../atoms/spinner"

type LoadingContainerProps = {
  isLoading: boolean
  placeholder?: React.ReactElement
  children: React.ReactElement | React.ReactElement[]
}

const LoadingContainer = ({
  isLoading,
  children,
  placeholder,
  ...props
}: LoadingContainerProps) => {
  placeholder = placeholder || <Spinner size="large" variant="secondary" />

  if (isLoading) {
    return (
      <div
        className="w-full pt-2xlarge flex items-center justify-center min-h-[756px]"
        {...props}
      >
        {placeholder}
      </div>
    )
  }

  return children as React.ReactElement
}

export default LoadingContainer

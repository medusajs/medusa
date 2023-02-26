import * as React from "react"
import { Spinner } from "../../atoms"

type LoadingContainerProps = {
  isLoading: boolean
  placeholder?: React.ReactElement
  children: React.ReactElement | React.ReactElement[]
}

export const LoadingContainer = ({
  isLoading,
  children,
  placeholder,
  ...props
}: LoadingContainerProps) => {
  placeholder = placeholder || <Spinner size="large" variant="secondary" />

  if (isLoading) {
    return (
      <div
        className="pt-2xlarge flex min-h-[756px] w-full items-center justify-center"
        {...props}
      >
        {placeholder}
      </div>
    )
  }

  return children as React.ReactElement
}

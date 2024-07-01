import * as React from "react"
import { AriaButtonProps, useButton } from "react-aria"

import { IconButton } from "@/components/icon-button"

interface CalendarButtonProps extends AriaButtonProps<"button"> {}

const CalendarButton = React.forwardRef<HTMLButtonElement, CalendarButtonProps>(
  ({ children, ...props }, ref) => {
    const innerRef = React.useRef<HTMLButtonElement>(null)
    React.useImperativeHandle(ref, () => innerRef.current as HTMLButtonElement)

    const { buttonProps } = useButton(props, innerRef)

    return (
      <IconButton
        size="small"
        variant="transparent"
        className="rounded-[4px]"
        {...buttonProps}
      >
        {children}
      </IconButton>
    )
  }
)
CalendarButton.displayName = "CalendarButton"

export { CalendarButton }

"use client"

import * as React from "react"
import {
  AriaTimeFieldProps,
  TimeValue,
  useLocale,
  useTimeField,
} from "react-aria"
import { useTimeFieldState } from "react-stately"

import { DateSegment } from "@/components/date-segment"
import { clx } from "@/utils/clx"

const TimeInput = (props: AriaTimeFieldProps<TimeValue>) => {
  const ref = React.useRef<HTMLDivElement>(null)

  const { locale } = useLocale()
  const state = useTimeFieldState({
    ...props,
    locale,
  })
  const { fieldProps } = useTimeField(props, state, ref)

  return (
    <div
      ref={ref}
      {...fieldProps}
      aria-label="Time input"
      className={clx(
        "txt-compact-small flex items-center rounded-md bg-ui-bg-field px-2 py-1 shadow-borders-base",
        {
          "": props.isDisabled,
        }
      )}
    >
      {state.segments.map((segment, index) => {
        return <DateSegment key={index} segment={segment} state={state} />
      })}
    </div>
  )
}

export { TimeInput }

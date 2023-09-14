import React from "react"
import {
  Details as UiDetails,
  type DetailsProps as UiDetailsProps,
} from "docs-ui"

export type DetailsProps = {
  summary: React.ReactNode
  children?: React.ReactNode
} & UiDetailsProps

export default function Details({
  summary,
  children,
  ...props
}: DetailsProps): JSX.Element {
  return (
    <UiDetails
      {...props}
      summaryContent={!React.isValidElement(summary) ? summary : undefined}
      summaryElm={React.isValidElement(summary) ? summary : undefined}
    >
      {children}
    </UiDetails>
  )
}

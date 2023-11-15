import React, { type ComponentProps, type ReactElement } from "react"
import Details from "@theme/Details"
import type { Props } from "@theme/MDXComponents/Details"
import { DetailsSummary } from "docs-ui"

export default function MDXDetails(props: Omit<Props, "key">): JSX.Element {
  const items = React.Children.toArray(props.children)
  // Split summary item from the rest to pass it as a separate prop to the
  // Details theme component
  const summary = items.find(
    (
      item: ReactElement<ComponentProps<"summary">>
    ): item is ReactElement<ComponentProps<"summary">> => {
      return (
        React.isValidElement(item) &&
        (item.type === "summary" || item.type === DetailsSummary)
      )
    }
  )
  const children = <>{items.filter((item) => item !== summary)}</>

  return (
    <Details {...props} summary={summary}>
      {children}
    </Details>
  )
}

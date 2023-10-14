import React, { type ComponentProps, type ReactElement } from "react"
import type { Props } from "@theme/MDXComponents/Details"
import Details, { DetailsProps } from "../Details"
import { type DetailsSummaryProps } from "docs-ui"

type MDXDetailsProps = Props & DetailsProps

export default function MDXDetails(props: MDXDetailsProps): JSX.Element {
  const items = React.Children.toArray(props.children)
  // Split summary item from the rest to pass it as a separate prop to the
  // Details theme component
  const summary = items.find(
    (item): item is ReactElement<ComponentProps<"summary">> =>
      React.isValidElement(item) &&
      (item.props as { mdxType: string } | null)?.mdxType === "summary"
  ) as React.ReactElement<DetailsSummaryProps>
  const children = <>{items.filter((item) => item !== summary)}</>

  return (
    <Details summary={summary} {...props}>
      {children}
    </Details>
  )
}

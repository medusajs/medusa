import Admonition, { Props as AdmonitionProps } from "@theme/Admonition"
import { useQueryStringValue } from "@docusaurus/theme-common/internal"
import React from "react"

type QueryNoteProps = {
  query: {
    key: string
    value?: string
  }
  admonition: AdmonitionProps
} & React.HTMLAttributes<HTMLDivElement>

const QueryNote: React.FC<QueryNoteProps> = ({
  query: { key, value = "" },
  admonition,
  children,
}) => {
  const queryValue = useQueryStringValue(key)

  return (
    <>
      {queryValue === value && (
        <Admonition {...admonition}>{children}</Admonition>
      )}
    </>
  )
}

export default QueryNote

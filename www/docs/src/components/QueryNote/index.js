import React from "react";
import { useQueryStringValue } from "@docusaurus/theme-common/internal"
import Admonition from "@theme/Admonition"

export default function QueryNote ({
  query: {
    key,
    value = ''
  },
  //admonition props
  admonition,
  children
}) {
  const queryValue = useQueryStringValue(key)

  return (
    <>
      {queryValue === value && (
        <Admonition {...admonition}>
          {children}
        </Admonition>
      )}
    </>
  )
}
import React from "react"
import { TypeList as UiTypeList } from "docs-ui"
import { useLocation } from "@docusaurus/router"

const TypeList = (props: React.ComponentProps<typeof UiTypeList>) => {
  const location = useLocation()

  return <UiTypeList {...props} pathname={location.pathname} />
}

export default TypeList

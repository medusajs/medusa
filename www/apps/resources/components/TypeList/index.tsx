import { TypeList as UiTypeList } from "docs-ui"
import { ComponentProps } from "react"
import { config } from "@/config"

const TypeList = (props: ComponentProps<typeof UiTypeList>) => {
  return <UiTypeList {...props} siteUrl={config.baseUrl} />
}

export default TypeList

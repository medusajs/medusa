import React, { ComponentType } from "react"
import { useSettingContainerProps } from "./use-setting-container-props"

type SettingContainerProps = {
  Page: ComponentType<any>
}

const SettingContainer = ({ Page }: SettingContainerProps) => {
  const props = useSettingContainerProps()

  return React.createElement(Page, props)
}

export default SettingContainer

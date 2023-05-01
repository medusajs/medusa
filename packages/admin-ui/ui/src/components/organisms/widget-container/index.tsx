import { InjectionZone, LoadedWidget } from "@medusajs/types"
import React from "react"
import ExtensionErrorBoundary from "../../molecules/extension-error-boundary"
import { EntityMap } from "./types"
import { useWidgetContainerProps } from "./use-widget-container-props"

type WidgetContainerProps<T extends keyof EntityMap> = {
  injectionZone: T
  widget: LoadedWidget
  entity: EntityMap[T]
}

const WidgetContainer = <T extends InjectionZone>({
  injectionZone,
  widget,
  entity,
}: WidgetContainerProps<T>) => {
  const { name, origin, Component } = widget

  const props = useWidgetContainerProps({
    injectionZone,
    entity,
  })

  return (
    <ExtensionErrorBoundary
      type="widget"
      info={{
        name,
        origin,
      }}
    >
      {React.createElement(Component, props)}
    </ExtensionErrorBoundary>
  )
}

export default WidgetContainer

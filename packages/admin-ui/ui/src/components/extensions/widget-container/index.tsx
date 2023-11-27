import React from "react"
import { InjectionZone, Widget } from "../../../types/extensions"
import { EntityMap } from "./types"
import { useWidgetContainerProps } from "./use-widget-container-props"
import WidgetErrorBoundary from "./widget-error-boundary"

type WidgetContainerProps<T extends keyof EntityMap> = {
  injectionZone: T
  widget: Widget
  entity: EntityMap[T]
}

const WidgetContainer = <T extends InjectionZone>({
  injectionZone,
  widget,
  entity,
}: WidgetContainerProps<T>) => {
  const { Widget, origin } = widget

  const props = useWidgetContainerProps({
    injectionZone,
    entity,
  })

  return (
    <WidgetErrorBoundary origin={origin}>
      {React.createElement(Widget, props)}
    </WidgetErrorBoundary>
  )
}

export default WidgetContainer

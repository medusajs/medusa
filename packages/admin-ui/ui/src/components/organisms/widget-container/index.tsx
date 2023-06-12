import { useQueryClient } from "@tanstack/react-query"
import { MedusaProvider } from "medusa-react"
import React from "react"
import { MEDUSA_BACKEND_URL } from "../../../constants/medusa-backend-url"
import { InjectionZone, Widget } from "../../../types/extensions"
import WidgetErrorBoundary from "../../molecules/widget-error-boundary"
import { EntityMap } from "./types"
import { useWidgetContainerProps } from "./use-widget-container-props"

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

  const queryClient = useQueryClient()

  return (
    <MedusaProvider
      queryClientProviderProps={{
        client: queryClient,
        contextSharing: true,
      }}
      baseUrl={MEDUSA_BACKEND_URL}
    >
      <WidgetErrorBoundary origin={origin}>
        {React.createElement(Widget, props)}
      </WidgetErrorBoundary>
    </MedusaProvider>
  )
}

export default WidgetContainer

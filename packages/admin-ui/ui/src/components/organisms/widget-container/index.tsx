import { InjectionZone, LoadedWidget } from "@medusajs/types"
import { useQueryClient } from "@tanstack/react-query"
import { MedusaProvider } from "medusa-react"
import React from "react"
import { MEDUSA_BACKEND_URL } from "../../../constants/medusa-backend-url"
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

  const queryClient = useQueryClient()

  return (
    <MedusaProvider
      queryClientProviderProps={{
        client: queryClient,
        contextSharing: true,
      }}
      baseUrl={MEDUSA_BACKEND_URL}
    >
      <ExtensionErrorBoundary
        type="widget"
        info={{
          name,
          origin,
        }}
      >
        {React.createElement(Component, props)}
      </ExtensionErrorBoundary>
    </MedusaProvider>
  )
}

export default WidgetContainer

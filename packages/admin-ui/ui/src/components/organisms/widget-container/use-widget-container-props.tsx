import useNotification from "../../../hooks/use-notification"
import { WidgetProps } from "../../../types/extensions"
import { EntityMap, PropKeyMap } from "./types"

type UseWidgetContainerProps<T extends keyof EntityMap> = {
  injectionZone: T
  entity?: EntityMap[T]
}

export const useWidgetContainerProps = <T extends keyof EntityMap>({
  injectionZone,
  entity,
}: UseWidgetContainerProps<T>) => {
  const notification = useNotification()

  const notify = {
    success: (title: string, message: string) => {
      notification(title, message, "success")
    },
    error: (title: string, message: string) => {
      notification(title, message, "error")
    },
    warn: (title: string, message: string) => {
      notification(title, message, "warning")
    },
    info: (title: string, message: string) => {
      notification(title, message, "info")
    },
  }

  /** Base props that are always passed to a widget */
  const baseProps: WidgetProps = {
    notify,
  }

  /**
   * Not all InjectionZones have an entity, so we need to check for it first, and then
   * add it to the props if it exists.
   */
  if (entity) {
    const propKey = injectionZone as keyof typeof PropKeyMap
    const entityKey = PropKeyMap[propKey]

    return {
      ...baseProps,
      [entityKey]: entity,
    }
  }

  return baseProps
}

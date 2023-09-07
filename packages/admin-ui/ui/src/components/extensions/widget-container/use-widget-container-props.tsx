import { useExtensionBaseProps } from "../../../hooks/use-extension-base-props"
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
  const baseProps = useExtensionBaseProps() satisfies WidgetProps

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

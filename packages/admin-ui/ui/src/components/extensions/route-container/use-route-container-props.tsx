import { useExtensionBaseProps } from "../../../hooks/use-extension-base-props"
import { RouteProps } from "../../../types/extensions"

export const useRouteContainerProps = (): RouteProps => {
  const baseProps = useExtensionBaseProps()

  return baseProps
}

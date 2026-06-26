import { useContext } from "react"
import { LayoutCustomizerHostContext } from "../providers/customizer-host-provider/customizer-host-context"

/**
 * DOM node where customizer controls portal into. `null` if no host is
 * mounted (e.g. `LayoutComposer` used outside the shell).
 */
export const useLayoutCustomizerTriggerHost = (): HTMLElement | null => {
  return useContext(LayoutCustomizerHostContext)?.triggerNode ?? null
}

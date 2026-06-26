import { useContext } from "react"
import { LayoutCustomizerHostContext } from "../providers/customizer-host-provider/customizer-host-context"

/**
 * DOM node where a composer's customizer controls portal into for the given
 * `location`. `null` if no matching host is mounted (e.g. the slot lives in a
 * dropdown that is currently closed, or `LayoutComposer` is used outside the
 * shell).
 */
export const useLayoutCustomizerTriggerHost = (
  location: string
): HTMLElement | null => {
  return useContext(LayoutCustomizerHostContext)?.hosts[location] ?? null
}

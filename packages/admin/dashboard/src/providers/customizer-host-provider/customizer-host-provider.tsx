import { ReactNode, useCallback, useContext, useState } from "react"
import { LayoutCustomizerHostContext } from "./customizer-host-context"

export type LayoutCustomizerHostValue = {
  triggerNode: HTMLElement | null
  setTriggerNode: (node: HTMLElement | null) => void
}

/**
 * Wraps a tree that hosts the layout customizer trigger UI in a fixed
 * location (e.g. the app shell's top bar). Each active `LayoutComposer`
 * portals its trigger / edit controls into the `LayoutCustomizerSlot`
 * mounted within the same provider.
 */
export const LayoutCustomizerHostProvider = ({
  children,
}: {
  children: ReactNode
}) => {
  const [triggerNode, setTriggerNode] = useState<HTMLElement | null>(null)
  return (
    <LayoutCustomizerHostContext.Provider
      value={{ triggerNode, setTriggerNode }}
    >
      {children}
    </LayoutCustomizerHostContext.Provider>
  )
}

/**
 * Placeholder for the active `LayoutComposer`'s customizer controls
 * (trigger button at idle, Cancel/Save while editing).
 */
export const LayoutCustomizerSlot = () => {
  const ctx = useContext(LayoutCustomizerHostContext)
  const ref = useCallback(
    (el: HTMLDivElement | null) => {
      ctx?.setTriggerNode(el)
    },
    [ctx]
  )
  return <div ref={ref} className="contents" />
}

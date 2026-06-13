import {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useState,
} from "react"

type LayoutCustomizerHostValue = {
  triggerNode: HTMLElement | null
  setTriggerNode: (node: HTMLElement | null) => void
}

const LayoutCustomizerHostContext =
  createContext<LayoutCustomizerHostValue | null>(null)

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
 * (trigger button at idle, Clear/Save while editing).
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

/**
 * DOM node where customizer controls portal into. `null` if no host is
 * mounted (e.g. `LayoutComposer` used outside the shell).
 */
export const useLayoutCustomizerTriggerHost = (): HTMLElement | null => {
  return useContext(LayoutCustomizerHostContext)?.triggerNode ?? null
}

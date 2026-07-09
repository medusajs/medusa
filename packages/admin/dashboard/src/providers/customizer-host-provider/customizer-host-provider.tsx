import { ReactNode, useCallback, useContext, useMemo, useState } from "react"
import { LayoutCustomizerHostContext } from "./customizer-host-context"
import { LAYOUT_CONTROLS_LOCATION } from "../../components/layout-composer/constants"

export type LayoutCustomizerHostValue = {
  /** DOM node registered for each location, or `null` when unmounted. */
  hosts: Record<string, HTMLElement | null>
  setHost: (location: string, node: HTMLElement | null) => void
  /**
   * Id of the composer currently in edit mode, or `null` when none is.
   */
  activeEditor: string | null
  setActiveEditor: (id: string | null) => void
  /**
   * `customizeId` of the host the `CustomizerMenu` has asked to enter edit
   * mode, or `null`. The matching composer consumes this (and clears it) on its
   * next render. Acts as a one-shot command bus so the single, central trigger
   * can drive any composer without owning a button inside it.
   */
  editRequest: string | null
  requestEdit: (id: string | null) => void
}

/**
 * Wraps a tree that hosts the layout customizer trigger UI in one or more
 * fixed locations (e.g. the app shell's top bar, the sidebar header dropdown).
 * Each active `LayoutComposer` portals its trigger / edit controls into the
 * `LayoutCustomizerSlot` matching its configured `triggerLocation`
 */
export const LayoutCustomizerHostProvider = ({
  children,
}: {
  children: ReactNode
}) => {
  const [hosts, setHosts] = useState<Record<string, HTMLElement | null>>({})
  const [activeEditor, setActiveEditor] = useState<string | null>(null)
  const [editRequest, setEditRequest] = useState<string | null>(null)

  const setHost = useCallback((location: string, node: HTMLElement | null) => {
    setHosts((prev) => {
      if (prev[location] === node) {
        return prev
      }
      return { ...prev, [location]: node }
    })
  }, [])

  const value = useMemo(
    () => ({
      hosts,
      setHost,
      activeEditor,
      setActiveEditor,
      editRequest,
      requestEdit: setEditRequest,
    }),
    [hosts, setHost, activeEditor, editRequest]
  )

  return (
    <LayoutCustomizerHostContext.Provider value={value}>
      {children}
    </LayoutCustomizerHostContext.Provider>
  )
}

/**
 * Placeholder for a `LayoutComposer`'s customizer controls (trigger button at
 * idle, Cancel/Save while editing), identified by `location`. A composer with a
 * matching `triggerLocation` portals its controls here.
 */
export const LayoutCustomizerSlot = ({
  location = LAYOUT_CONTROLS_LOCATION,
  className = "contents",
}: {
  location?: string
  className?: string
}) => {
  const setHost = useContext(LayoutCustomizerHostContext)?.setHost
  const ref = useCallback(
    (el: HTMLDivElement | null) => {
      setHost?.(location, el)
    },
    [setHost, location]
  )
  return <div ref={ref} className={className} />
}

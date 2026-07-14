import { Fragment, ReactNode } from "react"

export type LayoutEntryProps = {
  /** Stable identity for this entry. Survives component renames and minification. */
  id: string
  children: ReactNode
}

/**
 * Pins a stable identity to a layout entry. Use this to wrap sections whose
 * component name is unstable (subject to rename or minification), ensuring
 * any saved user preferences survive refactors.
 */
export function LayoutEntry({ children }: LayoutEntryProps) {
  return <Fragment>{children}</Fragment>
}

LayoutEntry.displayName = "LayoutEntry"

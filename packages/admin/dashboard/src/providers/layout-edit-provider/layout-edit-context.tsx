import { createContext } from "react"

/**
 * Bridges the `LayoutComposer`'s edit session to nested, self-contained
 * sortables rendered inside its entries (e.g. a nav group's child links).
 * Nested orders are stored in the same edit `draft` — keyed by their own ids —
 * so they are drafted, saved, and canceled together with the top-level layout,
 * and respect the personal/default scope. Each entry only ever orders its own
 * children, which keeps reordering scoped (no cross-group moves).
 */
export type LayoutEditContextValue = {
  /** Whether the surrounding composer is currently in edit mode. */
  editMode: boolean
  /**
   * Returns `children` sorted by the order stored for each child's id in the
   * active preference (draft while editing, persisted otherwise). A stable sort
   * keeps unset entries in source order.
   */
  orderChildren: <T>(children: T[], getId: (child: T) => string) => T[]
  /** Persists `orderedIds` (index = order) for these children into the draft. */
  setChildrenOrder: (orderedIds: string[]) => void
  /**
   * Whether the entry/child with this id is hidden in the active preference.
   * Lets nested children be hidden individually, keyed by their own id in the
   * same preference map as top-level entries.
   */
  isHidden: (id: string) => boolean
  /** Toggles the hidden flag for this id in the draft. */
  toggleHidden: (id: string) => void
}

export const LayoutEditContext = createContext<LayoutEditContextValue>({
  editMode: false,
  orderChildren: (children) => children,
  setChildrenOrder: () => {},
  isHidden: () => false,
  toggleHidden: () => {},
})

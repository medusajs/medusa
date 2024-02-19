import { PropsWithChildren } from "react"

/**
 * Field for displaying non-editable data in a grid.
 */
export const DisplayField = ({ children }: PropsWithChildren) => {
  return (
    <div
      className="flex size-full cursor-not-allowed items-center justify-center px-4 py-2.5"
      data-role="presentation"
    >
      {children}
    </div>
  )
}

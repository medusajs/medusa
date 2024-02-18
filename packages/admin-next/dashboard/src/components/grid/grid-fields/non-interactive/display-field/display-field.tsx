import { PropsWithChildren } from "react"

/**
 * Field for displaying non-editable data in a grid.
 */
export const DisplayField = ({ children }: PropsWithChildren) => {
  return <div className="size-full">{children}</div>
}

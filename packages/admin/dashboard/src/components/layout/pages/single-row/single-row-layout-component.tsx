import type { ReactElement } from "react"
import { LayoutComponentProps } from "../../../layout-composer/types"
import { clx } from "@medusajs/ui"

export const SingleRowLayoutComponent = ({
  sections,
  className,
}: LayoutComponentProps): ReactElement => {
  return (
    <div className={clx("flex flex-row items-center gap-x-3", className)}>
      {sections["main"]}
    </div>
  )
}

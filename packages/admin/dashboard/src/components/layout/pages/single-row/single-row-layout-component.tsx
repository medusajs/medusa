import type { ReactElement } from "react"
import { LayoutComponentProps } from "../../../layout-composer/types"

export const SingleRowLayoutComponent = ({
  sections,
}: LayoutComponentProps): ReactElement => {
  return (
    <div className="flex flex-row items-center gap-x-3">{sections["main"]}</div>
  )
}

import type { ReactElement } from "react"
import { LayoutComponentProps } from "../../../layout-composer/types"

export const SingleColumnLayoutComponent = ({
  sections,
}: LayoutComponentProps): ReactElement => {
  return <div className="flex flex-col gap-y-3">{sections["main"]}</div>
}

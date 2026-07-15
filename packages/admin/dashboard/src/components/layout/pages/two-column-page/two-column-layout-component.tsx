import type { ReactElement } from "react"
import { LayoutComponentProps } from "../../../layout-composer/types"
import { clx } from "@medusajs/ui"

export const TwoColumnLayoutComponent = ({
  sections,
  className,
}: LayoutComponentProps): ReactElement => {
  return (
    <div
      className={clx(
        "flex w-full flex-col items-start gap-x-4 gap-y-3 xl:grid xl:grid-cols-[minmax(0,_1fr)_440px]",
        className
      )}
    >
      <div className="flex w-full min-w-0 flex-col gap-y-3">
        {sections["main"]}
      </div>
      <div className="flex w-full flex-col gap-y-3 xl:mt-0">
        {sections["side"]}
      </div>
    </div>
  )
}

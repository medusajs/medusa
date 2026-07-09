import type { ReactElement } from "react"
import { LayoutComponentProps } from "../../../layout-composer/types"

export const TwoColumnLayoutComponent = ({
  sections,
}: LayoutComponentProps): ReactElement => {
  return (
    <div className="flex w-full flex-col items-start gap-x-4 gap-y-3 xl:grid xl:grid-cols-[minmax(0,_1fr)_440px]">
      <div className="flex w-full min-w-0 flex-col gap-y-3">
        {sections["main"]}
      </div>
      <div className="flex w-full flex-col gap-y-3 xl:mt-0">
        {sections["side"]}
      </div>
    </div>
  )
}

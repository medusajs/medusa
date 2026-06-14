import * as React from "react"
import { CORE_LAYOUT_IDS } from "./constants"
import { LayoutComponentProps, LayoutDefinition } from "./types"

const SingleColumnLayoutComponent = ({
  sections,
}: LayoutComponentProps): React.ReactElement => {
  return <div className="flex flex-col gap-y-3">{sections["main"]}</div>
}

const TwoColumnLayoutComponent = ({
  sections,
}: LayoutComponentProps): React.ReactElement => {
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

export const CORE_LAYOUTS: LayoutDefinition[] = [
  {
    id: CORE_LAYOUT_IDS.SINGLE_COLUMN,
    sections: [{ id: "main", ordering: "list" }],
    Component: SingleColumnLayoutComponent,
  },
  {
    id: CORE_LAYOUT_IDS.TWO_COLUMN,
    sections: [
      { id: "main", ordering: "list" },
      { id: "side", ordering: "list" },
    ],
    Component: TwoColumnLayoutComponent,
  },
]

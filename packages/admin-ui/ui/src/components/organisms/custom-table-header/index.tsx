import clsx from "clsx"
import { capitalize } from "lodash"
import React from "react"

type View = {
  key: string
  label: string
}

type TableViewHeaderProps = {
  views: (string | View)[]
  activeView?: string
  setActiveView?: (key: string) => void
}

const TableViewHeader: React.FC<TableViewHeaderProps> = ({
  views,
  activeView = typeof views[0] == "object" ? views[0].key : views[0],
  setActiveView,
}) => {
  return (
    <div className="inter-large-semibold gap-x-base text-grey-40 flex">
      {views.map((k, i) => {
        const key = typeof k == "object" && "key" in k ? k.key : k

        const label =
          typeof k == "object" && "label" in k ? k.label : capitalize(k)

        const isActive = key === activeView

        return (
          <div
            key={i}
            className={clsx("cursor-pointer", {
              ["text-grey-90"]: isActive,
            })}
            onClick={() => {
              if (setActiveView) {
                setActiveView(key)
              }
            }}
          >
            {label}
          </div>
        )
      })}
    </div>
  )
}

export default TableViewHeader

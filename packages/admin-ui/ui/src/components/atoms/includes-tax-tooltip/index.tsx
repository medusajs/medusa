import clsx from "clsx"
import React from "react"
import TaxesIcon from "../../fundamentals/icons/taxes-icon"
import Tooltip from "../tooltip"

type Props = {
  includesTax?: boolean
}

const IncludesTaxTooltip = ({ includesTax }: Props) => {
  return (
    <Tooltip content={includesTax ? "Tax incl. price" : "Tax excl. price"}>
      <div className="w-large h-large rounded-rounded border border-grey-20 flex items-center justify-center">
        <TaxesIcon
          size={16}
          className={clsx({
            "text-grey-50": includesTax,
            "text-grey-30": !includesTax,
          })}
        />
      </div>
    </Tooltip>
  )
}

export default IncludesTaxTooltip

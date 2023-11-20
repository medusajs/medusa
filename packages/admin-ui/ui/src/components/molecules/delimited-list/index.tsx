import React from "react"
import Tooltip from "../../atoms/tooltip"
import { useTranslation } from "react-i18next"

type DelimitedListProps = {
  list: string[]
  delimit?: number
}

const DelimitedList: React.FC<DelimitedListProps> = ({ list, delimit = 1 }) => {
  if (!list.length) {
    return <></>
  }

  const itemsToDisplay = list.slice(0, delimit).join(", ")
  const showExtraItemsInTooltip = list.length > delimit
  const extraItemsInToolTipCount = list.length - delimit

  const ToolTipContent = () => {
    const { t } = useTranslation()
    return (
      <div className="flex flex-col">
        {list.slice(delimit).map((listItem) => (
          <span key={listItem}>{listItem}</span>
        ))}
      </div>
    )
  }
  const { t } = useTranslation
  return (
    <span className="inter-base-regular text-grey-50">
      {itemsToDisplay}

      {showExtraItemsInTooltip && (
        <Tooltip content={<ToolTipContent />}>
          <span className="text-grey-40">
            {" "}
            + {extraItemsInToolTipCount} {t("more")}
          </span>
        </Tooltip>
      )}
    </span>
  )
}

export default DelimitedList

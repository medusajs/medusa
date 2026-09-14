import { Component } from "@medusajs/icons"
import { clx, Tooltip } from "@medusajs/ui"
import { useTranslation } from "react-i18next"

import { getVariantInventory, VariantInventory } from "./get-variant-inventory"

export const VariantInventoryHeader = () => {
  const { t } = useTranslation()

  return (
    <div className="flex h-full w-full items-center">
      <span>{t("fields.inventory")}</span>
    </div>
  )
}

export const VariantInventoryCell = ({
  variant,
}: {
  variant: VariantInventory
}) => {
  const { t } = useTranslation()
  const { text, hasInventoryKit, quantity, notManaged } = getVariantInventory(
    variant,
    t
  )

  return (
    <Tooltip content={text}>
      <div className="flex h-full w-full items-center gap-2 overflow-hidden">
        {hasInventoryKit && <Component />}
        <span
          className={clx("truncate", {
            "text-ui-fg-error": !quantity && !notManaged,
          })}
        >
          {text}
        </span>
      </div>
    </Tooltip>
  )
}

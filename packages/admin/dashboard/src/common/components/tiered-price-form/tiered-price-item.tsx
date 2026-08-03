import React from "react"
import { IconButton } from "@medusajs/ui"
import { TriangleDownMini, XMarkMini } from "@medusajs/icons"
import { Accordion as RadixAccordion } from "radix-ui"
import { clx } from "@medusajs/ui"
import { AmountDisplay } from "./amount-display"
import { getRuleValue } from "./tiered-price-list"
import { CurrencyInfo } from "../../../lib/data/currencies"

interface TieredPriceItemProps {
  index: number
  currency: CurrencyInfo
  onRemove: (index: number) => void
  children: React.ReactNode
  triggerContent: React.ReactNode
  control: any
}

export const TieredPriceItem = ({
  index,
  currency,
  onRemove,
  children,
  triggerContent,
  control,
}: TieredPriceItemProps) => {
  const handleRemove = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation()
    onRemove(index)
  }

  return (
    <RadixAccordion.Item
      value={getRuleValue(index)}
      className={clx(
        "bg-ui-bg-component shadow-elevation-card-rest rounded-lg"
      )}
    >
      <RadixAccordion.Trigger asChild>
        <div className="group/trigger flex w-full cursor-pointer items-start justify-between gap-x-2 p-3">
          <div className="flex flex-1 flex-wrap items-center justify-between gap-2">
            <div className="flex h-7 items-center">
              <AmountDisplay
                index={index}
                currency={currency}
                control={control}
              />
            </div>
            <div className="flex min-h-7 items-center">{triggerContent}</div>
          </div>
          <div className="flex items-center gap-x-2">
            <IconButton
              size="small"
              variant="transparent"
              className="text-ui-fg-muted hover:text-ui-fg-subtle focus-visible:text-ui-fg-subtle"
              onClick={handleRemove}
            >
              <XMarkMini />
            </IconButton>
            <IconButton
              size="small"
              variant="transparent"
              className="text-ui-fg-muted hover:text-ui-fg-subtle focus-visible:text-ui-fg-subtle"
            >
              <TriangleDownMini className="transition-transform group-data-[state=open]/trigger:rotate-180" />
            </IconButton>
          </div>
        </div>
      </RadixAccordion.Trigger>
      <RadixAccordion.Content className="text-ui-fg-subtle">
        {children}
      </RadixAccordion.Content>
    </RadixAccordion.Item>
  )
}

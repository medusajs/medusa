import { ReactNode } from "react"
import { Accordion as RadixAccordion } from "radix-ui"

const RULE_ITEM_PREFIX = "rule-item"
const getRuleValue = (index: number) => `${RULE_ITEM_PREFIX}-${index}`

interface TieredPriceListProps {
  children?: ReactNode
  value: string[]
  onValueChange: (value: string[]) => void
}

export const TieredPriceList = ({
  children,
  value,
  onValueChange,
}: TieredPriceListProps) => {
  return (
    <RadixAccordion.Root
      type="multiple"
      defaultValue={[getRuleValue(0)]}
      value={value}
      onValueChange={onValueChange}
      className="flex flex-col gap-y-3"
    >
      {children}
    </RadixAccordion.Root>
  )
}

export { getRuleValue }

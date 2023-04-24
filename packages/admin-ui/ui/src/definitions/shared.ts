import { TransitTimeTypeEnum } from "../domain/discounts/types"
import { Option } from "../types/shared"

export const transitTimeOptions: Option[] = [
  {
    label: "Same Day",
    value: TransitTimeTypeEnum.SAME_DAY,
  },
  {
    label: "Next Day",
    value: TransitTimeTypeEnum.NEXT_DAY,
  },
  {
    label: "(1-2) Days",
    value: TransitTimeTypeEnum.ONE_TWO_DAYS,
  },
  {
    label: "(3-5) Days",
    value: TransitTimeTypeEnum.TREE_FIVE_DAYS,
  },
  {
    label: "(5-7) Days",
    value: TransitTimeTypeEnum.FIVE_SEVEN_DAYS,
  },
  {
    label: "(1-2) Weeks",
    value: TransitTimeTypeEnum.ONE_TWO_WEEKS,
  },
  {
    label: "(2+) Weeks",
    value: TransitTimeTypeEnum.TWO_PLUS_WEEKS,
  },
]

export const shippingTypeDisplayLabels = {
  max_subtotal: "Max. subtotal",
  min_subtotal: "Min. subtotal",
  min_weight: "Min. wight",
  max_weight: "Min. wight",
}

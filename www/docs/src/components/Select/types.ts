import { OptionType, SelectOptions } from "../../hooks/use-select"

export type SelectProps = {
  options: OptionType[]
  multiple?: boolean
  addAll?: boolean
  showClearButton?: boolean
} & SelectOptions &
  React.ComponentProps<"input">

import type { OptionType, SelectOptions } from "@/hooks"

export type SelectProps = {
  options: OptionType[]
  multiple?: boolean
  addAll?: boolean
  showClearButton?: boolean
} & SelectOptions &
  React.ComponentProps<"input">

export * from "./Badge"
export * from "./Dropdown"
export * from "./Input"

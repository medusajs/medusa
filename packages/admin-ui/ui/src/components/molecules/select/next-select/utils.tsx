import { omit } from "lodash"
import Highlighter from "react-highlight-words"
import type {
  CommonPropsAndClassName,
  FormatOptionLabelMeta,
  GroupBase,
} from "react-select"

export const cleanCommonProps = <
  Option,
  IsMulti extends boolean,
  Group extends GroupBase<Option>,
  AdditionalProps
>(
  props: Partial<CommonPropsAndClassName<Option, IsMulti, Group>> &
    AdditionalProps
) => {
  const innerProps = omit(props, [
    "className",
    "clearValue",
    "cx",
    "getStyles",
    "getValue",
    "hasValue",
    "isMulti",
    "isRtl",
    "options",
    "selectOption",
    "selectProps",
    "setValue",
    "theme",
  ])
  return { ...innerProps }
}

export const optionIsFixed = (
  option: unknown
): option is { isFixed: unknown } =>
  typeof option === "object" && option !== null && "isFixed" in option

export const optionIsDisabled = (
  option: unknown
): option is { isDisabled: boolean } =>
  typeof option === "object" && option !== null && "isDisabled" in option

export const hasLabel = (option: unknown): option is { label: string } => {
  return typeof option === "object" && option !== null && "label" in option
}

export const hasPrefix = (option: unknown): option is { prefix: string } => {
  return typeof option === "object" && option !== null && "prefix" in option
}

export const hasSuffix = (option: unknown): option is { suffix: string } => {
  return typeof option === "object" && option !== null && "suffix" in option
}

export const isCreateOption = (
  option: unknown
): option is { __isNew__: true } => {
  return typeof option === "object" && option !== null && "__isNew__" in option
}

export const formatOptionLabel = <Option,>(
  option: Option,
  { inputValue }: FormatOptionLabelMeta<Option>
) => {
  if (!hasLabel(option)) {
    return
  }

  if (isCreateOption(option)) {
    return option.label
  }

  return (
    <Highlighter
      searchWords={[inputValue]}
      textToHighlight={option.label}
      highlightClassName="bg-orange-10"
    />
  )
}

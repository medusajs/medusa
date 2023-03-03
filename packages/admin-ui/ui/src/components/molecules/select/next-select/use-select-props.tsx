import isEqual from "lodash/isEqual"
import { useEffect, useState } from "react"
import { ActionMeta, GroupBase, OnChangeValue, Props } from "react-select"
import Components from "./components"
import { formatOptionLabel, hasLabel } from "./utils"

export const useSelectProps = <
  Option,
  IsMulti extends boolean = false,
  Group extends GroupBase<Option> = GroupBase<Option>
>({
  components = {},
  isMulti,
  closeMenuOnScroll = true,
  hideSelectedOptions = false,
  closeMenuOnSelect,
  label,
  size,
  options,
  onChange: changeFn,
  styles,
  ...props
}: Props<Option, IsMulti, Group>): Props<Option, IsMulti, Group> => {
  const [stateOptions, setStateOptions] = useState(options || [])

  const sortOptions = (values: Option[]) => {
    const tmp = values || []

    const unselectedOptions = stateOptions.filter(
      (option) => !tmp.find((op) => isEqual(op, option))
    )

    const orderedNewOptions = tmp.sort((a, b) => {
      if (hasLabel(a) && hasLabel(b)) {
        return a.label > b.label ? 1 : b.label > a.label ? -1 : 0
      }

      return 0
    })

    setStateOptions(orderedNewOptions.concat(unselectedOptions as Option[]))
  }

  useEffect(() => {
    if (isMulti && options) {
      sortOptions(props.value as Option[])
    } else {
      setStateOptions(options || [])
    }
  }, [options, props.value, isMulti])

  const onChange = (
    newValue: OnChangeValue<Option, IsMulti>,
    actionMeta: ActionMeta<Option>
  ) => {
    if (isMulti) {
      sortOptions(newValue as Option[])
    }

    if (changeFn) {
      changeFn(newValue, actionMeta)
    }
  }

  return {
    label,
    components: Components,
    styles: {
      menuPortal: (base) => ({ ...base, zIndex: 60 }),
      ...styles,
    },
    isMulti,
    closeMenuOnScroll: true,
    closeMenuOnSelect:
      closeMenuOnSelect !== undefined ? closeMenuOnSelect : isMulti !== true,
    hideSelectedOptions,
    menuPosition: "fixed",
    maxMenuHeight: size === "sm" ? 154 : 188,
    formatOptionLabel,
    size,
    options: stateOptions,
    onChange,
    ...props,
  }
}

import clsx from "clsx"
import { GroupBase, InputProps } from "react-select"
import SelectPrimitives from "./select-primitives"

const Input = <
  Option,
  IsMulti extends boolean,
  Group extends GroupBase<Option>
>(
  props: InputProps<Option, IsMulti, Group>
) => {
  const { className, cx, value, inputClassName } = props

  return (
    <div
      data-value={value || ""}
      className={cx({ "input-container": true }, className)}
    >
      <SelectPrimitives.Input
        {...props}
        className={cx(
          {
            input: true,
            "input--is-disabled": props.isDisabled ? true : false,
          },
          clsx(
            "inter-base-regular text-grey-90 caret-violet-60",
            inputClassName
          )
        )}
      />
    </div>
  )
}

export default Input

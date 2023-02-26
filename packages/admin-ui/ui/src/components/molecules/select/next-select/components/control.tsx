import clsx from "clsx"
import {
  ClearIndicatorProps,
  ControlProps,
  DropdownIndicatorProps,
  GroupBase,
  LoadingIndicatorProps,
} from "react-select"
import Spinner from "../../../../atoms/spinner"
import ChevronDownIcon from "../../../../fundamentals/icons/chevron-down"
import XCircleIcon from "../../../../fundamentals/icons/x-circle-icon"

const Control = <
  Option,
  IsMulti extends boolean,
  Group extends GroupBase<Option>
>({
  className,
  cx,
  children,
  innerRef,
  innerProps,
  isDisabled,
  isFocused,
  menuIsOpen,
  selectProps: { size, customStyles, name },
}: ControlProps<Option, IsMulti, Group>) => {
  return (
    <div
      ref={innerRef}
      {...innerProps}
      id={name}
      className={cx(
        {
          control: true,
          "control--is-disabled": isDisabled,
          "control--is-focused": isFocused,
          "control--menu-is-open": menuIsOpen,
        },
        clsx(
          "flex p-0 overflow-hidden rounded-rounded border border-gray-20 bg-grey-5 focus-within:shadow-cta transition-colors focus-within:border-violet-60 box-border pl-small",
          {
            "h-xlarge": size === "sm",
            "h-10": size === "md" || !size,
          },
          className,
          customStyles?.control
        )
      )}
    >
      <div
        className={clsx(
          "flex items-center flex-1",
          customStyles?.inner_control
        )}
      >
        {children}
      </div>
    </div>
  )
}

export default Control

export const DropdownIndicator = <
  Option,
  IsMulti extends boolean,
  Group extends GroupBase<Option>
>({
  innerProps,
  cx,
  children,
  className,
  selectProps: { menuIsOpen },
}: DropdownIndicatorProps<Option, IsMulti, Group>) => {
  return (
    <div
      {...innerProps}
      className={cx(
        {
          indicator: true,
          "dropdown-indicator": true,
        },
        clsx(
          "transition-all",
          {
            "rotate-180": menuIsOpen,
          },
          className
        )
      )}
    >
      {children || <ChevronDownIcon size={16} />}
    </div>
  )
}

export const LoadingIndicator = <
  Option,
  IsMulti extends boolean,
  Group extends GroupBase<Option>
>({
  innerProps,
  className,
  cx,
}: LoadingIndicatorProps<Option, IsMulti, Group>) => {
  return (
    <div
      {...innerProps}
      className={cx(
        {
          indicator: true,
          "loading-indicator": true,
        },
        className
      )}
    >
      <Spinner size="small" variant="secondary" />
    </div>
  )
}

export const ClearIndicator = <
  Option,
  IsMulti extends boolean,
  Group extends GroupBase<Option>
>({
  innerProps,
  className,
  cx,
  children,
}: ClearIndicatorProps<Option, IsMulti, Group>) => {
  return (
    <div
      {...innerProps}
      role="button"
      aria-label="Clear selected options"
      className={cx(
        {
          indicator: true,
          "clear-indicator": true,
        },
        className
      )}
    >
      {children || <XCircleIcon size={16} />}
    </div>
  )
}

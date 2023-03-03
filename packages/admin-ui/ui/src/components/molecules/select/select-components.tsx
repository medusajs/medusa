import clsx from "clsx"
import React from "react"
import {
  ClearIndicatorProps,
  components,
  ContainerProps,
  DropdownIndicatorProps,
  GroupBase,
  InputProps,
  MenuListProps,
  MenuProps,
  MultiValueProps,
  NoticeProps,
  OptionProps,
  PlaceholderProps,
  SingleValueProps,
} from "react-select"
import CheckIcon from "../../fundamentals/icons/check-icon"
import ChevronDownIcon from "../../fundamentals/icons/chevron-down"
import SearchIcon from "../../fundamentals/icons/search-icon"
import XCircleIcon from "../../fundamentals/icons/x-circle-icon"

const MultiValueLabel = <
  Option,
  IsMulti extends boolean,
  Group extends GroupBase<Option>
>({
  innerProps,
  data,
  selectProps: { value, isSearchable, menuIsOpen },
  children,
}: MultiValueProps<Option, IsMulti, Group>) => {
  const isLast = Array.isArray(value) ? value[value.length - 1] === data : true

  if (menuIsOpen && isSearchable) {
    return null
  }

  return (
    <div
      {...innerProps}
      className={clsx("bg-grey-5 mx-0 inter-base-regular p-0", {
        "after:content-[',']": !isLast,
      })}
    >
      {children}
    </div>
  )
}

const Menu = <
  Option,
  IsMulti extends boolean,
  Group extends GroupBase<Option>
>({
  className,
  ...props
}: MenuProps<Option, IsMulti, Group>) => {
  return (
    <components.Menu
      className={clsx("!rounded-rounded", {
        "-mt-1 z-60":
          !props.selectProps.isSearchable && props.menuPlacement === "bottom",
        "mb-3 z-60":
          !props.selectProps.isSearchable && props.menuPlacement === "top",
      })}
      {...props}
    >
      {props.children}
    </components.Menu>
  )
}

const MenuList = <
  Option,
  IsMulti extends boolean,
  Group extends GroupBase<Option>
>({
  className,
  ...props
}: MenuListProps<Option, IsMulti, Group>) => {
  return (
    <components.MenuList
      className={clsx(className, "!rounded-rounded !no-scrollbar")}
      {...props}
    />
  )
}

const Placeholder = <
  Option,
  IsMulti extends boolean,
  Group extends GroupBase<Option>
>(
  props: PlaceholderProps<Option, IsMulti, Group>
) => {
  return props.selectProps.menuIsOpen ? null : (
    <components.Placeholder {...props} className="!mx-0 !text-grey-40" />
  )
}

const SingleValue = <
  Option,
  IsMulti extends boolean,
  Group extends GroupBase<Option>
>({
  children,
  ...props
}: SingleValueProps<Option, IsMulti, Group>) => {
  if (props.selectProps.menuIsOpen && props.selectProps.isSearchable) {
    return null
  }

  return <components.SingleValue {...props}>{children}</components.SingleValue>
}

const DropdownIndicator = <
  Option,
  IsMulti extends boolean,
  Group extends GroupBase<Option>
>({
  innerProps,
  selectProps: { menuIsOpen },
}: DropdownIndicatorProps<Option, IsMulti, Group>) => {
  return (
    <div {...innerProps} className="flex items-center justify-center">
      <ChevronDownIcon
        size={16}
        className={clsx("text-grey-50 transition-all", {
          "rotate-180": menuIsOpen,
        })}
      />
    </div>
  )
}

const SelectContainer = <
  Option,
  IsMulti extends boolean,
  Group extends GroupBase<Option>
>(
  props: ContainerProps<Option, IsMulti, Group>
) => {
  return (
    <div className="bg-grey-5 h-10 border border-grey-20 rounded-rounded focus-within:shadow-cta focus-within:border-violet-60 px-small">
      <components.SelectContainer {...props} />
    </div>
  )
}

const Input = <
  Option,
  IsMulti extends boolean,
  Group extends GroupBase<Option>
>(
  props: InputProps<Option, IsMulti, Group>
) => {
  if (
    props.isHidden ||
    !props.selectProps.menuIsOpen ||
    !props.selectProps.isSearchable
  ) {
    return <components.Input {...props} className="pointer-events-none" />
  }

  return (
    <div className="w-full flex items-center h-full space-between">
      <div className="w-full flex items-center">
        <span className="text-grey-40 mr-2">
          <SearchIcon size={16} />
        </span>
        <components.Input {...props} />
      </div>
    </div>
  )
}

const ClearIndicator = <
  Option,
  IsMulti extends boolean,
  Group extends GroupBase<Option>
>({
  innerProps,
  selectProps: { isMulti, menuIsOpen },
}: ClearIndicatorProps<Option, IsMulti, Group>) => {
  if (menuIsOpen || isMulti) {
    return <></>
  }

  return (
    <div
      {...innerProps}
      className="hover:bg-grey-10 text-grey-50 rounded cursor-pointer"
    >
      <XCircleIcon size={16} />
    </div>
  )
}

const CheckboxAdornment = ({ isSelected }: { isSelected: boolean }) => {
  return (
    <div
      className={clsx(
        `w-5 h-5 flex justify-center text-grey-0 border-grey-30 border rounded-base`,
        {
          "bg-violet-60": isSelected,
        }
      )}
    >
      <span className="self-center">
        {isSelected && <CheckIcon size={16} />}
      </span>
    </div>
  )
}

const RadioAdornment = ({ isSelected }: { isSelected: boolean }) => {
  return (
    <div
      className={clsx(
        "radio-outer-ring outline-0",
        "shrink-0 w-[20px] h-[20px] rounded-circle",
        {
          "shadow-[0_0_0_1px] shadow-[#D1D5DB]": !isSelected,
          "shadow-[0_0_0_2px] shadow-violet-60": isSelected,
        }
      )}
    >
      {isSelected && (
        <div
          className={clsx(
            "group flex items-center justify-center w-full h-full relative",
            "after:absolute after:inset-0 after:m-auto after:block after:w-[12px] after:h-[12px] after:bg-violet-60 after:rounded-circle"
          )}
        />
      )}
    </div>
  )
}

const NoOptionsMessage = <
  Option,
  IsMulti extends boolean,
  Group extends GroupBase<Option>
>({
  innerProps,
  selectProps: { isLoading },
}: NoticeProps<Option, IsMulti, Group>) => {
  return (
    <div
      className="text-grey-50 inter-small-semibold text-center p-xsmall"
      {...innerProps}
    >
      <p>{isLoading ? "Loading..." : "No options"}</p>
    </div>
  )
}

const Option = <
  Option,
  IsMulti extends boolean,
  Group extends GroupBase<Option>
>({
  className,
  ...props
}: OptionProps<Option, IsMulti, Group>) => {
  return (
    <components.Option
      {...props}
      className="my-1 py-0 px-2 bg-grey-0 active:bg-grey-0"
    >
      <div
        className={`item-renderer h-full hover:bg-grey-10 py-2 px-2 cursor-pointer rounded`}
      >
        <div className="items-center h-full flex">
          {props.data?.value !== "all" && props.data?.label !== "Select All" ? (
            <>
              {props.isMulti ? (
                <CheckboxAdornment isSelected={props.isSelected} />
              ) : (
                <RadioAdornment isSelected={props.isSelected} />
              )}
              <span className="ml-3 text-grey-90 inter-base-regular">
                {props.data.label}
              </span>
            </>
          ) : (
            <span className="text-grey-90 inter-base-regular">
              {props.data.label}
            </span>
          )}
        </div>
      </div>
    </components.Option>
  )
}

export const SelectComponents = {
  Menu,
  MenuList,
  Placeholder,
  SingleValue,
  DropdownIndicator,
  SelectContainer,
  Input,
  ClearIndicator,
  CheckboxAdornment,
  RadioAdornment,
  NoOptionsMessage,
  Option,
  IndicatorSeparator: () => null,
  MultiValueRemove: () => null,
  MultiValueLabel,
}

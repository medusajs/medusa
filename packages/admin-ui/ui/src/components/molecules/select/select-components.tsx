import clsx from "clsx"
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
      className={clsx("bg-grey-5 inter-base-regular mx-0 p-0", {
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
        "z-60 -mt-1":
          !props.selectProps.isSearchable && props.menuPlacement === "bottom",
        "z-60 mb-3":
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
    <components.Placeholder {...props} className="!text-grey-40 !mx-0" />
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
    <div className="bg-grey-5 border-grey-20 rounded-rounded focus-within:shadow-cta focus-within:border-violet-60 px-small h-10 border">
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
    <div className="space-between flex h-full w-full items-center">
      <div className="flex w-full items-center">
        <span className="text-grey-40 me-2">
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
      className="hover:bg-grey-10 text-grey-50 cursor-pointer rounded"
    >
      <XCircleIcon size={16} />
    </div>
  )
}

const CheckboxAdornment = ({ isSelected }: { isSelected: boolean }) => {
  return (
    <div
      className={clsx(
        `text-grey-0 border-grey-30 rounded-base flex h-5 w-5 justify-center border`,
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
        "rounded-circle h-[20px] w-[20px] shrink-0",
        {
          "shadow-[0_0_0_1px] shadow-[#D1D5DB]": !isSelected,
          "shadow-violet-60 shadow-[0_0_0_2px]": isSelected,
        }
      )}
    >
      {isSelected && (
        <div
          className={clsx(
            "group relative flex h-full w-full items-center justify-center",
            "after:bg-violet-60 after:rounded-circle after:absolute after:inset-0 after:m-auto after:block after:h-[12px] after:w-[12px]"
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
      className="text-grey-50 inter-small-semibold p-xsmall text-center"
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
      className="bg-grey-0 active:bg-grey-0 my-1 px-2 py-0"
    >
      <div
        className={`item-renderer hover:bg-grey-10 h-full cursor-pointer rounded px-2 py-2`}
      >
        <div className="flex h-full items-center">
          {props.data?.value !== "all" && props.data?.label !== "Select All" ? (
            <>
              {props.isMulti ? (
                <CheckboxAdornment isSelected={props.isSelected} />
              ) : (
                <RadioAdornment isSelected={props.isSelected} />
              )}
              <span className="text-grey-90 inter-base-regular ms-3">
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

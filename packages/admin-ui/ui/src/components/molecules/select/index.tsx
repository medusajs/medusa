import clsx from "clsx"
import React, {
  useContext,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from "react"
import Primitive from "react-select"
import AsyncPrimitive from "react-select/async"
import AsyncCreatablePrimitive from "react-select/async-creatable"
import CreatablePrimitive from "react-select/creatable"
import InputHeader, { InputHeaderProps } from "../../fundamentals/input-header"
import { ModalContext } from "../modal"
import { SelectComponents } from "./select-components"

export type SelectOption<T> = {
  value: T
  label: string
  disabled?: boolean
}

type MultiSelectProps = InputHeaderProps & {
  // component props
  label: string
  required?: boolean
  name?: string
  className?: string
  fullWidth?: boolean
  // Multiselect props
  placeholder?: string
  isMultiSelect?: boolean
  labelledBy?: string
  options: { label: string; value: string | null; disabled?: boolean }[]
  value:
    | { label: string; value: string }[]
    | { label: string; value: string }
    | null
  filterOptions?: (q: string) => any[]
  hasSelectAll?: boolean
  isLoading?: boolean
  shouldToggleOnHover?: boolean
  onChange: (values: any[] | any) => void
  disabled?: boolean
  enableSearch?: boolean
  isCreatable?: boolean
  clearSelected?: boolean
  onCreateOption?: (value: string) => { value: string; label: string }
}

const SSelect = React.forwardRef(
  (
    {
      label,
      name,
      fullWidth = false,
      required,
      value,
      onChange,
      className,
      isMultiSelect,
      hasSelectAll,
      tooltipContent,
      tooltip,
      enableSearch = true,
      clearSelected = false,
      isCreatable,
      filterOptions,
      placeholder = "Search...",
      options,
      onCreateOption,
    }: MultiSelectProps,
    ref
  ) => {
    const { portalRef } = useContext(ModalContext)

    const [isFocussed, setIsFocussed] = useState(false)
    const [scrollBlocked, setScrollBlocked] = useState(true)

    useEffect(() => {
      window.addEventListener("resize", () => {
        setIsFocussed(false)
        selectRef?.current?.blur()
      })
    }, [])

    const selectRef = useRef(null)

    useImperativeHandle(ref, () => selectRef.current)

    const containerRef = useRef(null)

    const onClickOption = (val, ...args) => {
      if (
        val?.length &&
        val?.find((option) => option.value === "all") &&
        hasSelectAll &&
        isMultiSelect
      ) {
        onChange(options)
      } else {
        onChange(val)
        if (!isMultiSelect) {
          selectRef?.current?.blur()
          setIsFocussed(false)
        }
      }
    }

    const handleOnCreateOption = (val) => {
      if (onCreateOption) {
        onCreateOption(val)
        setIsFocussed(false)
        selectRef?.current?.blur()
      }
    }

    useEffect(() => {
      const delayDebounceFn = setTimeout(() => {
        if (isFocussed) {
          setScrollBlocked(false)
        }
      }, 50)

      return () => clearTimeout(delayDebounceFn)
    }, [isFocussed])

    return (
      <div
        ref={containerRef}
        className={clsx({
          "w-full": fullWidth,
        })}
      >
        <div
          key={name}
          className={clsx(className, {
            "bg-white rounded-t-rounded": isFocussed,
          })}
        >
          <div className="w-full flex text-grey-50 pr-0.5 justify-between pointer-events-none cursor-pointer mb-2">
            <InputHeader {...{ label, required, tooltip, tooltipContent }} />
          </div>

          {
            <GetSelect
              isCreatable={isCreatable}
              searchBackend={filterOptions}
              options={
                hasSelectAll && isMultiSelect
                  ? [{ value: "all", label: "Select All" }, ...options]
                  : options
              }
              ref={selectRef}
              value={value}
              isMulti={isMultiSelect}
              openMenuOnFocus={isMultiSelect}
              isSearchable={enableSearch}
              isClearable={clearSelected}
              onChange={onClickOption}
              onMenuOpen={() => {
                setIsFocussed(true)
              }}
              onMenuClose={() => {
                setScrollBlocked(true)
                setIsFocussed(false)
              }}
              closeMenuOnScroll={(e) => {
                if (
                  !scrollBlocked &&
                  e.target?.contains(containerRef.current) &&
                  e.target !== document
                ) {
                  return true
                }
              }}
              closeMenuOnSelect={!isMultiSelect}
              blurInputOnSelect={!isMultiSelect}
              styles={{ menuPortal: (base) => ({ ...base, zIndex: 60 }) }}
              hideSelectedOptions={false}
              menuPortalTarget={portalRef?.current?.lastChild || document.body}
              menuPlacement="auto"
              backspaceRemovesValue={false}
              classNamePrefix="react-select"
              placeholder={placeholder}
              className="react-select-container"
              onCreateOption={handleOnCreateOption}
              components={SelectComponents}
            />
          }
          {isFocussed && enableSearch && <div className="w-full h-5" />}
        </div>
      </div>
    )
  }
)

const GetSelect = React.forwardRef(
  (
    { isCreatable, searchBackend, onCreateOption, handleClose, ...props },
    ref
  ) => {
    if (isCreatable) {
      return searchBackend ? (
        <AsyncCreatablePrimitive
          ref={ref}
          defaultOptions={true}
          onCreateOption={onCreateOption}
          isSearchable
          loadOptions={searchBackend}
          {...props}
        />
      ) : (
        <CreatablePrimitive
          {...props}
          isSearchable
          ref={ref}
          onCreateOption={onCreateOption}
        />
      )
    } else if (searchBackend) {
      return (
        <AsyncPrimitive
          ref={ref}
          defaultOptions={true}
          loadOptions={searchBackend}
          {...props}
        />
      )
    }
    return <Primitive ref={ref} {...props} />
  }
)

export default SSelect

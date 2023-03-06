import clsx from "clsx"
import React, { ComponentPropsWithRef, forwardRef } from "react"
import {
  ContainerProps,
  GroupBase,
  IndicatorsContainerProps,
  ValueContainerProps,
} from "react-select"
import InputError from "../../../../atoms/input-error"

type AdjacentContainerProps = {
  label?: string
  htmlFor?: string
  helperText?: string
  required?: boolean
  name?: string
  errors?: Record<string, unknown>
  children?: React.ReactNode
} & ComponentPropsWithRef<"div">

export const AdjacentContainer = forwardRef<
  HTMLDivElement,
  AdjacentContainerProps
>(
  (
    {
      label,
      helperText,
      required,
      errors,
      name,
      children,
    }: AdjacentContainerProps,
    ref
  ) => {
    return (
      <div className="flex flex-col gap-y-xsmall w-full" ref={ref}>
        {label && (
          <label
            className="inter-small-semibold text-grey-50"
            id={`${name}_label`}
          >
            {label}
            {required && <span className="text-rose-50">*</span>}
          </label>
        )}
        {children}
        {name && errors ? (
          <InputError errors={errors} name={name} className="-mt-0.5" />
        ) : helperText ? (
          <p className="inter-small-regular text-grey-50">{helperText}</p>
        ) : null}
      </div>
    )
  }
)

export const SelectContainer = <
  Option,
  IsMulti extends boolean,
  Group extends GroupBase<Option>
>({
  innerProps,
  selectProps: { isDisabled, isRtl },
  hasValue,
  cx,
  className,
  children,
}: ContainerProps<Option, IsMulti, Group>) => {
  return (
    <div
      {...innerProps}
      className={cx(
        {
          "--is-disabled": isDisabled,
          "--is-rtl": isRtl,
          "--has-value": hasValue,
        },
        clsx(
          "relative pointer-events-auto",
          { "text-grey-40": isDisabled },
          className
        )
      )}
    >
      {children}
    </div>
  )
}

export const ValueContainer = <
  Option,
  IsMulti extends boolean,
  Group extends GroupBase<Option>
>(
  props: ValueContainerProps<Option, IsMulti, Group>
) => {
  const {
    className,
    children,
    cx,
    innerProps,
    isMulti,
    hasValue,
    selectProps: { value, inputValue, label, selectedPlaceholder },
  } = props

  if (isMulti && Array.isArray(value)) {
    return (
      <div
        {...innerProps}
        className={cx(
          {
            "value-container": true,
            "value-container--is-multi": isMulti,
            "value-container--has-value": hasValue,
          },
          clsx(
            "group flex items-center flex-wrap relative scrolling-touch overflow-hidden flex-1",
            {
              "gap-2xsmall": isMulti,
            },
            className
          )
        )}
      >
        {value?.length > 0 && (
          <div className="h-7 bg-grey-20 text-grey-50 px-small inter-small-semibold flex items-center rounded-rounded gap-x-2xsmall cursor-default">
            <span>{value.length}</span>
          </div>
        )}
        <div className="relative grow">
          {children}
          {value?.length > 0 && inputValue === "" && (
            <span className="absolute top-1/2 -translate-y-1/2 inter-base-regular text-grey-50">
              {selectedPlaceholder || label || "Selected"}
            </span>
          )}
        </div>
      </div>
    )
  }

  return (
    <div
      {...innerProps}
      className={cx(
        {
          "value-container": true,
          "value-container--is-multi": isMulti,
          "value-container--has-value": hasValue,
        },
        clsx(
          "flex items-center flex-wrap relative scrolling-touch overflow-hidden flex-1",
          {
            "gap-2xsmall": isMulti,
          },
          className
        )
      )}
    >
      {children}
    </div>
  )
}

export const IndicatorsContainer = <
  Option,
  IsMulti extends boolean,
  Group extends GroupBase<Option>
>({
  className,
  cx,
  innerProps,
  children,
}: IndicatorsContainerProps<Option, IsMulti, Group>) => {
  return (
    <div
      {...innerProps}
      className={cx(
        {
          "indicators-container": true,
        },
        clsx("text-grey-50 flex items-center gap-x-small px-small", className)
      )}
    >
      {children}
    </div>
  )
}

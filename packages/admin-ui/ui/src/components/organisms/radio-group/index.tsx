import * as RadioGroupPrimitive from "@radix-ui/react-radio-group"
import clsx from "clsx"
import React from "react"
import Tooltip from "../../atoms/tooltip"
import LockIcon from "../../fundamentals/icons/lock-icon"

type RadioGroupItemProps = {
  label: string
  sublabel?: string
  description?: string
  disabledTooltip?: string
} & RadioGroupPrimitive.RadioGroupItemProps &
  React.RefAttributes<HTMLButtonElement>

type RadioGroupSimpleItemProps = {
  label?: string
  description?: string
} & RadioGroupPrimitive.RadioGroupItemProps &
  React.RefAttributes<HTMLButtonElement>

type DotProps = RadioGroupPrimitive.RadioGroupItemProps &
  React.RefAttributes<HTMLButtonElement>

const Root = RadioGroupPrimitive.Root

const Item = ({
  label,
  sublabel,
  description,
  className,
  disabled,
  disabledTooltip,
  children,
  ...rest
}: RadioGroupItemProps) => {
  return (
    <label
      className={clsx(
        "rounded-rounded relative border border-grey-20 p-base flex items-start mb-xsmall gap-base cursor-pointer",
        { "bg-grey-5 text-grey-40": disabled },
        className
      )}
      htmlFor={rest.value}
    >
      {!disabled ? (
        <RadioGroupPrimitive.Item
          {...rest}
          id={rest.value}
          disabled={disabled}
          className={clsx(
            "radio-outer-ring outline-0",
            "shrink-0 w-[20px] h-[20px] shadow-[0_0_0_1px] shadow-grey-20 rounded-circle"
          )}
        >
          <RadioGroupPrimitive.Indicator
            className={clsx(
              "indicator flex items-center justify-center w-full h-full relative",
              "after:absolute after:inset-0 after:m-auto after:block after:w-[12px] after:h-[12px] after:bg-violet-60 after:rounded-circle"
            )}
          />
          {/* Outline indicator: purely stylistical */}
          <RadioGroupPrimitive.Indicator
            //  we want to hide this indicator from screen readers because the previous one is enough
            aria-hidden="true"
            className={clsx(
              "absolute inset-0 shadow-violet-60 shadow-[0_0_0_2px] rounded-rounded"
            )}
          />
        </RadioGroupPrimitive.Item>
      ) : (
        <Tooltip content={disabledTooltip}>
          <LockIcon size={20} className="text-grey-40" />
        </Tooltip>
      )}
      <div className="truncate">
        <div className="flex items-center">
          <p className="inter-base-semibold truncate">
            {label}{" "}
            {sublabel ? (
              <span className="inter-base-regular text-grey-50">
                {sublabel}
              </span>
            ) : null}
          </p>
        </div>
        {description && (
          <p
            className={clsx(
              "inter-small-regular text-grey-50 mt-2xsmall truncate",
              {
                "text-grey-40": disabled,
              }
            )}
          >
            {description}
          </p>
        )}
        {children}
      </div>
    </label>
  )
}

const SimpleItem: React.FC<RadioGroupSimpleItemProps> = ({
  label,
  description,
  className,
  ...rest
}) => {
  return (
    <label
      className={clsx(
        "flex items-center mr-large last:mr-0",
        {
          ["opacity-50 select-none pointer-events-none"]: rest.disabled,
        },
        className
      )}
      htmlFor={rest.value}
    >
      <RadioGroupPrimitive.Item
        {...rest}
        id={rest.value}
        className={clsx(
          "radio-outer-ring outline-0",
          "shrink-0 w-[20px] h-[20px] shadow-[0_0_0_1px] shadow-[#D1D5DB] rounded-circle"
        )}
      >
        <RadioGroupPrimitive.Indicator
          className={clsx(
            "flex items-center justify-center w-full h-full relative indicator",
            "after:absolute after:inset-0 after:m-auto after:block after:w-[12px] after:h-[12px] after:bg-violet-60 after:rounded-circle"
          )}
        />
      </RadioGroupPrimitive.Item>
      <div className="ml-small inter-base-regular cursor-pointer w-full">
        <span>{label && label}</span>
        <span>{description && description}</span>
      </div>
    </label>
  )
}

const Dot: React.FC<DotProps> = ({ className, ...rest }) => {
  return (
    <label
      className={clsx(
        {
          ["opacity-50 select-none pointer-events-none"]: rest.disabled,
        },
        className
      )}
      htmlFor={rest.value}
    >
      <RadioGroupPrimitive.Item
        {...rest}
        id={rest.value}
        className={clsx(
          "radio-outer-ring outline-0",
          "shrink-0 w-[20px] h-[20px] shadow-[0_0_0_1px] shadow-[#D1D5DB] rounded-circle"
        )}
      >
        <RadioGroupPrimitive.Indicator
          className={clsx(
            "flex items-center justify-center w-full h-full relative indicator",
            "after:absolute after:inset-0 after:m-auto after:block after:w-[12px] after:h-[12px] after:bg-violet-60 after:rounded-circle"
          )}
        />
      </RadioGroupPrimitive.Item>
    </label>
  )
}

export default { Root, Item, SimpleItem, Dot }

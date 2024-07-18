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
        "rounded-rounded border-grey-20 p-base mb-xsmall gap-base relative flex cursor-pointer items-start border",
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
            "shadow-grey-20 rounded-circle h-[20px] w-[20px] shrink-0 shadow-[0_0_0_1px]"
          )}
        >
          <RadioGroupPrimitive.Indicator
            className={clsx(
              "indicator relative flex h-full w-full items-center justify-center",
              "after:bg-violet-60 after:rounded-circle after:absolute after:inset-0 after:m-auto after:block after:h-[12px] after:w-[12px]"
            )}
          />
          {/* Outline indicator: purely stylistical */}
          <RadioGroupPrimitive.Indicator
            //  we want to hide this indicator from screen readers because the previous one is enough
            aria-hidden="true"
            className={clsx(
              "shadow-violet-60 rounded-rounded absolute inset-0 shadow-[0_0_0_2px]"
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
        "me-large flex items-center last:me-0",
        {
          ["pointer-events-none select-none opacity-50"]: rest.disabled,
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
          "rounded-circle h-[20px] w-[20px] shrink-0 shadow-[0_0_0_1px] shadow-[#D1D5DB]"
        )}
      >
        <RadioGroupPrimitive.Indicator
          className={clsx(
            "indicator relative flex h-full w-full items-center justify-center",
            "after:bg-violet-60 after:rounded-circle after:absolute after:inset-0 after:m-auto after:block after:h-[12px] after:w-[12px]"
          )}
        />
      </RadioGroupPrimitive.Item>
      <div className="ms-small inter-base-regular w-full cursor-pointer">
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
          ["pointer-events-none select-none opacity-50"]: rest.disabled,
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
          "rounded-circle h-[20px] w-[20px] shrink-0 shadow-[0_0_0_1px] shadow-[#D1D5DB]"
        )}
      >
        <RadioGroupPrimitive.Indicator
          className={clsx(
            "indicator relative flex h-full w-full items-center justify-center",
            "after:bg-violet-60 after:rounded-circle after:absolute after:inset-0 after:m-auto after:block after:h-[12px] after:w-[12px]"
          )}
        />
      </RadioGroupPrimitive.Item>
    </label>
  )
}

export default { Root, Item, SimpleItem, Dot }

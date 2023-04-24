import { FC, RefAttributes } from "react"
import * as ToggleGroup from "@radix-ui/react-toggle-group"
import clsx from "clsx"

export type ButtonGroupProps = (
  | ToggleGroup.ToggleGroupSingleProps
  | ToggleGroup.ToggleGroupMultipleProps
) &
  RefAttributes<HTMLDivElement>

export const ButtonGroup: FC<ButtonGroupProps> = ({ className, ...props }) => (
  <ToggleGroup.Root
    className={clsx("inline-flex shadow-sm rounded-md", className)}
    {...props}
  />
)

export type ButtonGroupItemProps = ToggleGroup.ToggleGroupItemProps &
  RefAttributes<HTMLButtonElement>

export const ButtonGroupItem: FC<ButtonGroupItemProps> = ({
  className,
  ...props
}) => (
  <ToggleGroup.Item
    className={clsx(
      `relative flex items-center gap-2 px-4 h-10 leading-10`,
      `border border-grey-20`,
      `first:rounded-l-rounded last:rounded-r-rounded -ml-[1px] first:ml-0`,
      `inter-base-regular radix-state-on:inter-base-semibold`,
      `focus:z-10 focus:outline-none focus:shadow-cta focus:border-violet-60`,
      `bg-grey-5 radix-state-on:bg-white`,
      `text-grey-50 radix-state-on:text-grey-90`,
      className
    )}
    {...props}
  />
)

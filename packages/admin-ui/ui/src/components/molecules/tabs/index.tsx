import { FC, HTMLAttributes } from "react"
import * as RadixTabs from "@radix-ui/react-tabs"
import clsx from "clsx"

export const Tabs: FC<RadixTabs.TabsProps> = (props) => (
  <RadixTabs.Root {...props} />
)

export const TabsList: FC<RadixTabs.TabsListProps> = ({
  className,
  ...props
}) => (
  <RadixTabs.List
    {...props}
    className={clsx("flex w-full mb-6 border-b border-grey-20", className)}
  />
)

export const TabsTrigger: FC<
  RadixTabs.TabsTriggerProps & { icon?: FC<HTMLAttributes<SVGElement>> }
> = ({ icon: Icon, children, className, ...props }) => (
  <RadixTabs.Trigger
    {...props}
    className={clsx(
      "text-left flex items-center justify-start gap-2 flex-1 pr-3 -mb-[1px] border-b-2 border-transparent group radix-state-active:border-violet-60 radix-state-active:text-violet-60 radix-state-active:font-semibold",
      {
        "py-2": !Icon,
        "py-3": !!Icon,
      },
      className
    )}
  >
    {Icon && (
      <span className="w-5 h-5 shrink-0">
        <Icon className="w-5 h-5 text-grey-40 group-radix-state-active:text-inherit" />
      </span>
    )}

    {children}
  </RadixTabs.Trigger>
)

export const TabsContent: FC<RadixTabs.TabsContentProps> = (props) => (
  <RadixTabs.Content {...props} />
)

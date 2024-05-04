import { MagnifyingGlass } from "@medusajs/icons"
import { Kbd, Text, clx } from "@medusajs/ui"
import * as Dialog from "@radix-ui/react-dialog"
import { Command } from "cmdk"
import {
  ComponentPropsWithoutRef,
  ElementRef,
  HTMLAttributes,
  forwardRef,
  useMemo,
} from "react"
import { useTranslation } from "react-i18next"

import { useSearch } from "../../providers/search-provider"

export const Search = () => {
  const { open, onOpenChange } = useSearch()
  const links = useLinks()

  return (
    <CommandDialog open={open} onOpenChange={onOpenChange}>
      <CommandInput placeholder="Search" />
      <CommandList>
        <CommandEmpty>No results found.</CommandEmpty>
        {links.map((group) => {
          return (
            <CommandGroup key={group.title} heading={group.title}>
              {group.items.map((item) => {
                return (
                  <CommandItem key={item.label}>
                    <span>{item.label}</span>
                  </CommandItem>
                )
              })}
            </CommandGroup>
          )
        })}
      </CommandList>
    </CommandDialog>
  )
}

type CommandItemProps = {
  label: string
}

type CommandGroupProps = {
  title: string
  items: CommandItemProps[]
}

const useLinks = (): CommandGroupProps[] => {
  const { t } = useTranslation()

  return useMemo(
    () => [
      {
        title: "Pages",
        items: [
          {
            label: t("products.domain"),
          },
          {
            label: t("categories.domain"),
          },
          {
            label: t("collections.domain"),
          },
          {
            label: t("giftCards.domain"),
          },
          {
            label: t("orders.domain"),
          },
          {
            label: t("draftOrders.domain"),
          },
          {
            label: t("customers.domain"),
          },
          {
            label: t("customerGroups.domain"),
          },
          {
            label: t("discounts.domain"),
          },
          {
            label: t("pricing.domain"),
          },
        ],
      },
      {
        title: "Settings",
        items: [
          {
            label: t("profile.domain"),
          },
          {
            label: t("store.domain"),
          },
          {
            label: t("users.domain"),
          },
          {
            label: t("regions.domain"),
          },
          {
            label: t("locations.domain"),
          },
          {
            label: t("salesChannels.domain"),
          },
          {
            label: t("apiKeyManagement.domainTitle"),
          },
        ],
      },
    ],
    [t]
  )
}

const CommandPalette = forwardRef<
  ElementRef<typeof Command>,
  ComponentPropsWithoutRef<typeof Command>
>(({ className, ...props }, ref) => (
  <Command
    ref={ref}
    className={clx(
      "bg-popover text-popover-foreground flex h-full w-full flex-col overflow-hidden rounded-md",
      className
    )}
    {...props}
  />
))
Command.displayName = Command.displayName

interface CommandDialogProps extends Dialog.DialogProps {}

const CommandDialog = ({ children, ...props }: CommandDialogProps) => {
  return (
    <Dialog.Root {...props}>
      <Dialog.Portal>
        <Dialog.Overlay className="bg-ui-bg-overlay fixed inset-0" />
        <Dialog.Content className="bg-ui-bg-base shadow-elevation-modal fixed left-[50%] top-[50%] w-full max-w-2xl translate-x-[-50%] translate-y-[-50%] overflow-hidden rounded-xl p-0">
          <CommandPalette className="[&_[cmdk-group-heading]]:text-muted-foreground [&_[cmdk-group-heading]]:px-2 [&_[cmdk-group-heading]]:font-medium [&_[cmdk-group]:not([hidden])_~[cmdk-group]]:pt-0 [&_[cmdk-group]]:px-2 [&_[cmdk-input-wrapper]_svg]:h-5 [&_[cmdk-input-wrapper]_svg]:w-5 [&_[cmdk-input]]:h-12 [&_[cmdk-item]]:px-2 [&_[cmdk-item]]:py-3 [&_[cmdk-item]_svg]:h-5 [&_[cmdk-item]_svg]:w-5">
            {children}
          </CommandPalette>
          <div className="flex items-center justify-between border-t px-4 pb-4 pt-3">
            <div></div>
            <div className="flex items-center gap-x-3">
              <div className="flex items-center gap-x-2">
                <Text size="xsmall" leading="compact">
                  Navigation
                </Text>
                <div className="flex items-center gap-x-1">
                  <Kbd>↓</Kbd>
                  <Kbd>↑</Kbd>
                </div>
              </div>
              <div className="flex items-center gap-x-2">
                <Text size="xsmall" leading="compact">
                  Open Result
                </Text>
                <Kbd>↵</Kbd>
              </div>
            </div>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  )
}

const CommandInput = forwardRef<
  ElementRef<typeof Command.Input>,
  ComponentPropsWithoutRef<typeof Command.Input>
>(({ className, ...props }, ref) => (
  <div className="flex items-center border-b px-3" cmdk-input-wrapper="">
    <MagnifyingGlass className="mr-2 h-4 w-4 shrink-0 opacity-50" />
    <Command.Input
      ref={ref}
      className={clx(
        "placeholder:text-ui-fg-muted flex h-10 w-full rounded-md bg-transparent py-3 text-sm outline-none disabled:cursor-not-allowed disabled:opacity-50",
        className
      )}
      {...props}
    />
  </div>
))

CommandInput.displayName = Command.Input.displayName

const CommandList = forwardRef<
  ElementRef<typeof Command.List>,
  ComponentPropsWithoutRef<typeof Command.List>
>(({ className, ...props }, ref) => (
  <Command.List
    ref={ref}
    className={clx(
      "max-h-[300px] overflow-y-auto overflow-x-hidden pb-4",
      className
    )}
    {...props}
  />
))

CommandList.displayName = Command.List.displayName

const CommandEmpty = forwardRef<
  ElementRef<typeof Command.Empty>,
  ComponentPropsWithoutRef<typeof Command.Empty>
>((props, ref) => (
  <Command.Empty ref={ref} className="py-6 text-center text-sm" {...props} />
))

CommandEmpty.displayName = Command.Empty.displayName

const CommandGroup = forwardRef<
  ElementRef<typeof Command.Group>,
  ComponentPropsWithoutRef<typeof Command.Group>
>(({ className, ...props }, ref) => (
  <Command.Group
    ref={ref}
    className={clx(
      "text-ui-fg-base [&_[cmdk-group-heading]]:text-ui-fg-muted [&_[cmdk-group-heading]]:txt-compact-xsmall-plus overflow-hidden px-1 [&_[cmdk-group-heading]]:px-2 [&_[cmdk-group-heading]]:pb-1 [&_[cmdk-group-heading]]:pt-4 [&_[cmdk-item]]:py-2",
      className
    )}
    {...props}
  />
))

CommandGroup.displayName = Command.Group.displayName

const CommandSeparator = forwardRef<
  ElementRef<typeof Command.Separator>,
  ComponentPropsWithoutRef<typeof Command.Separator>
>(({ className, ...props }, ref) => (
  <Command.Separator
    ref={ref}
    className={clx("bg-border -mx-1 h-px", className)}
    {...props}
  />
))
CommandSeparator.displayName = Command.Separator.displayName

const CommandItem = forwardRef<
  ElementRef<typeof Command.Item>,
  ComponentPropsWithoutRef<typeof Command.Item>
>(({ className, ...props }, ref) => (
  <Command.Item
    ref={ref}
    className={clx(
      "aria-selected:bg-ui-bg-base-hover hover:bg-ui-bg-base-hover focus-visible:bg-ui-bg-base-hover txt-compact-small relative flex cursor-default select-none items-center rounded-md p-2 outline-none data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
      className
    )}
    {...props}
  />
))

CommandItem.displayName = Command.Item.displayName

const CommandShortcut = ({
  className,
  ...props
}: HTMLAttributes<HTMLSpanElement>) => {
  return (
    <span
      className={clx(
        "text-muted-foreground ml-auto text-xs tracking-widest",
        className
      )}
      {...props}
    />
  )
}
CommandShortcut.displayName = "CommandShortcut"

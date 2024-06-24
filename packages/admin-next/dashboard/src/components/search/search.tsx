import { Badge, Kbd, Text, clx } from "@medusajs/ui"
import * as Dialog from "@radix-ui/react-dialog"
import { Command } from "cmdk"
import {
  ComponentPropsWithoutRef,
  ElementRef,
  forwardRef,
  useEffect,
  useMemo,
} from "react"

import { useTranslation } from "react-i18next"
import { useLocation } from "react-router-dom"
import { Shortcut, ShortcutType } from "../../providers/keybind-provider"
import { useGlobalShortcuts } from "../../providers/keybind-provider/hooks"
import { useSearch } from "../../providers/search-provider"

export const Search = () => {
  const { open, onOpenChange } = useSearch()
  const globalCommands = useGlobalShortcuts()
  const location = useLocation()
  const { t } = useTranslation()

  useEffect(() => {
    onOpenChange(false)
  }, [location.pathname, onOpenChange])

  const links = useMemo(() => {
    const groups = new Map<ShortcutType, Shortcut[]>()

    globalCommands.forEach((command) => {
      const group = groups.get(command.type) || []
      group.push(command)
      groups.set(command.type, group)
    })

    return Array.from(groups).map(([title, items]) => ({
      title,
      items,
    }))
  }, [globalCommands])

  const handleSelect = (callback: () => void) => {
    callback()
    onOpenChange(false)
  }

  return (
    <CommandDialog open={open} onOpenChange={onOpenChange}>
      <CommandInput placeholder={t("app.search.placeholder")} />
      <CommandList>
        <CommandEmpty>{t("general.noResultsTitle")}</CommandEmpty>
        {links.map((group) => {
          return (
            <CommandGroup
              key={group.title}
              heading={t(`app.keyboardShortcuts.${group.title}`)}
            >
              {group.items.map((item) => {
                return (
                  <CommandItem
                    key={item.label}
                    onSelect={() => handleSelect(item.callback)}
                    className="flex items-center justify-between"
                  >
                    <span>{item.label}</span>
                    <div className="flex items-center gap-x-1.5">
                      {item.keys.Mac?.map((key, index) => {
                        return <Kbd key={index}>{key}</Kbd>
                      })}
                    </div>
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
CommandPalette.displayName = Command.displayName

interface CommandDialogProps extends Dialog.DialogProps {}

const CommandDialog = ({ children, ...props }: CommandDialogProps) => {
  const { t } = useTranslation()

  return (
    <Dialog.Root {...props}>
      <Dialog.Portal>
        <Dialog.Overlay className="bg-ui-bg-overlay fixed inset-0" />
        <Dialog.Content className="bg-ui-bg-base shadow-elevation-modal fixed left-[50%] top-[50%] w-full max-w-2xl translate-x-[-50%] translate-y-[-50%] overflow-hidden rounded-xl p-0">
          <CommandPalette className="[&_[cmdk-group-heading]]:text-muted-foreground [&_[cmdk-group-heading]]:px-2 [&_[cmdk-group-heading]]:font-medium [&_[cmdk-group]:not([hidden])_~[cmdk-group]]:pt-0 [&_[cmdk-input]]:h-[52px]">
            {children}
          </CommandPalette>
          <div className="bg-ui-bg-field text-ui-fg-subtle flex items-center justify-end border-t px-4 py-3">
            <div className="flex items-center gap-x-3">
              <div className="flex items-center gap-x-2">
                <Text size="xsmall" leading="compact">
                  {t("app.search.navigation")}
                </Text>
                <div className="flex items-center gap-x-1">
                  <Kbd className="bg-ui-bg-field-component">↓</Kbd>
                  <Kbd className="bg-ui-bg-field-component">↑</Kbd>
                </div>
              </div>
              <div className="bg-ui-border-strong h-3 w-px" />
              <div className="flex items-center gap-x-2">
                <Text size="xsmall" leading="compact">
                  {t("app.search.openResult")}
                </Text>
                <Kbd className="bg-ui-bg-field-component">↵</Kbd>
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
>(({ className, ...props }, ref) => {
  const { t } = useTranslation()

  return (
    <div className="flex flex-col border-b">
      <div className="px-4 pt-4">
        {/* TODO: Add filter once we have search engine */}
        <Badge size="2xsmall">{t("app.search.allAreas")}</Badge>
      </div>
      <Command.Input
        ref={ref}
        className={clx(
          "placeholder:text-ui-fg-muted flex h-10 w-full rounded-md bg-transparent p-4 text-sm outline-none disabled:cursor-not-allowed disabled:opacity-50",
          className
        )}
        {...props}
      />
    </div>
  )
})

CommandInput.displayName = Command.Input.displayName

const CommandList = forwardRef<
  ElementRef<typeof Command.List>,
  ComponentPropsWithoutRef<typeof Command.List>
>(({ className, ...props }, ref) => (
  <Command.List
    ref={ref}
    className={clx(
      "max-h-[300px] overflow-y-auto overflow-x-hidden px-2 pb-4",
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
      "text-ui-fg-base [&_[cmdk-group-heading]]:text-ui-fg-muted [&_[cmdk-group-heading]]:txt-compact-xsmall-plus overflow-hidden [&_[cmdk-group-heading]]:px-2 [&_[cmdk-group-heading]]:pb-1 [&_[cmdk-group-heading]]:pt-4 [&_[cmdk-item]]:py-2",
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
      "aria-selected:bg-ui-bg-base-hover focus-visible:bg-ui-bg-base-hover txt-compact-small [&>svg]:text-ui-fg-subtle relative flex cursor-pointer select-none items-center gap-x-3 rounded-md p-2 outline-none data-[disabled]:pointer-events-none data-[disabled]:cursor-not-allowed data-[disabled]:opacity-50",
      className
    )}
    {...props}
  />
))

CommandItem.displayName = Command.Item.displayName

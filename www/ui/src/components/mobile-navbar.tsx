"use client"

import { Sidebar, XMark } from "@medusajs/icons"
import { Badge, Button, clx } from "@medusajs/ui"
import * as Dialog from "@radix-ui/react-dialog"
import Link, { LinkProps } from "next/link"
import { usePathname, useRouter } from "next/navigation"
import * as React from "react"

import { docsConfig } from "@/config/docs"
import { useMatchMedia } from "../hooks/use-match-media"
import { ScrollArea } from "./scroll-area"

const MobileNavbar = () => {
  const [open, setOpen] = React.useState(false)
  const pathname = usePathname()

  const isMobileView = useMatchMedia("(max-width: 1024px)")

  React.useEffect(() => {
    if (!isMobileView) {
      setOpen(false)
    }
  }, [isMobileView, open])

  return (
    <Dialog.Root open={open} onOpenChange={setOpen}>
      <Dialog.Trigger asChild>
        <Button
          variant={isMobileView ? "transparent" : "secondary"}
          format={"icon"}
        >
          {open ? <XMark /> : <Sidebar />}
        </Button>
      </Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay className="absolute inset-0" />
        <Dialog.Content
          className={clx(
            "shadow-elevation-modal bg-ui-bg-base fixed inset-x-0 bottom-0 top-[56px] w-full flex-1 border-r",
            "data-[state=open]:animate-in data-[state=closed]:animate-out transition ease-in-out data-[state=closed]:duration-300 data-[state=open]:duration-500",
            "data-[state=closed]:slide-out-to-left data-[state=open]:slide-in-from-left",
            "z-20"
          )}
        >
          <ScrollArea>
            <div className="flex h-full w-full flex-col p-6">
              <ul className="mb-4">
                {docsConfig.mainNav.map((item, index) => {
                  return (
                    <li key={index}>
                      {item.href && !item.disabled ? (
                        <Link
                          href={item.href}
                          className={clx(
                            "bg-ui-bg-base text-ui-fg-muted txt-compact-small-plus group flex w-full items-center justify-between rounded-md border border-transparent px-3 py-1.5 transition-all",
                            "hover:bg-ui-bg-base-hover text-ui-fg-subtle",
                            item.disabled &&
                              "bg-ui-bg-base-disabled text-ui-fg-disabled cursor-not-allowed",
                            {
                              "text-ui-fg-base": item.href === "/",
                            }
                          )}
                          rel={item.external ? "noreferrer" : ""}
                        >
                          {item.title}
                        </Link>
                      ) : (
                        <span
                          className={clx(
                            "text-ui-fg-muted txt-compact-small-plus mb-0.5 rounded-md px-3 py-1.5 transition-all",
                            "hover:text-ui-fg-base",
                            item.disabled &&
                              "bg-ui-bg-base-disabled text-ui-fg-disabled cursor-not-allowed"
                          )}
                        >
                          {item.title}
                        </span>
                      )}
                    </li>
                  )
                })}
              </ul>

              <div className="txt-compact-small-plus grid grid-flow-row auto-rows-max gap-0.5">
                {docsConfig.sidebarNav.map((item, index) => {
                  return (
                    <div key={index} className={clx("pb-6")}>
                      <h4 className="text-ui-fg-muted mb-0.5 rounded-md px-3 py-1.5 text-xs font-medium uppercase leading-5">
                        {item.title}
                      </h4>
                      <ul className="grid grid-flow-row auto-rows-max gap-0.5">
                        {item.items.map((nested, index) => {
                          return (
                            <li key={index}>
                              {nested.href && !nested.disabled ? (
                                <MobileLink
                                  href={nested.href}
                                  onOpenChange={setOpen}
                                  className={clx(
                                    "bg-ui-bg-base group flex w-full items-center justify-between rounded-md border border-transparent px-3 py-1.5 transition-all",
                                    "hover:bg-ui-bg-base-hover text-ui-fg-subtle",
                                    nested.disabled &&
                                      "bg-ui-bg-base-disabled text-ui-fg-disabled cursor-not-allowed",
                                    {
                                      "bg-ui-bg-base-pressed text-ui-fg-base border-ui-border-base":
                                        pathname === nested.href,
                                    }
                                  )}
                                >
                                  {nested.title}
                                  {nested.label && (
                                    <Badge size="small">{nested.label}</Badge>
                                  )}
                                </MobileLink>
                              ) : (
                                <span
                                  className={clx(
                                    "text-ui-fg-muted flex w-full items-center justify-between rounded-md px-3 py-1.5",
                                    nested.disabled && "text-ui-fg-disabled"
                                  )}
                                >
                                  {nested.title}
                                  {nested.label && (
                                    <Badge size="small">{nested.label}</Badge>
                                  )}
                                </span>
                              )}
                            </li>
                          )
                        })}
                      </ul>
                    </div>
                  )
                })}
              </div>
            </div>
          </ScrollArea>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  )
}

interface MobileLinkProps extends LinkProps {
  onOpenChange?: (open: boolean) => void
  children: React.ReactNode
  className?: string
}

const MobileLink = ({
  href,
  onOpenChange,
  children,
  className,
  ...props
}: MobileLinkProps) => {
  const router = useRouter()

  return (
    <Link
      href={href}
      className={className}
      onClick={() => {
        router.push(href.toString())
        onOpenChange?.(false)
      }}
      {...props}
    >
      {children}
    </Link>
  )
}

export { MobileNavbar }

"use client"

import { docsConfig } from "@/config/docs"
import { Navbar as UiNavbar } from "docs-ui"
import { useState } from "react"

const Navbar = () => {
  const [open, setOpen] = useState(false)

  return (
    <UiNavbar
      logo={{
        light: "/images/logo-icon.png",
        dark: "/images/logo-icon-dark.png",
      }}
      items={docsConfig.mainNav}
      mobileMenuButton={{
        setMobileSidebarOpen: setOpen,
        mobileSidebarOpen: open,
      }}
    />
  )
  // return (
  //   <div className="border-ui-border-base bg-ui-bg-base h-navbar sticky top-0 z-50 w-full border-b">
  //     <div className="container flex h-full items-center justify-between px-4 py-3 md:px-8">
  //       <div className="block lg:hidden">
  //         <MobileNavbar />
  //       </div>
  //       <div className="flex items-center gap-x-6">
  //         <Link href="https://docs.medusajs.com" rel="noreferrer">
  //           <Logo className="text-ui-fg-base" />
  //         </Link>
  //         <div className="hidden lg:block">
  //           <div className="auto-col-max text-compact-small-plus grid grid-flow-col gap-6">
  //             {docsConfig.mainNav.map((item, index) => {
  //               return item.href && !item.disabled ? (
  //                 <Link
  //                   key={index}
  //                   href={item.href}
  //                   className={clx(
  //                     "text-ui-fg-subtle transition-all",
  //                     "hover:text-ui-fg-base",
  //                     item.disabled &&
  //                       "bg-ui-bg-base-disabled text-ui-fg-disabled cursor-not-allowed",
  //                     {
  //                       "text-ui-fg-base": !item.external,
  //                     }
  //                   )}
  //                   rel={item.external ? "noreferrer" : ""}
  //                 >
  //                   {item.title}
  //                 </Link>
  //               ) : (
  //                 <span
  //                   key={index}
  //                   className={clx(
  //                     "text-ui-fg-subtle transition-all",
  //                     "hover:text-ui-fg-base",
  //                     item.disabled &&
  //                       "bg-ui-bg-base-disabled text-ui-fg-disabled cursor-not-allowed"
  //                   )}
  //                 >
  //                   {item.title}
  //                 </span>
  //               )
  //             })}
  //           </div>
  //         </div>
  //       </div>
  //       <div className="flex items-center gap-x-2">
  //         <ModeToggle />
  //       </div>
  //     </div>
  //   </div>
  // )
}

export { Navbar }

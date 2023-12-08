import React from "react"
import clsx from "clsx"
import type { Props } from "@theme/Navbar/Search"

export default function NavbarSearch({
  children,
  className,
}: Props): JSX.Element {
  return <div className={clsx("flex", className)}>{children}</div>
}

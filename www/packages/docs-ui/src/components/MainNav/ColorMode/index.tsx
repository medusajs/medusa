"use client"

import React from "react"
import { useColorMode } from "../../../providers"
import { Button } from "../../.."
import { Moon, Sun } from "@medusajs/icons"
import clsx from "clsx"

export const MainNavColorMode = () => {
  const { colorMode } = useColorMode()

  return (
    <Button
      variant="transparent-clear"
      className={clsx("!p-[6.5px] text-medusa-fg-muted")}
    >
      {colorMode === "light" && <Sun />}
      {colorMode === "dark" && <Moon />}
    </Button>
  )
}

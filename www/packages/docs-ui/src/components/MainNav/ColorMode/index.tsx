"use client"

import React from "react"
import { useColorMode } from "../../../providers"
import { Button, Tooltip } from "../../.."
import { Moon, Sun } from "@medusajs/icons"
import clsx from "clsx"

export const MainNavColorMode = () => {
  const { colorMode, toggleColorMode } = useColorMode()

  return (
    <Tooltip place="bottom" tooltipChildren="Change Theme">
      <Button
        variant="transparent-clear"
        className={clsx("!p-[6.5px] text-medusa-fg-muted")}
        onClick={toggleColorMode}
      >
        {colorMode === "light" && <Sun />}
        {colorMode === "dark" && <Moon />}
      </Button>
    </Tooltip>
  )
}

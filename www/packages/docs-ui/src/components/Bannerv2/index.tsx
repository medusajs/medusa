"use client"

import React, { useEffect, useState } from "react"
import { Button, useIsBrowser } from "../.."
import { ExclamationCircleSolid, XMark } from "@medusajs/icons"
import clsx from "clsx"

const LOCAL_STORAGE_KEY = "banner-v2"

export type Bannerv2Props = {
  className?: string
}

export const Bannerv2 = ({ className }: Bannerv2Props) => {
  const [show, setShow] = useState(false)
  const { isBrowser } = useIsBrowser()

  useEffect(() => {
    if (!isBrowser) {
      return
    }

    const localStorageValue = localStorage.getItem(LOCAL_STORAGE_KEY)
    if (!localStorageValue) {
      setShow(true)
    }
  }, [isBrowser])

  const handleClose = () => {
    setShow(false)
    localStorage.setItem(LOCAL_STORAGE_KEY, "true")
  }

  return (
    <div
      className={clsx(
        "bg-medusa-bg-base hidden gap-docs_0.5 z-20",
        "justify-between items-start rounded-docs_DEFAULT",
        "p-docs_0.75 shadow-elevation-card-rest dark:shadow-elevation-card-rest-dark",
        show && "lg:flex",
        className
      )}
    >
      <span className="p-[2.5px]">
        <ExclamationCircleSolid className="text-medusa-tag-orange-icon" />
      </span>
      <div className="flex flex-col gap-docs_0.125 flex-1">
        <span className="text-compact-small-plus text-medusa-fg-base">
          Medusa v2 and Docs under development
        </span>
        <span className="text-compact-small text-medusa-fg-subtle">
          We are actively working on building and improving. Some sections may
          be incomplete or subject to change. Thank you for your patience.
        </span>
      </div>
      <Button
        variant="transparent-clear"
        className="text-medusa-fg-muted"
        onClick={handleClose}
      >
        <XMark />
      </Button>
    </div>
  )
}

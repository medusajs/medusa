import React from "react"
import { NavLink } from "react-router-dom"
import { useTranslation } from "react-i18next"

import { clx } from "@medusajs/ui"

const links = [
  { to: "/inventory", label: "inventory.list" },
  { to: "/inventory/locations", label: "locations.domain" },
  { to: "/inventory/transfers", label: "transfers.domain" },
  { to: "/inventory/suppliers", label: "suppliers.domain" },
  { to: "/inventory/purchase-orders", label: "purchaseOrders.domain" },
]

function getClassName({ isActive, isPending }) {
  return clx("cursor-pointer px-3 py-1 rounded-2xl font-medium", {
    disabled: isPending,
    "bg-white text-ui-fg-base bg-ui-bg-base shadow-elevation-card-rest":
      isActive,
  })
}

export function InventoryTabs() {
  const { t } = useTranslation()

  return (
    <div className="txt-small text-ui-fg-subtle hidden items-center gap-6 py-3 lg:flex">
      {links.map((link) => (
        <NavLink key={link.to} to={link.to} className={getClassName} end>
          {t(link.label)}
        </NavLink>
      ))}
    </div>
  )
}

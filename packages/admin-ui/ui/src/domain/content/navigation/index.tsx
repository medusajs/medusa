import React, { FC } from "react"
import { NavigationItem } from "@medusajs/medusa"
import { useGetNavigationItems } from "../../../hooks/admin/navigation"
import NavigationForm from "./components/navigation-form"

export interface NavigationFormValues {
  header: NavigationItem[]
  footer: NavigationItem[]
}

const NavigationIndex: FC<{}> = () => {
  const { navigation_items: navItems, isLoading } = useGetNavigationItems()

  if (!navItems && isLoading) {
    return null
  }

  return (
    <div className="pb-10">
      <NavigationForm navItems={navItems} />
    </div>
  )
}

export default NavigationIndex

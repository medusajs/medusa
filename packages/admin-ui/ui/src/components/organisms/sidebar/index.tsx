import { useAdminStore } from "medusa-react"
import React, { useState } from "react"

import { useFeatureFlag } from "../../../providers/feature-flag-provider"
import BuildingsIcon from "../../fundamentals/icons/buildings-icon"
import CartIcon from "../../fundamentals/icons/cart-icon"
import CashIcon from "../../fundamentals/icons/cash-icon"
import GearIcon from "../../fundamentals/icons/gear-icon"
import GiftIcon from "../../fundamentals/icons/gift-icon"
import SaleIcon from "../../fundamentals/icons/sale-icon"
import TagIcon from "../../fundamentals/icons/tag-icon"
import SwatchIcon from "../../fundamentals/icons/swatch-icon"
import UsersIcon from "../../fundamentals/icons/users-icon"
import SidebarMenuItem from "../../molecules/sidebar-menu-item"
import UserMenu from "../../molecules/user-menu"

const ICON_SIZE = 20

const Sidebar: React.FC = () => {
  const [currentlyOpen, setCurrentlyOpen] = useState(-1)

  const { isFeatureEnabled } = useFeatureFlag()
  const { store } = useAdminStore()

  const triggerHandler = () => {
    const id = triggerHandler.id++
    return {
      open: currentlyOpen === id,
      handleTriggerClick: () => setCurrentlyOpen(id),
    }
  }
  // We store the `id` counter on the function object, as a state creates
  // infinite updates, and we do not want the variable to be free floating.
  triggerHandler.id = 0

  const inventoryEnabled =
    isFeatureEnabled("inventoryService") &&
    isFeatureEnabled("stockLocationService")

  return (
    <div className="min-w-sidebar max-w-sidebar bg-gray-0 border-grey-20 py-base px-base h-screen overflow-y-auto border-r">
      <div className="h-full">
        <div className="flex justify-between px-2">
          <div className="rounded-circle flex h-8 w-8 items-center justify-center border border-solid border-gray-300">
            <UserMenu />
          </div>
        </div>
        <div className="my-base flex flex-col px-2">
          <span className="text-grey-50 text-small font-medium">Store</span>
          <span className="text-grey-90 text-medium font-medium">
            {store?.name}
          </span>
        </div>
        <div className="py-3.5">
          <SidebarMenuItem
            pageLink={"/a/orders"}
            icon={<CartIcon size={ICON_SIZE} />}
            triggerHandler={triggerHandler}
            text={"Orders"}
          />
          <SidebarMenuItem
            pageLink={"/a/products"}
            icon={<TagIcon size={ICON_SIZE} />}
            text={"Products"}
            triggerHandler={triggerHandler}
          />
          {isFeatureEnabled("product_categories") && (
            <SidebarMenuItem
              pageLink={"/a/product-categories"}
              icon={<SwatchIcon size={ICON_SIZE} />}
              text={"Categories"}
              triggerHandler={triggerHandler}
              isNew
            />
          )}
          <SidebarMenuItem
            pageLink={"/a/customers"}
            icon={<UsersIcon size={ICON_SIZE} />}
            triggerHandler={triggerHandler}
            text={"Customers"}
          />
          {inventoryEnabled && (
            <SidebarMenuItem
              pageLink={"/a/inventory"}
              icon={<BuildingsIcon size={ICON_SIZE} />}
              triggerHandler={triggerHandler}
              text={"Inventory"}
              isNew
            />
          )}
          <SidebarMenuItem
            pageLink={"/a/discounts"}
            icon={<SaleIcon size={ICON_SIZE} />}
            triggerHandler={triggerHandler}
            text={"Discounts"}
          />
          <SidebarMenuItem
            pageLink={"/a/gift-cards"}
            icon={<GiftIcon size={ICON_SIZE} />}
            triggerHandler={triggerHandler}
            text={"Gift Cards"}
          />
          <SidebarMenuItem
            pageLink={"/a/pricing"}
            icon={<CashIcon size={ICON_SIZE} />}
            triggerHandler={triggerHandler}
            text={"Pricing"}
          />
          <SidebarMenuItem
            pageLink={"/a/settings"}
            icon={<GearIcon size={ICON_SIZE} />}
            triggerHandler={triggerHandler}
            text={"Settings"}
          />
        </div>
      </div>
    </div>
  )
}

export default Sidebar

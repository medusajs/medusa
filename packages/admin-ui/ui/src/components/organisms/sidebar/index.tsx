import React, { useEffect, useState } from "react"
import { useSelectedVendor } from "../../../context/vendor"
import { useBasePath } from "../../../utils/routePathing"
import CustomerIcon from "../../fundamentals/icons/customer-icon"
import DollarSignIcon from "../../fundamentals/icons/dollar-sign-icon"
import GearIcon from "../../fundamentals/icons/gear-icon"
// import GiftIcon from "../../fundamentals/icons/gift-icon"
// import PackageIcon from "../../fundamentals/icons/package-icon"
// import PublishIcon from "../../fundamentals/icons/publish-icon"
import TagIcon from "../../fundamentals/icons/tag-icon"
// import TileIcon from "../../fundamentals/icons/tile-icon"
// import UsersIcon from "../../fundamentals/icons/users-icon"
// import Select from "../../molecules/select"
// import SidebarCompanyLogo from "../../molecules/sidebar-company-logo"
import SidebarMenuItem from "../../molecules/sidebar-menu-item"
import ListIcon from "../../fundamentals/icons/list-icon"
import DocumentTextIcon from "../../fundamentals/icons/document-text-icon"
import NewspaperIcon from "../../fundamentals/icons/newspaper-icon"
import BuildingStorefrontIcon from "../../fundamentals/icons/building-storefront-icon"
import { VendorSelector } from "./vendor-selector"
import SaleIcon from "../../fundamentals/icons/sale-icon"
import HomeIcon from "../../fundamentals/icons/home-icon"
import MailIcon from "../../fundamentals/icons/mail-icon"
import { useUserPermissions } from "../../../hooks/use-permissions"
import Badge from "../../fundamentals/badge"

import "./sidebar.css"
import { useGetVendors } from "../../../hooks/admin/vendors"
import BackButton from "../../atoms/back-button"
import { useLocation } from "react-router-dom"

const ICON_SIZE = 18

interface SideBarProps extends React.HTMLAttributes<HTMLDivElement> {
  toggleSidebar: (isOpen: boolean) => void
}

const Sidebar: React.FC<SideBarProps> = ({
  className,
  toggleSidebar,
  ...props
}) => {
  const { isAdmin } = useUserPermissions()
  const [currentlyOpen, setCurrentlyOpen] = useState(-1)
  const basePath = useBasePath()
  const { vendors } = useGetVendors()
  const { isStoreView, isVendorView, isPrimary } = useSelectedVendor()
  const location = useLocation()

  useEffect(() => {
    if (location.pathname) {
      toggleSidebar(false)
    }
  }, [location])

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

  if (!vendors) return null

  const vendorPathForSingleVendor =
    vendors.length > 1 ? basePath : `/vendor/${vendors[0].id}`
  const adminPathForSingleVendor = vendors.length > 1 ? basePath : `/admin`

  return (
    <div className={className} {...props}>
      <VendorSelector vendors={vendors} />

      <div className="min-w-sidebar max-w-sidebar h-screen overflow-y-auto bg-gray-0 border-r border-grey-20 py-base px-base pt-0">
        {isAdmin && !isStoreView && vendors.length > 1 && (
          <BackButton
            className="block mt-2 -mb-3 -ml-3"
            path="/admin"
            label="Admin Home"
          />
        )}

        <div className="font-semibold mt-5 flex flex-col text-small">
          <h4 className="mb-2 inline-flex justify-start gap-1.5">
            Store
            {isPrimary && vendors.length > 1 && (
              <span>
                <Badge
                  variant="primary"
                  size="small"
                  className="text-xs text-[10px] rounded-full top-0 px-2 py-0.5"
                >
                  primary
                </Badge>
              </span>
            )}
          </h4>

          <SidebarMenuItem
            pageLink={basePath}
            icon={<HomeIcon size={ICON_SIZE} />}
            triggerHandler={triggerHandler}
            text="Home"
            end={true}
          />
          <SidebarMenuItem
            pageLink={`${vendorPathForSingleVendor}/orders`}
            icon={<DollarSignIcon size={ICON_SIZE} />}
            triggerHandler={triggerHandler}
            text="Orders"
          />
          <SidebarMenuItem
            pageLink={`${vendorPathForSingleVendor}/products`}
            icon={<TagIcon size={ICON_SIZE} />}
            text="Products"
            triggerHandler={triggerHandler}
          />
          <SidebarMenuItem
            pageLink={`${vendorPathForSingleVendor}/customers`}
            icon={<CustomerIcon size={ICON_SIZE} />}
            triggerHandler={triggerHandler}
            text="Customers"
          />

          {(isStoreView || isPrimary) && (
            // Note: discounts are currently only an admin route
            <SidebarMenuItem
              pageLink={`/admin/discounts`}
              icon={<SaleIcon size={ICON_SIZE} />}
              text="Discounts"
              triggerHandler={triggerHandler}
            />
          )}
        </div>

        {(isStoreView || isPrimary) && (
          <>
            <div className="font-semibold mt-5 flex flex-col text-small">
              <h4 className="mb-2">Content</h4>

              <SidebarMenuItem
                pageLink={`/admin/content/pages`}
                icon={<DocumentTextIcon size={ICON_SIZE} />}
                triggerHandler={triggerHandler}
                text="Pages"
              />
              <SidebarMenuItem
                pageLink={`/admin/content/posts`}
                icon={<NewspaperIcon size={ICON_SIZE} />}
                triggerHandler={triggerHandler}
                text="Posts"
              />
              <SidebarMenuItem
                pageLink={`/admin/content/navigation`}
                icon={<ListIcon size={ICON_SIZE} />}
                triggerHandler={triggerHandler}
                text="Navigation"
              />

              {process.env.NODE_ENV === "development" && (
                <SidebarMenuItem
                  pageLink={`/admin/email/preview`}
                  icon={<MailIcon size={ICON_SIZE} />}
                  triggerHandler={triggerHandler}
                  text="Email"
                />
              )}
            </div>
          </>
        )}

        {/* Vendor Admin Settings */}
        {isAdmin && !isPrimary && isVendorView && (
          <div className="font-semibold mt-5 flex flex-col text-small">
            <h4 className="mb-2">Settings</h4>
            <SidebarMenuItem
              pageLink={`${basePath}/settings`}
              icon={<GearIcon size={ICON_SIZE} />}
              triggerHandler={triggerHandler}
              text={"Vendor Settings"}
            />
          </div>
        )}

        {/* Primary Admin Settings */}
        {isAdmin && (isStoreView || isPrimary) && (
          <div className="font-semibold mt-5 flex flex-col text-small">
            <h4 className="mb-2">Settings</h4>

            <SidebarMenuItem
              pageLink={`/admin/vendors`}
              icon={<BuildingStorefrontIcon size={ICON_SIZE} />}
              triggerHandler={triggerHandler}
              text={"Vendors"}
            />

            <SidebarMenuItem
              pageLink={`${adminPathForSingleVendor}/users`}
              icon={<CustomerIcon size={ICON_SIZE} />}
              triggerHandler={triggerHandler}
              text={"Users"}
            />

            {/* <SidebarMenuItem
                pageLink={`/admin/taxes`}
                icon={<PublishIcon size={ICON_SIZE} />}
                triggerHandler={triggerHandler}
                text={"Taxes"}
              />
              <SidebarMenuItem

                pageLink={`/admin/gift-cards`}
                icon={<GiftIcon size={ICON_SIZE} />}
                triggerHandler={triggerHandler}
                text={"Gift Cards"}
              />
              <SidebarMenuItem

                pageLink={`/admin/discounts`}
                icon={<SaleIcon size={ICON_SIZE} />}
                triggerHandler={triggerHandler}
                text={"Global Promotions"}
              /> */}

            {(isVendorView || vendors.length === 1) && (
              <SidebarMenuItem
                pageLink={`${vendorPathForSingleVendor}/settings`}
                icon={<GearIcon size={ICON_SIZE} />}
                triggerHandler={triggerHandler}
                text={`${
                  isVendorView || vendors.length === 1 ? "Vendor" : "Store"
                } Settings`}
              />
            )}

            {(isStoreView || isPrimary) && (
              <SidebarMenuItem
                pageLink={`/admin/settings`}
                icon={<GearIcon size={ICON_SIZE} />}
                triggerHandler={triggerHandler}
                text={`Store Settings`}
              />
            )}
          </div>
        )}
      </div>
    </div>
  )
}

export default Sidebar

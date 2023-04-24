import React, { FC, useState } from "react"
import { useAdminStore } from "medusa-react"
import clsx from "clsx"
import { useSelectedVendor } from "../../../context/vendor"
import { useUserPermissions } from "../../../hooks/use-permissions"
import { useSwapVendors } from "../../../utils/routePathing"
import { NextSelect as Select } from "../../../components/molecules/select/next-select"
import SidebarCompanyLogo from "../../molecules/sidebar-company-logo"
import Menu, {
  Option,
} from "../../molecules/select/next-select/components/menu"
import Input from "../../molecules/select/next-select/components/input"
import {
  SelectContainer,
  ValueContainer,
} from "../../molecules/select/next-select/components/containers"
import Control from "../../molecules/select/next-select/components/control"
import Badge from "../../fundamentals/badge"
import { Link, useNavigate } from "react-router-dom"
import { Vendor } from "@medusajs/medusa"

export const VendorSelector: FC<{ vendors: Vendor[] }> = ({ vendors }) => {
  const navigate = useNavigate()
  const swapVendors = useSwapVendors()
  const { isStoreView, isVendorView, selectedVendor } = useSelectedVendor()
  const { store } = useAdminStore()
  const { isAdmin } = useUserPermissions()
  const [isVendorLogoVisible, setIsVendorLogoVisible] = useState(true)

  const handleVendorChange = async (vendorId: string | null) => {
    if (isStoreView && !vendorId) return
    const newPath = swapVendors(vendorId)
    navigate(newPath)
  }

  const vendorSelections = vendors
    ? vendors
        .map((vendor) => ({
          value: vendor.id,
          label: vendor.name,
        }))
        .sort((a, b) => {
          if (store && store.primary_vendor_id === a.value) return -1

          return a.label.localeCompare(b.label)
        })
    : []

  if (vendors?.length === 1) {
    return (
      <div className="vendor-selector border-b border-r border-gray-200">
        <div className="h-[55px]">
          <Link to="/admin" className="block w-full h-full">
            <SidebarCompanyLogo
              vendorLogoURL={selectedVendor?.logo?.url}
              vendorName={selectedVendor?.name ?? "All Vendors"}
            />
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div
      className={clsx("vendor-selector", {
        admin: isAdmin,
      })}
    >
      {isVendorLogoVisible && (
        <SidebarCompanyLogo
          vendorLogoURL={isVendorView ? selectedVendor?.logo?.url : undefined}
          vendorName={isVendorView ? selectedVendor?.name : "All Vendors"}
        />
      )}

      <Select
        placeholder=""
        label=""
        className="h-14"
        value={{
          label: isStoreView ? "All Vendors" : selectedVendor?.name,
          value: isVendorView && selectedVendor ? selectedVendor?.id : "",
        }}
        isMulti={false}
        onChange={(selection) => handleVendorChange(selection?.value || null)}
        options={[
          ...(isAdmin ? [{ label: "All Vendors", value: "" }] : []),
          ...vendorSelections,
        ]}
        onFocus={() => setIsVendorLogoVisible(false)}
        onBlur={() => setIsVendorLogoVisible(true)}
        menuPlacement="auto"
        menuPosition="fixed"
        maxMenuHeight={240}
        components={{
          SelectContainer: (selectContainerProps) => (
            <SelectContainer
              {...selectContainerProps}
              className="cursor-default h-14"
            />
          ),
          Control: (controlProps) => (
            <Control
              {...controlProps}
              className="cursor-pointer !h-full !rounded-none !shadow-none !border-grey-20 !border-t-0 !border-l-0"
            />
          ),
          ValueContainer: (valueProps) => (
            <ValueContainer
              {...valueProps}
              className={clsx("max-w-[187px]", {
                "opacity-0": isVendorLogoVisible,
                "opacity-100": !isVendorLogoVisible,
              })}
            />
          ),
          Input: (inputProps) => (
            <Input
              {...inputProps}
              className={clsx("-ml-0.5", {
                "opacity-0": isVendorLogoVisible,
                "opacity-100": !isVendorLogoVisible,
              })}
            />
          ),
          MenuPortal: (menuPortalProps) => (
            <div
              {...menuPortalProps}
              className="z-50 fixed min-w-[240px] w-auto"
            />
          ),
          Menu: (menuProps) => (
            <Menu {...menuProps} className="!relative -mt-[1px] rounded-none" />
          ),
          Option: ({ children: optionChildren, ...optionProps }) => (
            <Option
              {...optionProps}
              className={clsx(
                "vendor-selector__option h-auto inter-base-regular leading-1 whitespace-nowrap",
                {
                  "vendor-selector__option--is-primary":
                    optionProps.data.value === store?.primary_vendor_id,
                }
              )}
              checkIconClassName="text-violet-50"
            >
              <span>{optionChildren}</span>
              {optionProps.data.value === store?.primary_vendor_id && (
                <Badge
                  variant="primary"
                  size="small"
                  className="text-xs text-[10px] rounded-full top-0 px-2 py-0.5"
                >
                  primary
                </Badge>
              )}
            </Option>
          ),
        }}
      />
    </div>
  )
}

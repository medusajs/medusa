import React from "react"

type SidebarCompanyLogoProps = {
  vendorLogoURL?: string
  vendorName?: string
}

const SidebarCompanyLogo: React.FC<SidebarCompanyLogoProps> = ({
  vendorLogoURL,
  vendorName,
}: SidebarCompanyLogoProps) => {
  return (
    <div
      role="button"
      className="sidebar-company-logo z-10 flex items-center px-2.5 w-full mb-4"
    >
      {vendorLogoURL ? (
        <img
          src={vendorLogoURL}
          alt={`${vendorName} logo`}
          height={32}
          width={32}
        />
      ) : (
        <div className="w-[32px] h-[32px] min-w-[32px] flex items-center justify-center bg-grey-90 text-grey-0">
          <div>{vendorName?.slice(0, 1) || "M"}</div>
        </div>
      )}
      <span className="font-semibold ml-2.5 w-full overflow-hidden whitespace-nowrap text-ellipsis pr-2.5">
        {vendorName}
      </span>
    </div>
  )
}

export default SidebarCompanyLogo

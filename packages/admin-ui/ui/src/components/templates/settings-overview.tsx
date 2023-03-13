import React from "react"
import PageDescription from "../atoms/page-description"

const SettingsOverview: React.FC<React.PropsWithChildren> = ({ children }) => {
  return (
    <div>
      <PageDescription
        title={"Settings"}
        subtitle={"Manage the settings for your Medusa store"}
      />
      <div className="medium:grid-cols-2 gap-x-base gap-y-xsmall grid auto-cols-fr grid-cols-1">
        {children}
      </div>
    </div>
  )
}

export default SettingsOverview

import React, { FC, PropsWithChildren, ReactNode } from "react"
import PageDescription from "../atoms/page-description"

export interface SettingsOverviewProps {
  title: string
  subtitle: ReactNode
}

const SettingsOverview: FC<PropsWithChildren<SettingsOverviewProps>> = ({
  title,
  subtitle,
  children,
}) => (
  <div>
    <PageDescription title={title} subtitle={subtitle} />
    <div className="grid medium:grid-cols-2 auto-cols-fr grid-cols-1 gap-x-base gap-y-xsmall">
      {children}
    </div>
  </div>
)

export default SettingsOverview

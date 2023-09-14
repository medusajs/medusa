import { AnalyticsProvider } from "docs-ui"
import React from "react"

type DocsProvidersProps = {
  children?: React.ReactNode
}

const DocsProviders = ({ children }: DocsProvidersProps) => {
  return (
    <AnalyticsProvider writeKey={process.env.SEGMENT_API_KEY}>
      {children}
    </AnalyticsProvider>
  )
}

export default DocsProviders

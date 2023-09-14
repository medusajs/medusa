"use client"

import { AnalyticsProvider } from "docs-ui"

type ProvidersProps = {
  children?: React.ReactNode
}

const Providers = ({ children }: ProvidersProps) => {
  return (
    <AnalyticsProvider key={process.env.NEXT_PUBLIC_SEGMENT_API_KEY}>
      {children}
    </AnalyticsProvider>
  )
}

export default Providers

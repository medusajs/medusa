"use client"

import React, { createContext, useContext, useState } from "react"
import { DocsConfig } from "types"

export type SiteConfigContextType = {
  config: DocsConfig
  setConfig: React.Dispatch<React.SetStateAction<DocsConfig>>
}

const SiteConfigContext = createContext<SiteConfigContextType | null>(null)

export type SiteConfigProviderProps = {
  config?: DocsConfig
  children?: React.ReactNode
}

export const SiteConfigProvider = ({
  config: initConfig,
  children,
}: SiteConfigProviderProps) => {
  const [config, setConfig] = useState<DocsConfig>(
    initConfig || {
      baseUrl: "",
      sidebar: {
        default: [],
        mobile: [],
      },
    }
  )

  return (
    <SiteConfigContext.Provider
      value={{
        config,
        setConfig,
      }}
    >
      {children}
    </SiteConfigContext.Provider>
  )
}

export const useSiteConfig = (): SiteConfigContextType => {
  const context = useContext(SiteConfigContext)

  if (!context) {
    throw new Error("useSiteConfig must be used inside a SiteConfigProvider")
  }

  return context
}

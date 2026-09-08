"use client"

import React from "react"
import { OpenAPI } from "types"
import { ReactNode, createContext, useContext } from "react"

type BaseSpecsContextType = {
  baseSpecs: OpenAPI.ExpandedDocument | undefined
  getSecuritySchema: (
    securityName: string
  ) => OpenAPI.SecuritySchemeObject | null
}

const BaseSpecsContext = createContext<BaseSpecsContextType | null>(null)

type BaseSpecsProviderProps = {
  baseSpecs: OpenAPI.ExpandedDocument | undefined
  children?: ReactNode
}

const BaseSpecsProvider = ({ children, baseSpecs }: BaseSpecsProviderProps) => {
  const getSecuritySchema = (
    securityName: string
  ): OpenAPI.SecuritySchemeObject | null => {
    if (
      baseSpecs?.components?.securitySchemes &&
      Object.prototype.hasOwnProperty.call(
        baseSpecs?.components?.securitySchemes,
        securityName
      )
    ) {
      const schema = baseSpecs?.components?.securitySchemes[securityName]
      if (!("$ref" in schema)) {
        return schema
      }
    }

    return null
  }

  return (
    <BaseSpecsContext.Provider
      value={{
        baseSpecs,
        getSecuritySchema,
      }}
    >
      {children}
    </BaseSpecsContext.Provider>
  )
}

export default BaseSpecsProvider

export const useBaseSpecs = (): BaseSpecsContextType => {
  const context = useContext(BaseSpecsContext)

  if (!context) {
    throw new Error("useBaseSpecs must be used inside a BaseSpecsProvider")
  }

  return context
}

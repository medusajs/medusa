"use client"

import { SecuritySchemeObject } from "@/types/openapi"
import { OpenAPIV3 } from "openapi-types"
import { ReactNode, createContext, useContext, useState } from "react"

type BaseSpecsContextType = {
  baseSpecs: OpenAPIV3.Document | null
  setBaseSpecs: (value: OpenAPIV3.Document) => void
  getSecuritySchema: (securityName: string) => SecuritySchemeObject | null
}

const BaseSpecsContext = createContext<BaseSpecsContextType | null>(null)

type BaseSpecsProviderProps = {
  initialSpecs?: OpenAPIV3.Document | null
  children?: ReactNode
}

const BaseSpecsProvider = ({
  children,
  initialSpecs = null,
}: BaseSpecsProviderProps) => {
  const [baseSpecs, setBaseSpecs] = useState<OpenAPIV3.Document | null>(
    initialSpecs
  )

  const getSecuritySchema = (
    securityName: string
  ): SecuritySchemeObject | null => {
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
        setBaseSpecs,
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

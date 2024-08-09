"use client"

import { ExpandedDocument, SecuritySchemeObject } from "@/types/openapi"
import { ReactNode, createContext, useContext, useState } from "react"

type BaseSpecsContextType = {
  baseSpecs: ExpandedDocument | null
  setBaseSpecs: React.Dispatch<React.SetStateAction<ExpandedDocument | null>>
  getSecuritySchema: (securityName: string) => SecuritySchemeObject | null
}

const BaseSpecsContext = createContext<BaseSpecsContextType | null>(null)

type BaseSpecsProviderProps = {
  initialSpecs?: ExpandedDocument | null
  children?: ReactNode
}

const BaseSpecsProvider = ({
  children,
  initialSpecs = null,
}: BaseSpecsProviderProps) => {
  const [baseSpecs, setBaseSpecs] = useState<ExpandedDocument | null>(
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

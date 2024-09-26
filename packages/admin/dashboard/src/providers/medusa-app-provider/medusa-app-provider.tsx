import { PropsWithChildren } from "react"
import { MedusaApp } from "../../core/medusa-app/medusa-app"
import { MedusaAppContext } from "./medusa-app-context"

type MedusaAppProviderProps = PropsWithChildren<{
  api: MedusaApp["api"]
}>

export const MedusaAppProvider = ({
  api,
  children,
}: MedusaAppProviderProps) => {
  return (
    <MedusaAppContext.Provider value={api}>
      {children}
    </MedusaAppContext.Provider>
  )
}

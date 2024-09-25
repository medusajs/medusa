import { PropsWithChildren } from "react"
import { MedusaApp } from "../../medusa-app"
import { MedusaAppContext } from "./medusa-app-context"

type MedusaAppProviderProps = PropsWithChildren<{
  getMenu: MedusaApp["getMenu"]
  getWidgets: MedusaApp["getWidgets"]
}>

export const MedusaAppProvider = ({
  getMenu,
  getWidgets,
  children,
}: MedusaAppProviderProps) => {
  return (
    <MedusaAppContext.Provider
      value={{
        api: {
          getMenu,
          getWidgets,
        },
      }}
    >
      {children}
    </MedusaAppContext.Provider>
  )
}

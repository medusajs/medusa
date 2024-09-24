import { ReactNode, useMemo } from "react"
import { MedusaApp } from "../../medusa-app"
import { ExtensionsContext } from "./extensions-context"

import config from "virtual:medusa/extensions"

export const ExtensionsProvider = ({ children }: { children: ReactNode }) => {
  const value = useMemo(() => {
    const app = new MedusaApp({ config })

    return {
      api: {
        getWidgets: app.getWidgets,
        getMenuItems: app.getMenuItems,
      },
    }
  }, [config])

  return (
    <ExtensionsContext.Provider value={value}>
      {children}
    </ExtensionsContext.Provider>
  )
}

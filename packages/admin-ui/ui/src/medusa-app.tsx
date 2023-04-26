import {
  Application,
  Customization,
  DomainKey,
  HookPointKey,
  InjectionZone,
  InjectionZones,
  WidgetsConfig,
} from "@medusajs/types"
import React from "react"
import App from "./App"
import { InjectionZoneProvider } from "./providers/injection-zone-provider"
import { Providers } from "./providers/providers"

type MedusaAppConfig = {
  customizations?: Customization[]
}

class MedusaApp implements Application {
  private injectionZones: InjectionZones
  private customizations: Customization[]

  constructor(config: MedusaAppConfig) {
    this.injectionZones = new Map()
    this.customizations = config.customizations || []
  }

  registerWidgets(identifier: string, config: WidgetsConfig): void {
    for (const [key, value] of Object.entries(config)) {
      const domainKey = key as DomainKey

      for (const [zone, widgets] of Object.entries(value)) {
        if (!widgets) {
          continue
        }

        const zoneKey = zone as HookPointKey

        const injectionZone = `${domainKey}.${zoneKey}` as InjectionZone

        if (!this.injectionZones.has(injectionZone)) {
          this.injectionZones.set(injectionZone, [])
        }

        const currentWidgets = this.injectionZones.get(injectionZone) || []

        this.injectionZones.set(injectionZone, [
          ...currentWidgets,
          ...widgets.map((w) => ({ ...w, origin: identifier })),
        ])
      }
    }
  }

  initialize(): void {
    this.customizations.forEach((c) => {
      c.setup(this)
    })
  }

  render() {
    return (
      <React.StrictMode>
        <Providers>
          <InjectionZoneProvider injectionZoneMap={this.injectionZones}>
            <App />
          </InjectionZoneProvider>
        </Providers>
      </React.StrictMode>
    )
  }
}

export default MedusaApp

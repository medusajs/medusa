import {
  Application,
  Extension,
  InjectionZone,
  InjectionZones,
  PagePointKey,
  Widget,
  WidgetsConfig,
} from "@medusajs/types"
import React from "react"
import App from "./App"
import { Providers } from "./providers/providers"

type MedusaAppConfig = {
  extensions?: Extension[]
}

interface Result {
  injectionZone: InjectionZone
  widgets: Widget[]
}

type PagePoint = {
  [key in PagePointKey]?: Widget[]
}

class MedusaApp implements Application {
  private injectionZones: InjectionZones
  private customizations: Extension[]

  constructor(config: MedusaAppConfig) {
    this.injectionZones = new Map()
    this.customizations = config.extensions || []
  }

  private findArraysInWidgets_(
    widgets: WidgetsConfig,
    path: string = ""
  ): Result[] {
    const results: Result[] = []

    Object.entries(widgets).forEach(([key, value]) => {
      if (Array.isArray(value)) {
        results.push({
          injectionZone: (path ? `${path}.${key}` : key) as InjectionZone,
          widgets: value,
        })
      } else {
        results.push(
          ...this.findArraysInWidgets_(
            value as WidgetsConfig,
            path ? `${path}.${key}` : key
          )
        )
      }
    })

    return results
  }

  registerWidgets(identifier: string, config: WidgetsConfig): void {
    const results = this.findArraysInWidgets_(config)

    results.forEach(({ injectionZone, widgets }) => {
      if (!this.injectionZones.has(injectionZone)) {
        this.injectionZones.set(injectionZone, [])
      }

      const currentWidgets = this.injectionZones.get(injectionZone) || []

      this.injectionZones.set(injectionZone, [
        ...currentWidgets,
        ...widgets.map((w) => ({ ...w, origin: identifier })),
      ])
    })
  }

  initialize(): void {
    this.customizations.forEach((c) => {
      c.setup(this)
    })
  }

  render() {
    return (
      <React.StrictMode>
        <Providers injectionZones={this.injectionZones}>
          <App />
        </Providers>
      </React.StrictMode>
    )
  }
}

export default MedusaApp

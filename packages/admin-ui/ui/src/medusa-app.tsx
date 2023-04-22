import React from "react"
import ExtensionTest from "./../../../../../test-server/dist/extensions/product-details"
import App from "./App"
import { InjectionProvider } from "./providers/injection-provider"
import { Providers } from "./providers/providers"

export type Component = {
  name: string
  Component: React.ComponentType<any>
}

export class Components {
  public components: Map<string, React.ComponentType<any>>

  constructor() {
    this.components = new Map()
  }

  addComponent(component: Component) {
    const { name, Component } = component

    if (!name) {
      throw new Error(`A component must have a name`)
    }

    if (this.components.has(name)) {
      throw new Error(`Component ${name} already exists`)
    }

    if (!Component) {
      throw new Error(`Component ${name} must provide a React component`)
    }

    if (typeof Component !== "function") {
      throw new Error(`Component ${name} is not a valid React component`)
    }

    this.components.set(name, Component)
  }

  getComponent(name: string) {
    return this.components.get(name)
  }

  getComponents() {
    return this.components.entries()
  }
}

export type Library = {
  components: Components
}

type MedusaAppConfig = {
  library: Library
  plugins?: Plugin[]
}

type InjectionZones = {
  order: {
    details: Component[]
  }
  product: {
    details: Component[]
    new: Component[]
  }
}

class MedusaApp {
  library: Library
  plugins: Plugin[]
  injectionZones: InjectionZones

  constructor({ library, plugins = [] }: MedusaAppConfig) {
    this.library = library
    this.plugins = plugins
    this.injectionZones = {
      order: {
        details: [],
      },
      product: {
        details: [],
        new: [],
      },
    }
  }

  addComponents(components: Component | Component[]) {
    if (Array.isArray(components)) {
      components.forEach((component) =>
        this.library.components.addComponent(component)
      )
    } else {
      this.library.components.addComponent(components)
    }
  }

  injectComponent<
    V extends keyof InjectionZones,
    Z extends keyof InjectionZones[V]
  >(view: V, zone: Z, component: Component) {
    if (!this.injectionZones[view]?.[zone]) {
      throw new Error(`Injection zone ${String(zone)} does not exist`)
    }

    ;(this.injectionZones[view][zone] as Component[]).push(component)
  }

  async initialize() {
    console.warn(JSON.stringify(this.plugins, null, 2))

    for (const plugin of this.plugins) {
      await plugin.extension.register(this)
    }
  }

  bootstrap() {}

  render() {
    return (
      <React.StrictMode>
        <Providers>
          <InjectionProvider injectionZones={this.injectionZones}>
            <ExtensionTest />
            <App />
          </InjectionProvider>
        </Providers>
      </React.StrictMode>
    )
  }
}

type Extension = {
  register: (app: MedusaApp) => Promise<void>
}

export type Plugin = {
  id: string
  extension: Extension
}

export default MedusaApp

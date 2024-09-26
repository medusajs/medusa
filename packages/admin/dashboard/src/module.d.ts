import { CustomFieldModel } from "@medusajs/admin-shared"

declare module "virtual:medusa/widgets/*" {
  import type { ComponentType } from "react"

  const widgets: { Component: ComponentType<any> }[]

  export default {
    widgets,
  }
}

declare module "virtual:medusa/routes/pages" {
  const pages: { path: string; Component: () => JSX.Element }[]

  export default {
    pages,
  }
}

declare module "virtual:medusa/routes/links" {
  import type { ComponentType } from "react"

  const links: { path: string; label: string; icon?: ComponentType }[]

  export default {
    links,
  }
}

declare module "virtual:medusa/custom-fields/*/$field" {
  import type { ComponentType } from "react"

  const sections: Record<
    string,
    {
      component?: ComponentType<any>
      label?: string
      description?: string
      type: any
    }
  >[]
}

declare module "virtual:medusa/custom-fields/*/$config" {
  const configs: Record<
    string,
    {
      defaultValue: ((data: any) => any) | any
      validation: any
    }
  >[]
}

declare module "virtual:medusa/custom-fields/*/$display" {
  import type { ComponentType } from "react"

  const containers: {
    component: ComponentType<any>
  }[]
}

declare module "virtual:medusa/custom-fields/*/$link" {
  const links: string[]
}

declare module "virtual:medusa/config" {
  import type { CustomFieldConfiguration } from "./core/form-registry/types"
  import type {
    MenuItemExtension,
    RouteExtension,
    WidgetExtension,
  } from "./providers/medusa-app-provider/types"

  const extensions: {
    widgets: WidgetExtension[]
    routing: {
      menuItems: MenuItemExtension[]
      routes: RouteExtension[]
    }
    customFields: CustomFieldConfiguration
  }

  export default extensions
}

declare module "virtual:medusa/routes" {
  import type { ComponentType } from "react"
  import type { LoaderFunction } from "react-router-dom"
  const routes: {
    path: string
    Component: ComponentType
    loader?: LoaderFunction
  }[]

  export default {
    routes,
  }
}

declare module "virtual:medusa/links" {
  const links: Record<CustomFieldModel, (string | string[])[]>

  export default {
    customFieldLinks: links,
  }
}

declare module "virtual:medusa/widgets/*" {
  const widgets: { Component: () => JSX.Element }[]

  export default {
    widgets,
  }
}

declare module "virtual:medusa/routes/pages" {
  const pages: { path: string; file: string }[]

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

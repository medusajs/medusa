declare module "medusa-admin:widgets/*" {
  const widgets: { Component: () => JSX.Element }[]

  export default {
    widgets,
  }
}

declare module "virtual:medusa/widgets/*" {
  const widgets: { Component: () => JSX.Element }[]

  export default {
    widgets,
  }
}

declare module "medusa-admin:routes/links" {
  const links: { path: string; label: string; icon?: React.ComponentType }[]

  export default {
    links,
  }
}

declare module "medusa-admin:routes/pages" {
  const pages: { path: string; file: string }[]

  export default {
    pages,
  }
}

declare module "medusa-admin:settings/cards" {
  const cards: { path: string; label: string; description: string }[]

  export default {
    cards,
  }
}

declare module "medusa-admin:settings/pages" {
  const pages: { path: string; file: string }[]

  export default {
    pages,
  }
}

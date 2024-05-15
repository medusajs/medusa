import { RouteObject } from "react-router-dom"

import routes from "medusa-admin:routes/pages"

/**
 * UI Route extensions.
 */
export const RouteExtensions: RouteObject[] = routes.pages.map((ext) => {
  return {
    path: ext.path,
    async lazy() {
      const { default: Component } = await import(/* @vite-ignore */ ext.file)
      return { Component }
    },
  }
})

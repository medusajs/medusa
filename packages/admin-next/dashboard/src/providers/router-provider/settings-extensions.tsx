import settings from "medusa-admin:settings/pages"
import { RouteObject } from "react-router-dom"

/**
 * UI Settings extensions.
 */
export const SettingsExtensions: RouteObject[] = settings.pages.map((ext) => {
  return {
    path: `/settings${ext.path}`,
    async lazy() {
      const { default: Component } = await import(/* @vite-ignore */ ext.file)
      return { Component }
    },
  }
})

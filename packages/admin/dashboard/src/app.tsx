import { DashboardApp } from "./dashboard-app"
import { DashboardPlugin } from "./dashboard-app/types"

import displayModule from "virtual:medusa/displays"
import formModule from "virtual:medusa/forms"
import i18nModule from "virtual:medusa/i18n"
import layoutModule from "virtual:medusa/layouts"
import menuItemModule from "virtual:medusa/menu-items"
import routeModule from "virtual:medusa/routes"
import widgetModule from "virtual:medusa/widgets"
import "virtual:medusa/cell-renderers"
import "virtual:medusa/search-entities"

import { defineCellRenderer } from "./lib/table/cell-renderers"
import {
  clearSearchEntities,
  defineSearchEntity,
} from "./lib/search/search-entities"

import "./index.css"

const localPlugin = {
  widgetModule,
  routeModule,
  displayModule,
  formModule,
  menuItemModule,
  i18nModule,
  layoutModule,
}

interface AppProps {
  plugins?: DashboardPlugin[]
}

function App({ plugins = [] }: AppProps) {
  const app = new DashboardApp({
    plugins: [localPlugin, ...plugins],
  })

  return <div>{app.render()}</div>
}

export { defineCellRenderer, defineSearchEntity, clearSearchEntities }
export default App

import { ComponentType } from "react"
import {
  createBrowserRouter,
  LoaderFunctionArgs,
  RouteObject,
} from "react-router-dom"
import { ProtectedRoute } from "../../components/authentication/protected-route"
import { ErrorBoundary } from "../../components/utilities/error-boundary"
import { RouteExtension } from "../../providers/medusa-app-provider/types"
import { RoutesCore } from "./routes-core"
import { RoutesSettings } from "./routes-settings"

type IRouter = ReturnType<typeof createBrowserRouter>

/**
 * Used to test if a route is a settings route.
 */
export const settingsRouteRegex = /^\/settings\//

export class Router {
  private _router: IRouter | null = null
  private _coreExtensionRoutes: RouteObject[] = []
  private _settingExtensionRoutes: RouteObject[] = []

  constructor(routes: RouteExtension[] = []) {
    // Split the routes into core and settings
    const coreRouteExtensions: RouteExtension[] = []
    const settingRouteExtensions: RouteExtension[] = []

    routes.forEach((route) => {
      if (settingsRouteRegex.test(route.path)) {
        settingRouteExtensions.push(route)
      } else {
        coreRouteExtensions.push(route)
      }
    })

    this._coreExtensionRoutes = createRouteMap(coreRouteExtensions)
    this._settingExtensionRoutes = createRouteMap(
      settingRouteExtensions,
      "/settings"
    )
  }

  createRouter() {
    const routes: RouteObject[] = [
      {
        path: "/login",
        lazy: () => import("../../routes/login"),
      },
      {
        path: "*",
        lazy: () => import("../../routes/no-match"),
      },
      {
        path: "/invite",
        lazy: () => import("../../routes/invite"),
      },
      {
        element: <ProtectedRoute />,
        errorElement: <ErrorBoundary />,
        children: [
          {
            path: "/",
            lazy: async () => {
              const { MainLayout } = await import(
                "../../components/layout/main-layout"
              )

              return {
                Component: MainLayout,
              }
            },
            children: [...RoutesCore, ...this._coreExtensionRoutes],
          },
          {
            path: "/settings",
            handle: {
              crumb: () => "Settings",
            },
            lazy: async () => {
              const { SettingsLayout } = await import(
                "../../components/layout/settings-layout"
              )

              return {
                Component: SettingsLayout,
              }
            },
            children: [...RoutesSettings, ...this._settingExtensionRoutes],
          },
        ],
      },
    ]

    this._router = createBrowserRouter(routes, {
      basename: __BASE__ || "/",
    })

    return this._router
  }
}

const createRouteMap = (
  routes: RouteExtension[],
  ignore?: string
): RouteObject[] => {
  const root: RouteObject[] = []

  const addRoute = (
    pathSegments: string[],
    Component: ComponentType,
    currentLevel: RouteObject[],
    loader?: (args: LoaderFunctionArgs) => Promise<any>
  ) => {
    if (!pathSegments.length) {
      return
    }

    const [currentSegment, ...remainingSegments] = pathSegments
    let route = currentLevel.find((r) => r.path === currentSegment)

    if (!route) {
      route = { path: currentSegment, children: [] }
      currentLevel.push(route)
    }

    if (remainingSegments.length === 0) {
      route.children ||= []
      route.children.push({
        path: "",
        errorElement: <ErrorBoundary />,
        async lazy() {
          if (loader) {
            return { Component, loader }
          }

          return { Component }
        },
      })
    } else {
      route.children ||= []
      addRoute(remainingSegments, Component, route.children, loader)
    }
  }

  routes.forEach(({ path, Component, loader }) => {
    // Remove the ignore segment from the path if it is provided
    const cleanedPath = ignore
      ? path.replace(ignore, "").replace(/^\/+/, "")
      : path.replace(/^\/+/, "")
    const pathSegments = cleanedPath.split("/").filter(Boolean)
    addRoute(pathSegments, Component, root, loader)
  })

  return root
}

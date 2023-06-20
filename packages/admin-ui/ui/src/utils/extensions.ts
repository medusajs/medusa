import { forbiddenRoutes } from "../constants/forbidden-routes"
import { injectionZones } from "../constants/injection-zones"
import {
  Extension,
  ForbiddenRoute,
  InjectionZone,
  Route,
  RouteExtension,
  RouteSegment,
  WidgetExtension,
} from "../types/extensions"

export function isValidInjectionZone(zone: any): zone is InjectionZone {
  return injectionZones.includes(zone)
}

function isForbiddenRoute(route: any): route is ForbiddenRoute {
  return forbiddenRoutes.includes(route)
}

export function validatePath(
  path: string,
  origin: string
): {
  valid: boolean
  error: string
} {
  if (isForbiddenRoute(path)) {
    return {
      error: `A route from ${origin} is using a forbidden path: ${path}.`,
      valid: false,
    }
  }

  if (!path.startsWith("/")) {
    return {
      error: `A route from ${origin} is using an invalid path: ${path}. All paths must start with a "/".`,
      valid: false,
    }
  }

  if (path.endsWith("/")) {
    return {
      error: `A route from ${origin} is using an invalid path: ${path}. All paths must not end with a "/".`,
      valid: false,
    }
  }

  const specialChars = ["/", ":"]

  for (let i = 0; i < path.length; i++) {
    const currentChar = path[i]

    if (
      !specialChars.includes(currentChar) &&
      !/^[a-z0-9]$/i.test(currentChar)
    ) {
      return {
        error: `A route from ${origin} is using an invalid path: ${path}. All paths must only contain alphanumeric characters, "/" and ":".`,
        valid: false,
      }
    }

    if (currentChar === ":" && (i === 0 || path[i - 1] !== "/")) {
      return {
        error: `A route from ${origin} is using an invalid path: ${path}. All paths must only contain alphanumeric characters, "/" and ":".`,
        valid: false,
      }
    }
  }

  return {
    valid: true,
    error: "",
  }
}

export function isWidgetExtension(
  extension: Extension
): extension is WidgetExtension {
  return "config" in extension && "zone" in extension.config
}

export function isRouteExtension(
  extension: Extension
): extension is RouteExtension {
  return "config" in extension && "path" in extension.config
}

export function isRoute(route: Route | RouteSegment): route is Route {
  return "Page" in route
}

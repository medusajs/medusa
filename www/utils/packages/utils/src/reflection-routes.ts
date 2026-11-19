import { Reflection } from "typedoc"

export type ReflectionRoute = {
  url: string
  anchor?: string
  hasOwnDocument: boolean
}

const routes = new Map<Reflection, ReflectionRoute>()

export function setReflectionRoute(
  reflection: Reflection,
  route: ReflectionRoute
) {
  routes.set(reflection, route)
}

export function getReflectionRoute(
  reflection?: Reflection
): ReflectionRoute | undefined {
  return reflection ? routes.get(reflection) : undefined
}

export function getReflectionUrl(reflection?: Reflection): string | undefined {
  return getReflectionRoute(reflection)?.url
}

export function getReflectionAnchor(
  reflection?: Reflection
): string | undefined {
  return getReflectionRoute(reflection)?.anchor
}

export function reflectionHasOwnDocument(reflection?: Reflection): boolean {
  return getReflectionRoute(reflection)?.hasOwnDocument || false
}

export function allChildrenHaveOwnDocument(group: {
  children: Reflection[]
}): boolean {
  return group.children.every((child) => reflectionHasOwnDocument(child))
}

export function getRoutedReflections(): Reflection[] {
  return [...routes.keys()]
}

export function clearReflectionRoutes() {
  routes.clear()
}

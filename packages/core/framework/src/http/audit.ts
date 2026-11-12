import type {
  AuditOutcome,
  CreateAuditLogDTO,
  IAuditModuleService,
  Logger,
} from "@medusajs/types"
import { isObject, singularize } from "@medusajs/utils"
import type { NextFunction, Request, Response } from "express"
import type { RoutesFinder } from "./routes-finder"
import type {
  AuditConfigRoute,
  AuditRequest,
  AuditResource,
  AuditRouteConfig,
  AuditRouteSetting,
  MiddlewareVerb,
  RouteDescriptor,
} from "./types"

const DEFAULT_AUDITED_METHODS = new Set(["POST", "PUT", "PATCH", "DELETE"])
const DEFAULT_AUDITED_PREFIXES = ["/admin", "/rbac", "/auth"]

/**
 * Namespaces that come before the segment naming the resource, with the prefix
 * given to the resource type. The prefix keeps RBAC types in line with their
 * policy resources (`rbac_role`, `rbac_policy`). `/auth` routes act on no
 * resource.
 */
const RESOURCE_NAMESPACES: Record<string, string | null> = {
  admin: "",
  store: "",
  rbac: "rbac_",
  auth: null,
}

const MAX_USER_AGENT_LENGTH = 512

/**
 * Keeps one route per matcher and method. A later route replaces an earlier
 * one, except that two objects are shallow-merged so an application can add to
 * a core setting without restating it.
 */
export function mergeAuditConfigRoutes(
  routes: AuditConfigRoute[]
): AuditConfigRoute[] {
  const merged = new Map<string, AuditConfigRoute>()

  for (const route of routes) {
    for (const method of route.methods) {
      const key = `${String(route.matcher)} ${method}`
      const existing = merged.get(key)

      merged.set(key, {
        matcher: route.matcher,
        methods: [method],
        config: existing
          ? mergeAuditSettings(existing.config, route.config)
          : route.config,
      })
    }
  }

  return [...merged.values()]
}

function mergeAuditSettings(
  previous: AuditRouteSetting,
  next: AuditRouteSetting
): AuditRouteSetting {
  if (isObject(previous) && isObject(next)) {
    return { ...previous, ...next }
  }

  return next
}

export function isAuditedByDefault(method: string, path: string): boolean {
  if (!DEFAULT_AUDITED_METHODS.has(method)) {
    return false
  }

  return DEFAULT_AUDITED_PREFIXES.some(
    (prefix) => path === prefix || path.startsWith(`${prefix}/`)
  )
}

/**
 * Maps the `:param` segments of a route pattern to the values in the path.
 */
export function getRouteParams(
  pattern: string,
  path: string
): Record<string, string> {
  const patternSegments = pattern.split("/")
  const pathSegments = path.split("/")
  const params: Record<string, string> = {}

  patternSegments.forEach((segment, index) => {
    if (!segment.startsWith(":") || pathSegments[index] === undefined) {
      return
    }

    params[segment.slice(1)] = safeDecode(pathSegments[index])
  })

  return params
}

const isParamSegment = (segment: string) => segment.startsWith(":")

/**
 * The default resource, after skipping a leading namespace such as `/admin`.
 * With path parameters, the ID is the last one and the type is the segment
 * before it, so nested routes name the nested resource. Without any, the type
 * is the first segment and the ID is read from the response body, which holds
 * a created resource under its type (`{ product: { id } }`).
 */
export function getDefaultAuditResource(
  pattern: string,
  params: Record<string, string>,
  body?: unknown
): AuditResource | undefined {
  const allSegments = pattern.split("/").filter(Boolean)
  const namespacePrefix = RESOURCE_NAMESPACES[allSegments[0]]
  if (namespacePrefix === null) {
    return
  }

  const segments =
    namespacePrefix === undefined ? allSegments : allSegments.slice(1)

  let paramIndex = segments.length - 1
  while (paramIndex >= 0 && !isParamSegment(segments[paramIndex])) {
    paramIndex--
  }

  let typeIndex = Math.max(paramIndex - 1, 0)
  while (typeIndex > 0 && isParamSegment(segments[typeIndex])) {
    typeIndex--
  }

  const typeSegment = segments[typeIndex]
  if (!typeSegment || !/^[\w-]+$/.test(typeSegment)) {
    return
  }

  const words = typeSegment.split("-")
  words[words.length - 1] = singularize(words[words.length - 1])
  const name = words.join("_")

  const createdId = isObject(body)
    ? (body as Record<string, { id?: unknown }>)[name]?.id
    : undefined

  return {
    type: `${namespacePrefix ?? ""}${name}`,
    id:
      paramIndex >= 0
        ? (params[segments[paramIndex].slice(1)] ?? null)
        : typeof createdId === "string"
          ? createdId
          : null,
  }
}

export function getAuditOutcome(statusCode: number): AuditOutcome {
  if (statusCode === 401 || statusCode === 403) {
    return "denied"
  }

  return statusCode >= 400 ? "failed" : "succeeded"
}

export function resolveAuditActor(req: AuditRequest): {
  actor_type: string
  actor_id: string | null
  metadata: Record<string, unknown>
} {
  const authContext = req.auth_context
  const metadata: Record<string, unknown> = {}

  if (!authContext?.actor_id) {
    if (authContext?.auth_identity_id) {
      metadata.auth_identity_id = authContext.auth_identity_id
    }

    return { actor_type: "anonymous", actor_id: null, metadata }
  }

  const createdBy = (req as { secret_key_context?: { created_by?: string } })
    .secret_key_context?.created_by
  if (createdBy) {
    metadata.api_key_created_by = createdBy
  }

  return {
    actor_type: authContext.actor_type,
    actor_id: authContext.actor_id,
    metadata,
  }
}

function safeDecode(value: string): string {
  try {
    return decodeURIComponent(value)
  } catch {
    return value
  }
}

function toDataObject(value: unknown): Record<string, unknown> | null {
  return isObject(value) ? (value as Record<string, unknown>) : null
}

export type AuditMiddlewareOptions = {
  routesFinder: RoutesFinder<RouteDescriptor>
  auditRoutesFinder?: RoutesFinder<AuditConfigRoute>
  getAuditService: () => IAuditModuleService
  logger: Logger
}

/**
 * Records audited requests once their response is sent. Nothing it does may
 * throw into, delay, or alter the request or its response: every failure is
 * logged and the request goes on.
 */
export function createAuditMiddleware({
  routesFinder,
  auditRoutesFinder,
  getAuditService,
  logger,
}: AuditMiddlewareOptions) {
  const callSafely = <T>(
    label: string,
    route: string,
    fn: () => T
  ): T | undefined => {
    try {
      return fn()
    } catch (error) {
      logger.warn(
        `Audit: the ${label} function of ${route} threw and was ignored: ${error?.message}`
      )
      return
    }
  }

  const startRecording = (req: Request, res: Response) => {
    const method = req.method
    const path = req.path

    const setting = auditRoutesFinder?.find(
      path,
      method as MiddlewareVerb
    )?.config

    const shouldRecord =
      setting === undefined ? isAuditedByDefault(method, path) : !!setting

    if (!shouldRecord) {
      return
    }

    const config: AuditRouteConfig = isObject(setting)
      ? (setting as AuditRouteConfig)
      : {}
    const startedAt = new Date()

    // Only a reference is kept, for the ID of a created resource and for the
    // route's own setting functions.
    let responseBody: unknown
    const originalJson = res.json
    res.json = function auditJson(this: Response, body?: unknown) {
      responseBody = body
      return originalJson.call(this, body)
    } as Response["json"]

    let recorded = false
    const record = (closedEarly: boolean) => {
      if (recorded) {
        return
      }
      recorded = true

      try {
        const auditReq = req as unknown as AuditRequest
        const statusCode = res.statusCode
        const succeeded = statusCode < 400
        const body = succeeded ? responseBody : undefined

        const matchedRoute = routesFinder.find(path, method as MiddlewareVerb)
        const route =
          matchedRoute?.matcher ?? (req.route?.path as string) ?? path

        const params = getRouteParams(route, path)
        if (matchedRoute) {
          auditReq.params = { ...auditReq.params, ...params }
        }

        const resource =
          (config.resource &&
            callSafely("resource", route, () =>
              config.resource!(auditReq, body)
            )) ||
          getDefaultAuditResource(route, params, body)

        const requestData =
          config.requestData &&
          callSafely("requestData", route, () => config.requestData!(auditReq))

        const responseData =
          config.responseData &&
          callSafely("responseData", route, () =>
            config.responseData!(auditReq, body)
          )

        const { actor_type, actor_id, metadata } = resolveAuditActor(auditReq)
        if (closedEarly) {
          metadata.connection_closed = true
        }

        const userAgent = req.get("user-agent")
        const entry: CreateAuditLogDTO = {
          action: config.action ?? `${method} ${route}`,
          actor_type,
          actor_id,
          resource_type: resource?.type ?? null,
          resource_id: resource?.id ?? null,
          outcome: getAuditOutcome(statusCode),
          started_at: startedAt,
          ended_at: new Date(),
          request: {
            method,
            route,
            path,
            status_code: statusCode,
            request_id: (req as { requestId?: string }).requestId ?? null,
            ip_address:
              (req as { request_context?: { ip_address?: string } })
                .request_context?.ip_address ??
              req.ip ??
              null,
            user_agent: userAgent
              ? userAgent.slice(0, MAX_USER_AGENT_LENGTH)
              : null,
          },
          request_data: toDataObject(requestData),
          response_data: toDataObject(responseData),
          metadata: Object.keys(metadata).length ? metadata : null,
        }

        getAuditService().createAuditLogs(entry)
      } catch (error) {
        logger.warn(
          `Audit: failed to record ${method} ${path}: ${error?.message}`
        )
      }
    }

    res.once("finish", () => record(false))
    res.once("close", () => record(!res.writableFinished))
  }

  return function auditMiddleware(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      startRecording(req, res)
    } catch (error) {
      logger.warn(
        `Audit: failed to prepare the audit log of ${req.method} ${req.path}: ${error?.message}`
      )
    }

    next()
  }
}

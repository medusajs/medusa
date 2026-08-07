const STATUS_NAMES: Record<number, string> = {
  400: "BadRequest",
  401: "Unauthorized",
  403: "Forbidden",
  404: "NotFound",
  405: "MethodNotAllowed",
  422: "UnprocessableEntity",
  500: "InternalServerError",
}

export type RouteErrorBody = {
  error: {
    status: number
    name: string
    message: string
  }
}

/**
 * Error thrown by {@link throwErrorResponse}. It carries the HTTP status and
 * message that {@link withRouteErrorHandling} turns into a JSON response.
 */
export class RouteError extends Error {
  readonly status: number
  readonly errorName: string

  constructor(status: number, message: string, name?: string) {
    super(message)
    this.status = status
    this.errorName = name ?? STATUS_NAMES[status] ?? "Error"
  }

  get body(): RouteErrorBody {
    return {
      error: {
        status: this.status,
        name: this.errorName,
        message: this.message,
      },
    }
  }

  toResponse(): Response {
    return new Response(JSON.stringify(this.body), {
      status: this.status,
      headers: {
        "Content-Type": "application/json",
      },
    })
  }
}

/**
 * Throws an HTTP error from anywhere inside a route handler (or a helper it
 * calls). The handler — or the outermost function in its call stack — must be
 * wrapped in {@link withRouteErrorHandling}, which converts the thrown error
 * into a JSON response of the shape:
 *
 * ```json
 * { "error": { "status": 404, "name": "NotFound", "message": "..." } }
 * ```
 */
export function throwErrorResponse(
  status: number,
  message: string,
  name?: string
): never {
  throw new RouteError(status, message, name)
}

/**
 * Wraps a route handler so that:
 *
 * - errors from {@link throwErrorResponse} become JSON responses with their
 *   status.
 * - any other unexpected error becomes a `500` JSON response instead of the
 *   framework's HTML error page.
 *
 * Only use it on handlers that report errors by throwing. Handlers that rely on
 * `notFound()` / `redirect()` must stay unwrapped, since those work by throwing
 * too and this wrapper would swallow them into a 500.
 *
 * ```ts
 * export const GET = withRouteErrorHandling(async (req: NextRequest) => {
 *   const spec = await loadSpec()
 *   if (!spec) {
 *     throwErrorResponse(404, "Spec not found")
 *   }
 *   return new Response(spec)
 * })
 * ```
 */
export function withRouteErrorHandling<
  TArgs extends unknown[],
  TResponse extends Response,
>(
  handler: (...args: TArgs) => Promise<TResponse>
): (...args: TArgs) => Promise<Response> {
  return async (...args: TArgs) => {
    try {
      return await handler(...args)
    } catch (error) {
      if (error instanceof RouteError) {
        return error.toResponse()
      }

      console.error(error)

      return new RouteError(
        500,
        error instanceof Error ? error.message : "Unexpected error"
      ).toResponse()
    }
  }
}

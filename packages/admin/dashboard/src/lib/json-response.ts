/**
 * Builds a JSON `Response`, for throwing from loaders and components so that
 * react-router routes it to the nearest `errorElement`.
 *
 * Replaces react-router's `json()` helper, which was removed in v7. It keeps the
 * same call shape, including the numeric-status shorthand, so call sites read the
 * same as before.
 *
 * Deliberately not `Response.json()`: that static method is newer than the
 * admin's browser target (Safari 16), and esbuild lowers syntax but does not
 * polyfill runtime APIs, so it would fail at runtime on supported browsers.
 */
export const jsonResponse = (
  body: unknown,
  init?: number | ResponseInit
): Response => {
  const responseInit: ResponseInit =
    typeof init === "number" ? { status: init } : init ?? {}

  return new Response(JSON.stringify(body), {
    ...responseInit,
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      ...responseInit.headers,
    },
  })
}

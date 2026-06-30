type Options<T> = {
  url: string
  responseTransformer: (response: Response) => Promise<T>
  fallbackAction: () => Promise<T>
  /**
   * When enabled, overrides the default URL-based check.
   * Pass `!!process.env.CLOUDFLARE_ENV` for routes that always receive
   * an HTTP URL but should only fetch remotely on Cloudflare.
   */
  useRemote?: boolean
}

/**
 * Cloudflare Workers don't support the Node.js http/https modules. This
 * utility abstracts fetch vs. filesystem access so the same code works in
 * both Cloudflare Workers and local development / Vercel.
 *
 * Default behaviour: use `fetch()` when `url` starts with http(s), otherwise
 * call `fallbackAction` (e.g. read from the local filesystem).
 *
 * Pass `useRemote` to override the default check — useful when the URL is
 * always HTTP but remote fetching should only happen on Cloudflare.
 */
export async function workerCompatibleFetch<T>({
  url,
  responseTransformer,
  fallbackAction,
  useRemote,
}: Options<T>): Promise<T> {
  const shouldFetch = useRemote || /^https?:\/\//.test(url)
  if (shouldFetch) {
    const res = await fetch(url)
    return await responseTransformer(res)
  }

  return fallbackAction()
}

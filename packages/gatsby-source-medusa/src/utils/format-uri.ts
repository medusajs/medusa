export const formatUri = (uri: string): string => {
  let url

  try {
    url = new URL(uri)
  } catch (_) {
    const formatted = /[\w||\d].*/.exec(uri)?.[0]
    return `https://${formatted}`
  }

  return url.href
}

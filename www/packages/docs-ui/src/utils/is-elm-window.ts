export function isElmWindow(elm: unknown): elm is Window {
  return typeof window !== "undefined" && elm === window
}

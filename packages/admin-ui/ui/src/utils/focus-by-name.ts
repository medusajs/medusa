export function focusByName(name: string) {
  document?.getElementsByName(name)?.[0]?.focus()
}

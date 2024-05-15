const BLACKLISTED_PROPS = ["className", "children"]

export default function isPropBlacklisted(propName: string) {
  return BLACKLISTED_PROPS.includes(propName)
}

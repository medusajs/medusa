export default function (str: string): string {
  return str.replaceAll(`"`, "#quot;").replaceAll("-", "&ndash;")
}

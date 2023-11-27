export default function getLinkWithBasePath(path: string): string {
  return `${process.env.NEXT_PUBLIC_BASE_PATH || "/api"}${path}`
}

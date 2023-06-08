export default function getBaseUrl() {
  return process.env.NEXT_PUBLIC_BASE_URL || "http://locahost:3000"
}

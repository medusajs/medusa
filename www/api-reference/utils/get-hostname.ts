export default function getHostName() {
  return process.env.NEXT_PUBLIC_HOSTNAME || "http://locahost:3000"
}

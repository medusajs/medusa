const REGEX = /export const metadata = {[\s\S]*title: `(?<title>.*)`/

export default function findMetadataTitle(content: string): string | undefined {
  const headingMatch = REGEX.exec(content)

  return headingMatch?.groups?.title
}

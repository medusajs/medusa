const HEADING_REGEX = /# (?<title>.*)/

export default function findPageHeading(content: string): string | undefined {
  const headingMatch = HEADING_REGEX.exec(content)

  return headingMatch?.groups?.title
}

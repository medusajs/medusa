const HEADING_REGEX = /# (?<title>.*)/

/**
 *
 * @param {string} content - The content to search
 * @returns {string | undefined}
 */
export default function findPageHeading(content) {
  const headingMatch = HEADING_REGEX.exec(content)

  return headingMatch?.groups?.title
}

import { GITHUB_ISSUES_PREFIX } from "../constants"

export function formatReportLink(title: string, sectionTitle: string) {
  return `${GITHUB_ISSUES_PREFIX}&title=${encodeURI(
    title
  )}%3A%20Issue%20in%20${encodeURI(sectionTitle)}`
}

import { GITHUB_ISSUES_PREFIX, GITHUB_UI_ISSUES_PREFIX } from "../constants"

export type ReportLinkType = "default" | "ui"

export function formatReportLink(
  title: string,
  sectionTitle: string,
  type?: ReportLinkType
) {
  let prefix = GITHUB_ISSUES_PREFIX
  if (type === "ui") {
    prefix = GITHUB_UI_ISSUES_PREFIX
  }
  return `${prefix}&title=${encodeURI(title)}%3A%20Issue%20in%20${encodeURI(
    sectionTitle
  )}`
}

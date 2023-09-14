import { GITHUB_ISSUES_PREFIX } from "docs-ui"

export default function formatReportLink(area = "admin", sectionTitle: string) {
  return `${GITHUB_ISSUES_PREFIX}&title=API%20Ref%28${area}%29%3A%20Issue%20in%20${encodeURI(
    sectionTitle
  )}`
}

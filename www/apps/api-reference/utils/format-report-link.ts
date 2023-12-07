import { formatReportLink as uiFormatReportLink } from "docs-ui"

export default function formatReportLink(area = "admin", sectionTitle: string) {
  return uiFormatReportLink(`API Ref(${area})`, sectionTitle)
}

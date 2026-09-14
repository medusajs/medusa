import React from "react"
import Changelog from "../../components/Changelog"
import { getChangelogPage } from "../../utils/changelog"

/**
 * Renders the Cloud changelog from the entry files in
 * `generated/changelog`. Only the first page is rendered on the server; the
 * rest is loaded from the public `/api/changelog` endpoint as the reader asks
 * for more.
 */
export default async function ChangelogContent() {
  const initialPage = await getChangelogPage()

  return <Changelog initialPage={initialPage} />
}

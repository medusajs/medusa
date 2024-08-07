import { SingleColumnPage } from "../../../components/layout/pages"

import after from "virtual:medusa/widgets/return_reason/list/after"
import before from "virtual:medusa/widgets/return_reason/list/before"

export const ReturnReasonList = () => {
  return (
    <SingleColumnPage
      showMetadata={false}
      showJSON={false}
      hasOutlet
      widgets={{
        after,
        before,
      }}
    >
      Add return reason list here
    </SingleColumnPage>
  )
}

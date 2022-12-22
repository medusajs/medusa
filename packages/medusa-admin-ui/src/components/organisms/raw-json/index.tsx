import { JsonViewer } from "@textea/json-viewer"

import BodyCard from "../body-card"

type RawJSONProps = {
  /**
   * JSON data to render
   */
  data?: object
  /**
   * Body card title.
   */
  title: string
  /**
   * Root name of the object.
   */
  rootName?: string
}

/**
 * Renders a (collapsed) JSON tree section.
 *
 * @param {Object} props - React props
 * @return {Object} - React element
 */
function RawJSON(props: RawJSONProps) {
  const { title, data, rootName } = props

  if (!data) {
    return null
  }

  const dataCount = Object.keys(data).length

  return (
    <BodyCard className={"w-full mb-4 min-h-0 h-auto"} title={title}>
      <div className="flex flex-col min-h-[100px] mt-4 bg-grey-5 px-3 py-2 h-full rounded-rounded">
        <span className="inter-base-semibold">
          Data{" "}
          <span className="text-grey-50 inter-base-regular">
            ({dataCount} {dataCount === 1 ? "item" : "items"})
          </span>
        </span>
        <div className="flex flex-grow items-center mt-4">
          <JsonViewer
            defaultInspectDepth={0}
            rootName={rootName}
            value={data}
          />
        </div>
      </div>
    </BodyCard>
  )
}

export default RawJSON

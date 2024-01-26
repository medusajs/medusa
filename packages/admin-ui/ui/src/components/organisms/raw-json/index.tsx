import JSONView from "../../molecules/json-view"

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
}

/**
 * Renders a (collapsed) JSON tree section.
 *
 * @param {Object} props - React props
 * @return {Object} - React element
 */
function RawJSON(props: RawJSONProps) {
  const { title, data } = props

  if (!data) {
    return null
  }

  return (
    <BodyCard className={"h-auto min-h-0 w-full"} title={title}>
      <div className="flex flex-grow items-center">
        <JSONView data={data} />
      </div>
    </BodyCard>
  )
}

export default RawJSON

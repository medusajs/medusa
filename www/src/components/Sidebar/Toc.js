import { Link } from "gatsby"
import React from "react"
import { useLocation } from "@reach/router"

const isHeadingActive = (location, headingId) => {
  if (location.hash) {
    return location.hash === `#${headingId}`
  }
}

const Toc = ({ headings }) => {
  const location = useLocation()
  return (
    <ul>
      {headings
        .filter(({ depth }) => depth > 1)
        .map(({ id, value, depth }) => (
          <li>
            <Link
              style={{
                paddingLeft: depth > 2 ? `${Math.exp(depth + 0.15)}px` : "auto",
              }}
              to={`#${id}`}
              style={isHeadingActive(location, id) ? { color: "green" } : {}}
            >
              {value}
            </Link>
          </li>
        ))}
    </ul>
  )
}

export default Toc

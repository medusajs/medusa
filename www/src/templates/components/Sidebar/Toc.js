import { Location } from "@reach/router"
import { Link } from "gatsby"
import React from "react"

const Toc = ({ headings }) => {
  return (
    <Location>
      {location => {
        return (
          <ul>
            {headings
              .filter(({ depth }) => depth > 1)
              .map(({ id, value, depth }) => (
                <li>
                  <Link
                    style={{
                      paddingLeft:
                        depth > 2 ? `${Math.exp(depth + 0.15)}px` : "auto",
                    }}
                    to={`#${id}`}
                  >
                    {value}
                  </Link>
                </li>
              ))}
          </ul>
        )
      }}
    </Location>
  )
}

export default Toc

import React, { useState, useEffect } from "react"

const useSpec = raw => {
  const [tags, setTags] = useState({})
  const [spec, setSpec] = useState({})

  useEffect(() => {
    setSpec(raw)

    for (const [path, methods] of Object.entries(raw.paths)) {
      for (const [method, specification] of Object.entries(methods)) {
        for (const t of specification.tags) {
          setTags(ts => {
            if (t in ts) {
              return {
                ...ts,
                [t]: [
                  ...ts[t],
                  {
                    method: method.toUpperCase(),
                    path,
                    ...specification,
                  },
                ],
              }
            } else {
              return {
                ...ts,
                [t]: [
                  {
                    method: method.toUpperCase(),
                    path,
                    ...specification,
                  },
                ],
              }
            }
          })
        }
      }
    }
  }, [])

  return { tags, spec }
}

export default useSpec

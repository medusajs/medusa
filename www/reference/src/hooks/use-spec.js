const useSpec = raw => {
  let tags = {}

  for (const [path, methods] of Object.entries(raw.paths)) {
    for (const [method, specification] of Object.entries(methods)) {
      for (const t of specification.tags) {
        if (t in tags) {
          tags = {
            ...tags,
            [t]: [
              ...tags[t],
              {
                method: method.toUpperCase(),
                path,
                ...specification,
              },
            ],
          }
        } else {
          tags = {
            ...tags,
            [t]: [
              {
                method: method.toUpperCase(),
                path,
                ...specification,
              },
            ],
          }
        }
      }
    }
  }

  return { tags, spec: raw }
}

export default useSpec

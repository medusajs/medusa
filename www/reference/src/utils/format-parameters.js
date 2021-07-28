const formatMethodParams = method => {
  const { parameters, requestBody } = method

  const obj = { type: "method" }
  if (parameters && parameters.length > 0) {
    let params = []
    parameters.map(p => {
      params.push({
        name: p.name,
        description: p.description,
        required: p.required,
        type: p.schema.string,
      })
    })
    obj["parameters"] = params

    // if (requestBody)
  }
}

const formatSectionAttr = section => {}

export const formatParamaters = (item, type) => {
  let params = {}
  switch (type) {
    case "method":
      params = formatMethodParams(item)
      break
    case "section":
      params = formatSectionAttr(item)
    default:
      break
  }

  return params
}

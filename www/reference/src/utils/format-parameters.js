export const formatMethodParams = method => {
  const { parameters, requestBody } = method

  const params = []
  if (parameters && parameters.length > 0) {
    parameters.map(p => {
      return params.push({
        property: p.name,
        description: p.description,
        required: p.required,
        type: p.schema.type,
      })
    })
  }
  if (requestBody) {
    const { required, properties } = requestBody
    properties.map(p => {
      return params.push({
        property: p.property,
        description: p.description,
        required: required ? required.some(req => req === p.property) : false,
        type: p.type,
        nestedModel: p.nestedModel,
      })
    })
  }

  return { properties: params }
}

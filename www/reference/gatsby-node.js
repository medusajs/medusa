const path = require(`path`)
const { createFilePath } = require(`gatsby-source-filesystem`)
const fixtures = require("../../docs/api/fixtures.json")

const createCustomNode = ({ name, node, createNode }) => {
  const tags = node.tags
  const nodePaths = Object.entries(node.paths).map(([path, values]) => {
    return {
      name: path,
      methods: Object.entries(values).map(([method, values]) => {
        const requestBodyValues =
          values?.requestBody?.content?.["application/json"]?.schema

        return {
          method: method,
          ...values,
          requestBody: {
            required: requestBodyValues?.required,
            type: requestBodyValues?.type,
            properties: Object.entries(requestBodyValues?.properties || {}).map(
              ([property, values]) => {
                let ref = null
                let component_id = null
                let nestedModelNode = null
                const { items, anyOf, oneOf, ...rest } = values
                if (items || anyOf || oneOf) {
                  if (items?.anyOf) {
                    component_id = items.anyOf[0]["$ref"].substring(
                      items.anyOf[0]["$ref"].lastIndexOf("/") + 1
                    )
                    ref = node.components.schemas[component_id]
                  } else if (items) {
                    const refPath = items["$ref"]
                    if (refPath) {
                      component_id = refPath.substring(
                        items["$ref"].lastIndexOf("/") + 1
                      )
                      ref = node.components.schemas[component_id]
                    }
                  } else if (anyOf) {
                    component_id = anyOf[0]["$ref"].substring(
                      anyOf[0]["$ref"].lastIndexOf("/") + 1
                    )
                    ref = node.components.schemas[component_id]
                  } else if (oneOf) {
                    component_id = oneOf[0]["$ref"].substring(
                      oneOf[0]["$ref"].lastIndexOf("/") + 1
                    )
                    ref = node.components.schemas[component_id]
                    console.log(ref)
                  }
                }
                if (ref) {
                  const { properties, ...rest } = ref
                  let nestedModelProperties = []
                  if (properties) {
                    Object.entries(properties).map(([key, values]) => {
                      nestedModelProperties.push({
                        property: key,
                        ...values,
                      })
                    })
                    nestedModelNode = {
                      properties: nestedModelProperties,
                      ...rest,
                    }
                  }
                }
                return {
                  property: property,
                  nestedModel: nestedModelNode,
                  ...rest,
                }
              }
            ),
          },

          responses: Object.entries(values.responses).map(
            ([response, values]) => {
              const properties =
                values.content?.["application/json"]?.schema?.properties
              return {
                status: response,
                content: properties
                  ? Object.entries(properties).map(([property, values]) => {
                      const toSet = {}
                      let concept
                      if (values.items && values.items["$ref"]) {
                        const [, ...path] = values.items["$ref"].split("/")
                        concept = path[path.length - 1]
                        if (values.type === "array") {
                          if (concept in fixtures.resources) {
                            //make the array key plural
                            let prop
                            if (property.slice(-1) !== "s") {
                              prop = property + "s"
                            } else {
                              prop = property
                            }

                            toSet[prop] = [fixtures.resources[concept]]
                          }
                        } else if (concept in fixtures.resources) {
                          toSet[property] = fixtures.resources[concept]
                        }
                      } else {
                        if (fixtures.resources[property]) {
                          toSet[property] = fixtures.resources[property]
                        } else if (values["$ref"]) {
                          const [, ...path] = values["$ref"].split("/")
                          toSet[property] =
                            fixtures.resources[path[path.length - 1]]
                        }
                      }

                      const json =
                        Object.keys(toSet).length > 0
                          ? JSON.stringify(toSet, undefined, 2)
                          : null

                      return {
                        property: property,
                        json: json,
                        ...values,
                      }
                    })
                  : null,
                description: values.description,
              }
            }
          ),
        }
      }),
    }
  })

  const nodeSections = nodePaths.reduce((acc, current) => {
    // Not bulleproof and kind of naive
    const section = current.methods.find(method => method.tags).tags[0]

    if (!section) {
      return acc
    }

    const existingSection = acc.find(s => s.section.section_name === section)

    //Because section_name does not always equal the resourceId
    const tag = tags.find(
      tag => tag.name.toLowerCase() === section.toLowerCase()
    )

    let resourceId
    if (tag) resourceId = tag["x-resourceId"]

    const schema =
      node.components.schemas[section.toLowerCase()] ||
      node.components.schemas[resourceId] ||
      null

    //Create a schemaNode so we can access descriptions and attributes of objects
    let schemaNode
    if (schema) {
      let props = []

      Object.entries(schema.properties).map(([key, values]) => {
        let ref = null
        let component_id = null
        let nestedModelNode = null

        let { items, anyOf, oneOf, ...rest } = values
        if (items || anyOf || oneOf) {
          if (items?.anyOf) {
            component_id = items.anyOf[0]["$ref"].substring(
              items.anyOf[0]["$ref"].lastIndexOf("/") + 1
            )
            ref = node.components.schemas[component_id]
          } else if (items) {
            const refPath = items["$ref"]
            if (refPath) {
              component_id = refPath.substring(
                items["$ref"].lastIndexOf("/") + 1
              )
              ref = node.components.schemas[component_id]
            }
          } else if (anyOf) {
            component_id = anyOf[0]["$ref"].substring(
              anyOf[0]["$ref"].lastIndexOf("/") + 1
            )
            ref = node.components.schemas[component_id]
          }
          if (ref) {
            const { properties, ...rest } = ref
            let nestedModelProperties = []
            if (properties) {
              Object.entries(properties).map(([key, values]) => {
                nestedModelProperties.push({
                  property: key,
                  ...values,
                })
              })
              nestedModelNode = {
                properties: nestedModelProperties,
                ...rest,
              }
            }
          }
        }
        props.push({
          property: key,
          nestedModel: nestedModelNode,
          ...rest,
        })
      })

      let object = fixtures.resources[resourceId] || null

      if (object) object = JSON.stringify(object, undefined, 2)

      schemaNode = {
        object: object,
        description: schema.description,
        properties: props,
      }
    }

    /** We want the query to return the following:
     *
     * sections [
     *  section: {
     *    section_name: Orders
     *    paths: [<array-of-paths>]
     *  }
     * ]
     *
     * The reason that we wrap it in a section is so the query returns Section type, the alternative is
     * sections [
     *  Order: {...},
     *  Customer: {...}
     *  ...
     * ]
     *
     * Which isn't structured as a reuseable type
     */
    if (!existingSection) {
      acc.push({
        section: {
          section_name: section,
          paths: [{ ...current }],
          schema: schemaNode,
        },
      })
    } else {
      existingSection.section.paths.push({ ...current })
    }

    //acc[section].section[current.name] = { ...current }

    return acc
  }, [])

  const result = {
    name: name,
    paths: nodePaths,
    sections: nodeSections,
    rawNode: node,

    // required fields
    id: name,
    parent: null, // or null if it's a source node without a parent
    children: [],
    internal: {
      type: name,
      contentDigest: `store-api-${node.internal.contentDigest}`,
      mediaType: node.internal.mediaType, // optional
      content: node.internal.content, // optional
      description: `A cleaned version of file-system-api json files`, // optional
    },
  }

  createNode(result)
}

exports.onCreateNode = ({ node, getNode, actions }) => {
  const { createNodeField, createNode } = actions
  if (node.internal.type === `MarkdownRemark`) {
    const slug = createFilePath({ node, getNode })
    createNodeField({
      node,
      name: `slug`,
      value: slug,
    })
  }

  if (node.internal.type === "ApiJson" && node.components) {
    if (node.info.title === "Medusa Storefront API") {
      createCustomNode({ name: "Store", node: node, createNode: createNode })
    }
    if (node.info.title === "Medusa Admin API") {
      createCustomNode({ name: "Admin", node: node, createNode: createNode })
    }
  }
}

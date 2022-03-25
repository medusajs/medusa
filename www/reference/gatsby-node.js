const path = require(`path`)
const { createFilePath } = require(`gatsby-source-filesystem`)
const fixtures = require("../../docs/api/fixtures.json")

const convertToKebabCase = string => {
  return string
    .replace(/\s+/g, "-")
    .replace("'", "")
    .replace(".", "")
    .replace('"', "")
    .toLowerCase()
}

const createCustomNode = ({ name, node, createNode }) => {
  const tags = node.tags
  const nodePaths = Object.entries(node.paths).map(([path, values]) => {
    return {
      name: path,
      methods: Object.entries(values).map(([method, values]) => {
        let requestBodyValues = undefined

        if (values.requestBody && values.requestBody.content) {
          requestBodyValues =
            values.requestBody.content["application/json"].schema
        }

        return {
          method: method,
          ...values,
          requestBody: {
            required: requestBodyValues
              ? requestBodyValues.required
              : undefined,
            type: requestBodyValues ? requestBodyValues.type : undefined,
            properties: Object.entries(
              requestBodyValues ? requestBodyValues.properties : {}
            ).map(([property, values]) => {
              let ref = null
              let component_id = null
              let nestedModelNode = null
              const { items, anyOf, oneOf, ...rest } = values
              if (items || anyOf || oneOf) {
                if (items && items.anyOf) {
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
            }),
          },

          responses: Object.entries(values.responses).map(
            ([response, values]) => {
              let properties = undefined

              if (values && values.content) {
                properties =
                  values.content["application/json"].schema.properties
              }

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
          if (items && items.anyOf) {
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

const createAllPages = (sections, api, siteData, createPage, template) => {
  sections.forEach(edge => {
    const baseURL = convertToKebabCase(edge.section.section_name)
    createPage({
      path: `api/${api}/${baseURL}`,
      component: template,
      context: {
        data: siteData.data[api],
        api: api,
        title: edge.section.section_name,
        description: edge.section.schema ? edge.section.schema.description : "",
        to: { section: baseURL, method: null, sectionObj: edge.section },
      },
    })
    edge.section.paths.forEach(p => {
      p.methods.forEach(method => {
        const methodURL = convertToKebabCase(method.summary)
        createPage({
          path: `api/${api}/${baseURL}/${methodURL}`,
          component: template,
          context: {
            data: siteData.data[api],
            api: api,
            title: method.summary,
            description: method.description || "",
            to: { section: baseURL, method: methodURL, sectionObj: edge.section },
          },
        })
      })
    })
  })
}

exports.createPages = ({ graphql, actions }) => {
  const { createPage } = actions
  const template = path.resolve(`src/templates/reference-page.js`)
  // Query for markdown nodes to use in creating pages.
  // You can query for whatever data you want to create pages for e.g.
  // products, portfolio items, landing pages, etc.
  // Variables can be added as the second function parameter
  return graphql(
    `
      query Pages {
        admin {
          sections {
            section {
              section_name
              paths {
                name
                methods {
                  tags
                  summary
                  description
                  method
                  operationId
                  responses {
                    status
                    description
                    content {
                      _ref
                      type
                      property
                      description
                      json
                      items {
                        type
                        _ref
                      }
                    }
                  }
                  requestBody {
                    type
                    required
                    properties {
                      description
                      enum
                      format
                      property
                      type
                      nestedModel {
                        title
                        properties {
                          property
                          type
                          description
                        }
                      }
                    }
                  }

                  parameters {
                    description
                    in
                    name
                    required
                    schema {
                      type
                    }
                  }
                }
              }
              schema {
                object
                description
                properties {
                  property
                  type
                  description
                  format
                  nestedModel {
                    title
                    properties {
                      property
                      type
                      description
                    }
                  }
                }
              }
            }
          }
        }
        store {
          sections {
            section {
              section_name
              paths {
                name
                methods {
                  tags
                  summary
                  description
                  method
                  operationId
                  responses {
                    status
                    description
                    content {
                      _ref
                      property
                      description
                      json
                      items {
                        _ref
                      }
                    }
                  }
                  requestBody {
                    type
                    required
                    properties {
                      description
                      property
                      type
                      nestedModel {
                        title
                        properties {
                          property
                          type
                        }
                      }
                    }
                  }
                  parameters {
                    description
                    in
                    name
                    required
                    schema {
                      type
                    }
                  }
                }
              }
              schema {
                object
                description
                properties {
                  property
                  type
                  description
                  format
                  nestedModel {
                    title
                    properties {
                      property
                      type
                    }
                  }
                }
              }
            }
          }
        }
      }
    `,
    { limit: 1000 }
  ).then(result => {
    if (result.errors) {
      throw result.errors
    }

    //create entrypoint
    createPage({
      path: `api`,
      component: template,
      context: {
        data: result.data.store,
        api: "store",
        title: "Store",
        description: "Storefront API",
      },
    })

    const apis = [
      { title: "Store", description: "Storefront API", slug: "store" },
      { title: "Admin", description: "Admin API", slug: "admin" },
    ]

    apis.forEach(api => {
      //create main page for API
      createPage({
        path: `api/${api.slug}`,
        component: template,
        context: {
          data: result.data[api.slug],
          api: api.slug,
          title: api.title,
          description: api.description,
        },
      })
      //create pages for all sections and methods
      createAllPages(
        result.data[api.slug].sections,
        api.slug,
        result,
        createPage,
        template
      )
    })
  })
}

const path = require(`path`)
const { createFilePath } = require(`gatsby-source-filesystem`)

const createCustomNode = ({ name, node, createNode }) => {
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
                const items = values.items

                return {
                  ...values,
                  property: property,

                  items: {
                    ...items,
                    type: items?.type,
                    properties: items?.properties
                      ? Object.entries(items?.properties).map(
                          ([property, values]) => {
                            return {
                              property: property,
                              ...values,
                            }
                          }
                        )
                      : null,
                  },
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
                      return { property: property, ...values }
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
        },
      })
    } else {
      existingSection.section.paths.push({ ...current })
    }

    //acc[section].section[current.name] = { ...current }

    return acc
  }, [])

  console.log("Creating result")
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

  console.log("Result: ", result)

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
    console.log(node.info)
    if (node.info.title === "Medusa Storefront API") {
      console.log("creating node")
      createCustomNode({ name: "Store", node: node, createNode: createNode })
    }
    if (node.info.title === "Medusa Admin API") {
      createCustomNode({ name: "Admin", node: node, createNode: createNode })
    }
  }
}

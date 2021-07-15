const path = require(`path`)
const { createFilePath } = require(`gatsby-source-filesystem`)
const adminDoc = require("../../docs/api/admin-spec3.json")
const storeFront = require("../../docs/api/store-spec3.json")
const rawSpec = require("../../docs/api/admin-spec3.json")
const convertToKebabCase = string => {
  return string.replace(/\s+/g, "-").toLowerCase()
}
const memo = {}
const followRef = ref => {
  if (ref in memo) {
    return memo[ref]
  }
  const [, ...path] = ref.split("/")
  let cleanDets = rawSpec
  for (const part of path) {
    if (part === "#") continue
    cleanDets = cleanDets[part]
  }
  memo[ref] = cleanDets
  return cleanDets
}
const dereffed = {}
const derefSchema = (schema, spec) => {
  if (!schema) {
    return {}
  }
  if ("x-resourceId" in schema && schema["x-resourceId"] in dereffed) {
    return dereffed[schema["x-resourceId"]]
  }
  const dereffedProps = {}
  if (schema.properties) {
    for (let [key, details] of Object.entries(schema.properties)) {
      if (details.type === "array") {
        details.items = derefSchema(details.items, spec)
      }
      if (details.anyOf) {
        details.anyOf = details.anyOf.map(ao => derefSchema(ao, spec))
      }
      dereffedProps[key] = details
    }
  }
  if (schema.$ref) {
    return followRef(schema.$ref)
  }
  schema.properties = dereffedProps
  return schema
}
const createTagNode = (tag, createContentDigest) => {
  const resourceId = tag["x-resourceId"]
  const schema = rawSpec.components.schemas[tag["x-resourceId"]]
  return Object.assign(
    {},
    {
      id: convertToKebabCase(tag.name),
      title: tag.name,
      resourceId,
      schema: JSON.stringify(derefSchema(schema)),
      parent: null,
      children: [],
      internal: {
        type: "APITag",
        content: JSON.stringify(tag),
        contentDigest: createContentDigest(JSON.stringify(tag)),
      },
    }
  )
}
const createEndpointNode = (endpoint, createContentDigest) => {
  const tagKey = endpoint.tags[0]
  return Object.assign(
    {},
    {
      id: endpoint.operationId,
      method: endpoint.method,
      path: endpoint.path,
      summary: endpoint.summary,
      description: endpoint.description,
      parent: convertToKebabCase(tagKey),
      internal: {
        type: "APIEndpoint",
        content: JSON.stringify(endpoint),
        contentDigest: createContentDigest(JSON.stringify(endpoint)),
      },
    }
  )
}
exports.sourceNodes = async ({ actions, createContentDigest }) => {
  const { createNode } = actions
  for (const tag of rawSpec.tags) {
    const tagNode = createTagNode(tag, createContentDigest)
    createNode(tagNode)
  }
  for (const [path, methods] of Object.entries(rawSpec.paths)) {
    for (const [method, specification] of Object.entries(methods)) {
      const endpointNode = createEndpointNode(
        {
          method: method.toUpperCase(),
          path,
          ...specification,
        },
        createContentDigest
      )
      createNode(endpointNode)
    }
  }
}

exports.onCreateNode = ({ node, getNode, actions }) => {
  const { createNodeField } = actions
  if (node.internal.type === `MarkdownRemark`) {
    const slug = createFilePath({ node, getNode })
    createNodeField({
      node,
      name: `slug`,
      value: slug,
    })
  }
}

exports.createPages = async ({ graphql, actions }) => {
  const { createPage } = actions
  const result = await graphql(`
    query {
      allMarkdownRemark {
        edges {
          node {
            fields {
              slug
            }
            frontmatter {
              title
            }
          }
        }
      }
    }
  `)

  const posts = result.data.allMarkdownRemark.edges

  posts.forEach(({ node }, index) => {
    const previous = index === posts.length - 1 ? null : posts[index + 1].node
    const next = index === 0 ? null : posts[index - 1].node

    createPage({
      path: node.fields.slug,
      component: path.resolve(`./src/templates/docs.js`),
      context: {
        // Data passed to context is available
        // in page queries as GraphQL variables.
        slug: node.fields.slug,
        previous,
        next,
      },
    })
  })
}

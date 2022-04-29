module.exports = (inputSchema) => ({
  ...inputSchema,
  paths: Object.entries(inputSchema.paths).reduce(
    (acc, [path, pathItem]) => ({
      ...acc,
      // add /admin prefix to all admin paths
      [`/admin${path}`]: pathItem,
    }),
    {}
  ),
})

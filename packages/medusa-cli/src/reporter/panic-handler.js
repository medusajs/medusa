export const panicHandler = (panicData = {}) => {
  const { id, context } = panicData
  switch (id) {
    case "10000":
      return {
        message: `Looks like you provided a URL as your project name. Try "medusa new my-medusa-store ${context.rootPath}" instead.`,
      }
    case "10001":
      return {
        message: `Looks like you provided a URL as your project name. Try "medusa new my-medusa-store ${context.rootPath}" instead.`,
      }
    case "10002":
      return {
        message: `Could not create project because ${context.path} is not a valid path.`,
      }
    case "10003":
      return {
        message: `Directory ${context.rootPath} is already a Node project.`,
      }
    default:
      return {
        message: "Unknown error",
      }
  }
}

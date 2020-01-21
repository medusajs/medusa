import { Lifetime } from "awilix"

/**
 * Registers all services in the services directory
 */
export default ({ container }) => {
  let loadPath = "src/services/*.js"

  if (process.env.NODE_ENV === "test") {
    loadPath = "src/services/__mocks__/*.js"
  }

  // service/auth.js -> authService
  container.loadModules([loadPath], {
    resolverOptions: {
      lifetime: Lifetime.SINGLETON,
    },
    formatName: (rawname, descriptor) => {
      const parts = rawname.split("-").map((n, index) => {
        if (index !== 0) {
          return n.charAt(0).toUpperCase() + n.slice(1)
        }
        return n
      })
      const name = parts.join("")

      const splat = descriptor.path.split("/")

      let offset = 2
      if (process.env.NODE_ENV === "test") {
        offset = 3
      }

      const namespace = splat[splat.length - offset]
      const upperNamespace =
        namespace.charAt(0).toUpperCase() + namespace.slice(1, -1)
      return name + upperNamespace
    },
  })
}

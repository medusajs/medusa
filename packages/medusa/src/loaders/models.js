import { Lifetime } from "awilix"

/**
 * Registers all models in the model directory
 */
export default ({ container }) => {
  // service/auth.js -> authService
  container.loadModules(["src/models/*.js"], {
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
      const namespace = splat[splat.length - 2]
      const upperNamespace =
        namespace.charAt(0).toUpperCase() + namespace.slice(1, -1)
      return name + upperNamespace
    },
  })
}

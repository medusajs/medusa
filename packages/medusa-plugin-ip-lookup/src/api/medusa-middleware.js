export default {
  preCartCreation: async function (req, res, next) {
    try {
      if (req.body.region_id) {
        next()
        return
      }

      const ipLookupService = req.scope.resolve("ipLookupService")
      const regionService = req.scope.resolve("regionService")

      const ip = req.headers["x-forwarded-for"] || req.connection.remoteAddress

      const { data } = await ipLookupService.lookupIp(ip)

      if (!data.country_code) {
        next()
        return
      }

      const region = await regionService
        .retrieveByCountryCode(data.country_code)
        .catch(() => void 0)

      if (!region) {
        next()
        return
      }

      req.body.region_id = region.id
      req.body.country_code = data.country_code.toLowerCase()

      next()
    } catch (error) {
      next()
    }
  },
}

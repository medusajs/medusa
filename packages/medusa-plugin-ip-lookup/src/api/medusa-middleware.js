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

      const country = await regionService
        .validateCountry(data.country_code)
        .catch(() => void 0)

      if (!country) {
        next()
        return
      }

      req.body.region_id = country.region_id
      req.body.country_code = country.iso_2

      next()
    } catch (error) {
      next()
    }
  },
}

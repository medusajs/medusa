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

      console.log(ip)

      const { data } = await ipLookupService.lookupIp(ip)

      console.log(data)

      if (!data.country_code) {
        next()
        return
      }

      // Find region using the country code from ip lookup
      const regions = await regionService.list({
        countries: data.country_code,
      })

      console.log(regions)

      // If this region exists, add it to the body of the cart creation request
      if (regions[0]) {
        req.body.region_id = regions[0]._id.toString()
      }

      next()
    } catch (error) {
      next()
    }
  },
}

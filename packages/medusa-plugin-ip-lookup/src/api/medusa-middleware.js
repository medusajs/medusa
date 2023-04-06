export default {
  preCartCreation: async function (req, res, next) {
    try {
      if (req.body.region_id) {
        next()
        return
      }

      const ipLookupService = req.scope.resolve("ipLookupService")
      const manager = req.scope.resolve("manager")
      const countryRepository = req.scope.resolve("countryRepository")

      const ip = req.headers["x-forwarded-for"] || req.connection.remoteAddress

      const { data } = await ipLookupService.lookupIp(ip)

      if (!data.country_code) {
        next()
        return
      }

      const countryRepo = manager.getCustomRepository(countryRepository)
      const country = await countryRepo.findOne({
        where: { iso_2: data.country_code.toLowerCase() },
      })

      // If country exists, add it to the body of the cart creation request
      if (country?.region_id) {
        req.body.region_id = country.region_id
        req.body.country_code = country.iso_2
      }

      next()
    } catch (error) {
      next()
    }
  },
}

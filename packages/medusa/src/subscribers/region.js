class RegionSubscriber {
  constructor({
    manager,
    countryRepository,
    regionRepository,
    eventBusService,
  }) {
    this.manager_ = manager

    this.countryRepository_ = countryRepository

    this.regionRepository_ = regionRepository

    this.eventBus_ = eventBusService

    this.eventBus_.subscribe("region.deleted", this.removeRegionFromCountries)
  }

  removeRegionFromCountries = async (data) => {
    const countryRepo = this.manager_.getCustomRepository(
      this.countryRepository_
    )

    await countryRepo.update({ region_id: data.id }, { region_id: null })
  }
}

export default RegionSubscriber

describe.skip("default", () => {
  /*describe("sales channel default", () => {
    let featureFlagRouter
    const container = createContainer()

    beforeAll(async () => {
      featureFlagRouter = await featureFlagsLoader(
        {
          featureFlags: {
            sales_channels: true,
          },
        },
        Logger
      )

      container.register({
        storeService: asValue(StoreServiceMock),
        currencyRepository: asValue(MockRepository()),
        countryRepository: asValue(
          MockRepository({
            count: jest.fn().mockImplementation(() => 1),
          })
        ),
        shippingProfileService: asValue(ShippingProfileServiceMock),
        salesChannelService: asValue(SalesChannelServiceMock),
        logger: asValue(Logger),
        featureFlagRouter: asValue(featureFlagRouter),
        manager: asValue(MockManager),
        paymentProviders: asValue([]),
        paymentProviderService: asValue(PaymentProviderServiceMock),
        notificationProviders: asValue([]),
        notificationService: asValue({
          withTransaction: function () {
            return this
          },
          registerInstalledProviders: jest.fn(),
        }),
        fulfillmentProviders: asValue([]),
        fulfillmentProviderService: asValue({
          withTransaction: function () {
            return this
          },
          registerInstalledProviders: jest.fn(),
        }),
        taxProviders: asValue([]),
        taxProviderService: asValue({
          withTransaction: function () {
            return this
          },
          registerInstalledProviders: jest.fn(),
        }),
      })
    })

    it("should create a new default sales channel attach to the store", async () => {
      await defaultLoader({ container })
      expect(SalesChannelServiceMock.createDefault).toHaveBeenCalledTimes(1)
      expect(SalesChannelServiceMock.createDefault).toHaveBeenCalledTimes(1)
    })
  })*/
})

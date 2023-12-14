import {
  mockContainer,
  nonExistingCurrencyCode,
} from "../__fixtures__/currency"

const code = "existing-currency"

describe("Currency service", function () {
  beforeEach(function () {
    jest.clearAllMocks()
  })

  it("should retrieve a currency", async function () {
    const currencyService = mockContainer.resolve("currencyService")
    const currencyRepository = mockContainer.resolve("currencyRepository")

    await currencyService.retrieve(code)

    expect(currencyRepository.find).toHaveBeenCalledWith(
      {
        where: {
          code,
        },
        options: {
          fields: undefined,
          limit: 15,
          offset: 0,
          populate: [],
        },
      },
      expect.any(Object)
    )
  })

  it("should fail to retrieve a currency", async function () {
    const currencyService = mockContainer.resolve("currencyService")
    const currencyRepository = mockContainer.resolve("currencyRepository")

    const err = await currencyService
      .retrieve(nonExistingCurrencyCode)
      .catch((e) => e)

    expect(currencyRepository.find).toHaveBeenCalledWith(
      {
        where: {
          code: nonExistingCurrencyCode,
        },
        options: {
          fields: undefined,
          limit: 15,
          offset: 0,
          populate: [],
          withDeleted: undefined,
        },
      },
      expect.any(Object)
    )

    expect(err.message).toBe(
      `Currency with code: ${nonExistingCurrencyCode} was not found`
    )
  })

  it("should list currencys", async function () {
    const currencyService = mockContainer.resolve("currencyService")
    const currencyRepository = mockContainer.resolve("currencyRepository")

    const filters = {}
    const config = {
      relations: [],
    }

    await currencyService.list(filters, config)

    expect(currencyRepository.find).toHaveBeenCalledWith(
      {
        where: {},
        options: {
          fields: undefined,
          limit: 15,
          offset: 0,
          populate: [],
          withDeleted: undefined,
        },
      },
      expect.any(Object)
    )
  })

  it("should list currencys with filters", async function () {
    const currencyService = mockContainer.resolve("currencyService")
    const currencyRepository = mockContainer.resolve("currencyRepository")

    const filters = {
      tags: {
        value: {
          $in: ["test"],
        },
      },
    }
    const config = {
      relations: [],
    }

    await currencyService.list(filters, config)

    expect(currencyRepository.find).toHaveBeenCalledWith(
      {
        where: {
          tags: {
            value: {
              $in: ["test"],
            },
          },
        },
        options: {
          fields: undefined,
          limit: 15,
          offset: 0,
          populate: [],
          withDeleted: undefined,
        },
      },
      expect.any(Object)
    )
  })

  it("should list currencys with filters and relations", async function () {
    const currencyService = mockContainer.resolve("currencyService")
    const currencyRepository = mockContainer.resolve("currencyRepository")

    const filters = {
      tags: {
        value: {
          $in: ["test"],
        },
      },
    }
    const config = {
      relations: ["tags"],
    }

    await currencyService.list(filters, config)

    expect(currencyRepository.find).toHaveBeenCalledWith(
      {
        where: {
          tags: {
            value: {
              $in: ["test"],
            },
          },
        },
        options: {
          fields: undefined,
          limit: 15,
          offset: 0,
          withDeleted: undefined,
          populate: ["tags"],
        },
      },
      expect.any(Object)
    )
  })

  it("should list and count the currencys with filters and relations", async function () {
    const currencyService = mockContainer.resolve("currencyService")
    const currencyRepository = mockContainer.resolve("currencyRepository")

    const filters = {
      tags: {
        value: {
          $in: ["test"],
        },
      },
    }
    const config = {
      relations: ["tags"],
    }

    await currencyService.listAndCount(filters, config)

    expect(currencyRepository.findAndCount).toHaveBeenCalledWith(
      {
        where: {
          tags: {
            value: {
              $in: ["test"],
            },
          },
        },
        options: {
          fields: undefined,
          limit: 15,
          offset: 0,
          withDeleted: undefined,
          populate: ["tags"],
        },
      },
      expect.any(Object)
    )
  })
})

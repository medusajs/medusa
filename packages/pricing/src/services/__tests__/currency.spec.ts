import {
  currencyRepositoryMock,
  nonExistingCurrencyCode,
} from "../__fixtures__/currency"
import { createMedusaContainer } from "@medusajs/utils"
import { asValue } from "awilix"
import ContainerLoader from "../../loaders/container"
import { MedusaContainer } from "@medusajs/types"

const code = "existing-currency"

describe("Currency service", function () {
  let container: MedusaContainer

  beforeEach(async function () {
    jest.clearAllMocks()

    container = createMedusaContainer()
    container.register("manager", asValue({}))

    await ContainerLoader({ container })

    container.register(currencyRepositoryMock)
  })

  it("should retrieve a currency", async function () {
    const currencyService = container.resolve("currencyService")
    const currencyRepository = container.resolve("currencyRepository")

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
    const currencyService = container.resolve("currencyService")
    const currencyRepository = container.resolve("currencyRepository")

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
    const currencyService = container.resolve("currencyService")
    const currencyRepository = container.resolve("currencyRepository")

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
    const currencyService = container.resolve("currencyService")
    const currencyRepository = container.resolve("currencyRepository")

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
    const currencyService = container.resolve("currencyService")
    const currencyRepository = container.resolve("currencyRepository")

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

  it("should list and count the currencies with filters and relations", async function () {
    const currencyService = container.resolve("currencyService")
    const currencyRepository = container.resolve("currencyRepository")

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

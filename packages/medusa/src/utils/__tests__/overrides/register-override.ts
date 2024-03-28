import { registerOverride, registeredOverrides } from '../../'

describe("registerOverride", () => {
  let key, override, error

  it('should return 0 registered overrides', () => {
    expect(registeredOverrides.size).toBe(0)
  })

  afterEach(() => {
    registeredOverrides.clear()
  })

  describe("key - 'api/routes/store/products/index'", () => {
    beforeEach(() => {
      key = 'api/routes/store/products/index'
      override = {
        allowed: ['custom_attribute'],
        default: ['custom_attribute'],
      }

      registerOverride({
        key,
        override
      })
    })

    it('should return 1 registered overrides', () => {
      expect(registeredOverrides.size).toBe(1)
    })

    it('should return registered overrides from the map', () => {
      const overridden = registeredOverrides.get(key)

      expect(overridden?.default).toEqual(['custom_attribute'])
      expect(overridden?.allowed).toEqual(['custom_attribute'])
    })
  })

  describe("key - ''", () => {
    beforeEach(() => {
      key = ''
      override = {
        allowed: ['custom_attribute'],
        default: ['custom_attribute'],
      }

      try {
        registerOverride({
          key,
          override
        })
      } catch (e) {
        error = e
      }
    })

    it('should return 0 registered overrides', () => {
      expect(registeredOverrides.size).toBe(0)
    })

    it('throws an error with message', () => {
      expect(error.message).toEqual("`key` for registerOverride not found")
    })
  })
})

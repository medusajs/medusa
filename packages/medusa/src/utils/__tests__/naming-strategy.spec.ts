import { ShortenedNamingStrategy } from "../naming-strategy"

describe('ShortenedNamingStrategy', () => {
  let strategy: ShortenedNamingStrategy

  beforeAll(() => {
    strategy = new ShortenedNamingStrategy()
  })

  describe('eagerJoinRelationAlias', () => {
    it('should join alias and property path by "__"', () => {
      const result = strategy.eagerJoinRelationAlias('testAlias', 'test.propertyPath')
      expect(result).toBe('testAlias_te_pr')
    })

    it('should join alias and property path by "__" and not exceed MAX_ALIAS_NAME_LENGTH', () => {
      const result = strategy.eagerJoinRelationAlias(
        'testAlias_dfahsljf_fjaesklfehns_fjalofekishn_fjaesolfaehnk_faekhfejabwn_fjaelfvekhnagaekjlwbn',
        'test.propertyPath'
      )
      expect(result).toMatch(/testAlias_dfahsljf_fjaesklfehns_fjalofekishn_fjaesolfaehn\d{5}/)
      expect(result).toHaveLength(63)
    })
  })
})

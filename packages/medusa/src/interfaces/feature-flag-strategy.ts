export interface IFeatureFlagService {
  isSet(flagName: string): boolean
}

export abstract class AbstractFeatureFlagStrategy
  implements IFeatureFlagService
{
  abstract isSet(flagName: string): boolean
}

export const isFeatureFlagStrategy = (object: unknown): boolean => {
  return object instanceof AbstractFeatureFlagStrategy
}

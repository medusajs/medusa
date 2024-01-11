export abstract class AbstractAuthenticationModuleProvider {
  public static PROVIDER: string
  public static DISPLAY_NAME: string

  abstract authenticate(
    data: Record<string, unknown>
  ): Promise<Record<string, unknown>>
}

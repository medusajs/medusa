export class ModuleProviderService {
  static identifier = "provider-1"

  constructor(
    public container: Record<any, any>,
    public options: Record<any, any>
  ) {}
}

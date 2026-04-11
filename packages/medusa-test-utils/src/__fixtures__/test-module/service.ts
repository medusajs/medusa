export default class TestService {
  private dependencies: Record<string, any>
  private options: any

  constructor(dependencies: Record<string, any>, options: any) {
    this.dependencies = dependencies
    this.options = options
  }

  async getDependencies(): Promise<Record<string, any>> {
    return this.dependencies
  }

  async getOptions(): Promise<any> {
    return this.options
  }
}

export default class InternalService {
  private dependencies: Record<string, any>

  constructor(dependencies: Record<string, any>) {
    this.dependencies = dependencies
  }

  async getDependencies(): Promise<Record<string, any>> {
    return this.dependencies
  }
}

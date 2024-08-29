const service = class TestService {
  static validateOptions(options: Record<any, any>) {
    throw new Error("Wrong options")
  }
}

export default {
  services: [service],
}

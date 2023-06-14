/**
 * `KeyManager` holds API keys in state.
 */
class KeyManager {
  private publishableApiKey: string | null = null

  /**
   * Set a publishable api key to be sent with each request.
   */
  public registerPublishableApiKey(key: string) {
    this.publishableApiKey = key
  }

  /**
   * Retrieve the publishable api key.
   */
  public getPublishableApiKey() {
    return this.publishableApiKey
  }
}

/**
 * Export singleton instance.
 */
export default new KeyManager()

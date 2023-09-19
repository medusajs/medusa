/**
 * `JwtTokenManager` holds JWT tokens in state.
 */
class JwtTokenManager {
  private adminJwt: string | null = null;
  private storeJwt: string | null = null;

  /**
   * Set a store or admin jwt token to be sent with each request.
   */
  public registerJwt(token: string, domain: "admin" | "store") {
    if (domain === "admin") {
      this.adminJwt = token;
    } else {
      this.storeJwt = token;
    }
  }

  /**
   * Retrieve the store or admin jwt token
   */
  public getJwt(domain: "admin" | "store") {
    return domain === "admin" ? this.adminJwt : this.storeJwt;
  }
}

/**
 * Export singleton instance.
 */
export default new JwtTokenManager()

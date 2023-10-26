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
    } else if (domain === "store") {
      this.storeJwt = token;
    } else {
      throw new Error(`'domain' must be wither 'admin' or 'store' received ${domain}`)
    }
  }

  /**
   * Retrieve the store or admin jwt token
   */
  public getJwt(domain: "admin" | "store") {
    if (domain === "admin") {
      return this.adminJwt;
    } else if (domain === "store") {
      return this.storeJwt;
    } else {
      throw new Error(`'domain' must be wither 'admin' or 'store' received ${domain}`)
    }
  }
}

/**
 * Export singleton instance.
 */
export default new JwtTokenManager()

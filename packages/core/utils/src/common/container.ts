export const ContainerRegistrationKeys = {
  PG_CONNECTION: "__pg_connection__",
  MANAGER: "manager",
  CONFIG_MODULE: "configModule",
  LOGGER: "logger",
  REMOTE_QUERY: "remoteQuery",
  QUERY: "query",
  /**
   * @deprecated use {@link ContainerRegistrationKeys.LINK} instead.
   */
  REMOTE_LINK: "remoteLink",
  /**
   * @since 2.2.0
   */
  LINK: "link",
  FEATURE_FLAG_ROUTER: "featureFlagRouter",
  // @internal
  LICENSE: "license",
} as const

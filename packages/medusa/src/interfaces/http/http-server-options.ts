import {
  CorsOptions,
  CorsOptionsDelegate,
  HttpsOptions
} from './http-server';

/**
 * @publicApi
 */
export interface HttpServerOptions {
  /**
   * CORS options from [CORS package](https://github.com/expressjs/cors#configuration-options)
   */
  cors?: boolean | CorsOptions | CorsOptionsDelegate<any>;
  /**
   * Whether to use underlying platform body parser.
   */
  bodyParser?: boolean;
  /**
   * Set of configurable HTTPS options
   */
  httpsOptions?: HttpsOptions;
}
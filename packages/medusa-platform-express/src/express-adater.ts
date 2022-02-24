import {
  CorsOptions,
  CorsOptionsDelegate,
  AbstractHttpAdapter,
  RouterMethodFactory,
  StreamableFile,
  RequestMethod,
  HttpServerOptions
} from '@medusajs/medusa/dist/interfaces/http';
import {
  json as bodyParserJson,
  urlencoded as bodyParserUrlencoded,
} from 'body-parser';
import cookieParser from "cookie-parser";
import cors from 'cors';
import express, { Request, Response } from 'express';
import * as http from 'http';
import * as https from 'https';
import { ServeStaticOptions } from './types';

function isObject(val: any): val is object {
  return typeof val !== undefined && val !== null && typeof val === 'object'
}

export class ExpressAdapter extends AbstractHttpAdapter {
  private readonly routerMethodFactory = new RouterMethodFactory();

  constructor(instance?: any) {
    super(instance || express());
  }

  public send(response: Response, body: any, statusCode?: number) {
    if (statusCode) {
      response.status(statusCode);
    }
    if (typeof body === undefined || body === null) {
      return response.send();
    }
    if (body instanceof StreamableFile) {
      const streamHeaders = body.getHeaders();
      if (response.getHeader('Content-Type') === undefined) {
        response.setHeader('Content-Type', streamHeaders.type);
      }
      if (response.getHeader('Content-Disposition') === undefined) {
        response.setHeader('Content-Disposition', streamHeaders.disposition);
      }
      return body.getStream().pipe(response);
    }
    return isObject(body) ? response.json(body) : response.send(String(body));
  }

  public status(response: Response, statusCode: number) {
    return response.status(statusCode);
  }

  public render(response: Response, view: string, options: any) {
    return response.render(view, options);
  }

  public redirect(response: Response, statusCode: number, url: string) {
    return response.redirect(statusCode, url);
  }

  public setErrorHandler(handler: Function, prefix?: string) {
    return this.use(handler);
  }

  public setNotFoundHandler(handler: Function, prefix?: string) {
    return this.use(handler);
  }

  public setHeader(response: Response, name: string, value: string) {
    return response.set(name, value);
  }

  public listen(port: string | number, callback?: () => void);
  public listen(port: string | number, hostname: string, callback?: () => void);
  public listen(port: any, ...args: any[]) {
    return this.httpServer.listen(port, ...args);
  }

  public close() {
    if (!this.httpServer) {
      return undefined;
    }
    return new Promise(resolve => this.httpServer.close(resolve));
  }

  public set(...args: any[]) {
    return this.instance.set(...args);
  }

  public enable(...args: any[]) {
    return this.instance.enable(...args);
  }

  public disable(...args: any[]) {
    return this.instance.disable(...args);
  }

  public engine(...args: any[]) {
    return this.instance.engine(...args);
  }

  public useStaticAssets(path: string, options: ServeStaticOptions) {
    if (options && options.prefix) {
      return this.use(options.prefix, express.static(path, options));
    }
    return this.use(express.static(path, options));
  }

  public setBaseViewsDir(path: string | string[]) {
    return this.set('views', path);
  }

  public setViewEngine(engine: string) {
    return this.set('view engine', engine);
  }

  public getRequestHostname(request: Request): string {
    return request.hostname;
  }

  public getRequestMethod(request: Request): string {
    return request.method;
  }

  public getRequestUrl(request: Request): string {
    return request.originalUrl;
  }

  public enableTrustProxy() {
    return this.set('trust proxy', 1);
  }

  public enableCors(options: CorsOptions | CorsOptionsDelegate<any>) {
    return this.use(cors(options));
  }

  public createMiddlewareFactory(
    requestMethod: RequestMethod,
  ): (path: string, callback: Function) => any {
    return this.routerMethodFactory
      .get(this.instance, requestMethod)
      .bind(this.instance);
  }

  public initHttpServer(options: HttpServerOptions) {
    const isHttpsEnabled = options && options.httpsOptions;
    if (isHttpsEnabled) {
      this.httpServer = https.createServer(
        options.httpsOptions,
        this.getInstance(),
      );
      return;
    }
    this.httpServer = http.createServer(this.getInstance());
  }

  public registerParserMiddleware() {
    const parserMiddleware = {
      jsonParser: bodyParserJson(),
      urlencodedParser: bodyParserUrlencoded({ extended: true }),
      cookieParser: cookieParser()
    };
    Object.keys(parserMiddleware)
      .filter(parser => !this.isMiddlewareApplied(parser))
      .forEach(parserKey => this.use(parserMiddleware[parserKey]));
  }

  public setLocal(key: string, value: any) {
    this.instance.locals[key] = value;
    return this;
  }

  public getType(): string {
    return 'express';
  }

  private isMiddlewareApplied(name: string): boolean {
    const app = this.getInstance();
    return (
      !!app._router &&
      !!app._router.stack &&
      typeof app._router.stack.filter === 'function' &&
      app._router.stack.some(
        (layer: any) => layer && layer.handle && layer.handle.name === name,
      )
    );
  }
}
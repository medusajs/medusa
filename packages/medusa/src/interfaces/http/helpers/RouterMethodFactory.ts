import { HttpServer, RequestMethod } from '../http-server';

export class RouterMethodFactory {
  public get(target: HttpServer, requestMethod: RequestMethod): Function {
    switch (requestMethod) {
      case RequestMethod.POST:
        return target.post;
      case RequestMethod.ALL:
        return target.all;
      case RequestMethod.DELETE:
        return target.delete;
      case RequestMethod.PUT:
        return target.put;
      case RequestMethod.PATCH:
        return target.patch;
      case RequestMethod.OPTIONS:
        return target.options;
      case RequestMethod.HEAD:
        return target.head;
      case RequestMethod.GET:
        return target.get;
      default: {
        return target.use;
      }
    }
  }
}
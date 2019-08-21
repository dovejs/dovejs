import Koa from 'koa'

interface AppConifg {
  port?: number;
  keys?: string[];
  router?: {
    perfix?: string
  };
  controller: {
    dir: string
  };
}

interface Options {
  config: AppConifg;
}

declare class Dove extends Koa {
  constructor(options: Options);
  config: AppConifg;
  routes: any[];
  start(cb: () => void): void;
}

interface ActionParams {
  query: { [key: string]: string };
  body: { [key: string]: any };
  params: { [key: string]: any };
}

// type Action = (data: ActionParams) => Promise<any>

declare class Controller {
  constructor(app: Dove, ctx: Koa.Context);
  app: Dove;
  context: Koa.Context;
  body: any;
  // [key: string]: Dove | Koa.Context | Action | any;
}

type methodDecorator = (target: any, key: string) => void
type methodType = 'GET' | 'POST' | 'PUT' | 'DEL' | 'ALL' | 'OPTIONS'

declare const Decorators: {
  perfix: (perfix: string | '') => () => void;
  methods: {
    method: (methods: methodType | methodType[], path: string, name?: string) => methodDecorator;
    get: (path: string, name?: string) => methodDecorator;
    post: (path: string, name?: string) => methodDecorator;
    put: (path: string, name?: string) => methodDecorator;
    del: (path: string, name?: string) => methodDecorator;
    all: (path: string, name?: string) => methodDecorator;
  }
}

declare namespace Dove {
  // 定义 Dove.Context 声明
  type Context = Koa.Context
  type ActionOptions = ActionParams
}

export {
  Dove as default,
  Controller,
  Decorators
}

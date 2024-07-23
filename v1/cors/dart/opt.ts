import { api, Api, faas } from "@nitric/sdk";

// TODO: Remove this when upgrading to @nitric/sdk that exports this
interface MethodOptions<SecurityDefs extends string> {
  /**
   * Optional security definitions for this method
   */
  security?: Partial<Record<SecurityDefs, string[]>>;
}

// TODO: Remove this when upgrading to @nitric/sdk that exports this
interface JwtSecurityDefinition {
  kind: "jwt";
  issuer: string;
  audiences: string[];
}

// TODO: Remove this when upgrading to @nitric/sdk that exports this
interface ApiOpts<Defs extends string> {
  /**
   * The base path for all routes in the API.
   *
   * Acts as a prefix, e.g. path '/api/v1/', with route '/customers' would result in the full path '/api/v1/customers'.
   */
  path?: string;
  /**
   * Optional middleware to apply to all routes/methods in the API. Useful for universal middleware such as CORS or Auth.
   */
  middleware?: faas.HttpMiddleware[] | faas.HttpMiddleware;
  /**
   * Optional security definitions for the API
   */
  securityDefinitions?: Record<Defs, JwtSecurityDefinition>;
  /**
   * Optional root level secruity for the API
   */
  security?: Record<Defs, string[]>;
}

// Handle options/preflight requests
const optionsHandler: faas.HttpMiddleware = async (ctx, next) => {
  ctx.res.headers["Content-Type"] = ["text/html; charset=ascii"];
  ctx.res.body = "OK";

  return next ? next(ctx) : ctx;
};

const defaultOptionsSecurity: MethodOptions<string> = {
  security: {},
};

// Automatically add cors headers to responses
const addCors: faas.HttpMiddleware = async (ctx, next) => {
  // TODO: limit to valid origins
  ctx.res.headers["Access-Control-Allow-Origin"] = ["*"];
  ctx.res.headers["Access-Control-Allow-Headers"] = [
    "Origin, Content-Type, Accept, Authorization",
  ];
  ctx.res.headers["Access-Control-Allow-Methods"] = [
    "GET, PUT, POST, OPTIONS, DELETE",
  ];
  ctx.res.headers["Access-Control-Max-Age"] = ["7200"];

  return next ? next(ctx) : ctx;
};

// TODO: Would normally extend base class
// but this would break the internal caching for nitric resources
class PreflightApiWrapper<T extends string> {
  private api: Api<T>;
  private readonly registeredOptions: string[] = [];

  constructor(api: Api<T>) {
    this.api = api;
  }

  private asyncCreateOptions(match: string) {
    if (!this.registeredOptions.includes(match)) {
      this.registeredOptions.push(match);
      void this.api.options(
        match,
        [optionsHandler, addCors],
        defaultOptionsSecurity
      );
    }
  }

  public async get(
    match: string,
    middleware: faas.HttpMiddleware | faas.HttpMiddleware[],
    opts?: MethodOptions<T>
  ) {
    const mwArray = Array.isArray(middleware) ? middleware : [middleware];

    this.asyncCreateOptions(match);

    return this.api.get(match, [addCors, ...mwArray], opts);
  }

  public async post(
    match: string,
    middleware: faas.HttpMiddleware | faas.HttpMiddleware[],
    opts?: MethodOptions<T>
  ) {
    const mwArray = Array.isArray(middleware) ? middleware : [middleware];

    this.asyncCreateOptions(match);

    return this.api.post(match, [addCors, ...mwArray], opts);
  }

  public async put(
    match: string,
    middleware: faas.HttpMiddleware | faas.HttpMiddleware[],
    opts?: MethodOptions<T>
  ) {
    const mwArray = Array.isArray(middleware) ? middleware : [middleware];

    this.asyncCreateOptions(match);

    return this.api.put(match, [addCors, ...mwArray], opts);
  }

  public async patch(
    match: string,
    middleware: faas.HttpMiddleware | faas.HttpMiddleware[],
    opts?: MethodOptions<T>
  ) {
    const mwArray = Array.isArray(middleware) ? middleware : [middleware];

    this.asyncCreateOptions(match);

    return this.api.post(match, [addCors, ...mwArray], opts);
  }

  public async delete(
    match: string,
    middleware: faas.HttpMiddleware | faas.HttpMiddleware[],
    opts?: MethodOptions<T>
  ) {
    const mwArray = Array.isArray(middleware) ? middleware : [middleware];

    this.asyncCreateOptions(match);

    return this.api.delete(match, [addCors, ...mwArray], opts);
  }
}

export default <T extends string>(name: string, opts?: ApiOpts<T>) => {
  const baseApi = api(name, opts);

  return new PreflightApiWrapper(baseApi);
};

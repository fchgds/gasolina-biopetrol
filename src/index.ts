import {tableGenerator} from "./tableGenerator";

export default {
  async fetch(request: Request, env: any, ctx: any): Promise<Response> {
    return tableGenerator(request,env);
  },
};

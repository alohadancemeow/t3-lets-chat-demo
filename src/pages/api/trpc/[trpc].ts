import { createNextApiHandler } from "@trpc/server/adapters/next";

import { env } from "../../../env/server.mjs";
// import { createTRPCContext } from "../../../server/api/trpc";
import { AppRouter, appRouter } from "../../../server/api/root";
import {createContext} from '../../../server/context'

// export API handler
export default createNextApiHandler<AppRouter>({
  router: appRouter,
  // createContext: createTRPCContext,
  createContext,
  onError:
    process.env.NODE_ENV === "development"
      ? ({ path, error }) => {
          console.error(
            `❌ tRPC failed on ${path ?? "<no-path>"}: ${error.message}`
          );
        }
      : undefined,

  batching: {
    enabled: true,
  },
});

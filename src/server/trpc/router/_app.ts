import { router } from "../trpc";
import { accountRouter } from "./account";
import { authRouter } from "./auth";
import { exampleRouter } from "./example";

export const appRouter = router({
  example: exampleRouter,
  auth: authRouter,
  account: accountRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;

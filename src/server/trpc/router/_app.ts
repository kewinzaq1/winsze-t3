import { router } from "../trpc";
import { accountRouter } from "./account";
import { authRouter } from "./auth";
import { exampleRouter } from "./example";
import { postsRouter } from "./posts";

export const appRouter = router({
  example: exampleRouter,
  auth: authRouter,
  account: accountRouter,
  post: postsRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;

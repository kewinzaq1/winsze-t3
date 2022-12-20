import { router } from "../trpc";
import { accountRouter } from "./account";
import { authRouter } from "./auth";
import { exampleRouter } from "./example";
import { postsRouter } from "./posts";
import { usersRouter } from "./users";

export const appRouter = router({
  example: exampleRouter,
  auth: authRouter,
  account: accountRouter,
  posts: postsRouter,
  users: usersRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;

import { z } from "zod";
import { faker } from "@faker-js/faker";

import { router, publicProcedure } from "../trpc";

export const exampleRouter = router({
  hello: publicProcedure
    .input(z.object({ text: z.string().nullish() }).nullish())
    .query(({ input }) => {
      return {
        greeting: `Hello ${input?.text ?? "world"}`,
      };
    }),
  createRandomUsers: publicProcedure.mutation(({ ctx }) => {
    const users = [];
    for (let i = 0; i < 10; i++) {
      users.push({
        name: faker.name.firstName(),
        email: faker.internet.email(),
        password: faker.internet.password(),
        image: faker.image.imageUrl(),
      });
    }

    return ctx.prisma.user.createMany({
      data: users,
    });
  }),

  createRandomPosts: publicProcedure.mutation(async ({ ctx }) => {
    const users = await ctx.prisma.user.findMany();
    const usersId = users.map((user) => user.id);

    const getRandomUserId = () => {
      return usersId[Math.floor(Math.random() * usersId.length)];
    };

    const posts = [];
    for (let i = 0; i < 10; i++) {
      posts.push({
        content: faker.lorem.sentence(),
        image: faker.image.imageUrl(),
        userId: getRandomUserId() as string,
      });
    }

    return ctx.prisma.post.createMany({
      data: posts,
    });
  }),
});

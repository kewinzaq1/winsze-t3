import type { NextApiRequest, NextApiResponse } from "next";
import { Server } from "socket.io";
import { prisma } from "src/server/db/client";
import { getServerAuthSession } from "src/server/common/get-server-auth-session";
import { appRouter } from "src/server/trpc/router/_app";

interface Response extends Omit<NextApiResponse, "socket"> {
  socket: {
    server: {
      io: Server;
    };
  };
}

const SocketHandler = async (req: NextApiRequest, res: Response) => {
  const session = await getServerAuthSession({
    req,
    res: res as unknown as NextApiResponse,
  });

  const caller = appRouter.createCaller({
    session,
    prisma,
  });

  if (res.socket.server.io) {
    console.info("Socket is already running");
  } else {
    console.info("Socket is initializing");
    const io = new Server(res.socket.server as any);
    res.socket.server.io = io;
    io.on("connection", (socket) => {
      socket.on(
        "sendMessage",
        async (data: { content: string; conversationId: string }) => {
          const result = await caller.chat.sendMessage({
            ...data,
          });
          socket.broadcast.emit("receivedMessage", result);
        }
      );
    });
  }
  res.end();
};

export const config = {
  api: {
    bodyParser: false,
  },
};

export default SocketHandler;

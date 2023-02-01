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
  if (res.socket.server.io) {
    console.info("Socket is already running");
  } else {
    console.info("Socket is initializing");
    const io = new Server(res.socket.server as any);
    res.socket.server.io = io;
  }
  res.end();
};

export const config = {
  api: {
    bodyParser: false,
  },
};

export default SocketHandler;

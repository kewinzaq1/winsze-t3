import { atom, useAtom } from "jotai";
import { useCallback, useEffect } from "react";
import { io } from "socket.io-client";

type Socket = ReturnType<typeof io>;
export const atomSocket = atom<null | Socket>(null);

export function useInitWebsocket() {
  const [atom, setAtom] = useAtom(atomSocket);

  const initSocket = useCallback(() => {
    if (atom !== null) {
      return;
    }

    fetch("/api/socket").then(() => {
      const _socket = io();
      setAtom(_socket);

      _socket?.on("connect", () => {
        console.log("Connected to socket");
      });
    });
  }, [atom, setAtom]);

  useEffect(() => {
    initSocket();
  }, [initSocket]);
}

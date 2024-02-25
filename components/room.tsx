"use client";

import { RoomProvider } from "@/liveblocks.config";
import { ClientSideSuspense } from "@liveblocks/react";

interface RoomProps {
  children: React.ReactNode;
  roomId: string;
}

export const Room = ({ children, roomId }: RoomProps) => {
  return (
    <RoomProvider id={roomId} initialPresence={{}}>
      <ClientSideSuspense fallback={<div>Loading...</div>}>
        {() => children}
      </ClientSideSuspense>
    </RoomProvider>
  );
};

"use client";

import { LiveblocksProvider, RoomProvider, ClientSideSuspense } from "@liveblocks/react/suspense";
import { Editor } from "./Editor";

export function TipTapEditor() {
  return (
    <LiveblocksProvider publicApiKey="pk_dev_u9BJyGq_76XrpPT-W-Ab6BrWI4RGGg6q39GEZnZdDZNKJ4ZLQGNgQkbwMMLSfXV5">
      <RoomProvider id="shared-doc">
        <ClientSideSuspense fallback={<div>Loading...</div>}>
          <Editor />
        </ClientSideSuspense>
      </RoomProvider>
    </LiveblocksProvider>
  );
}

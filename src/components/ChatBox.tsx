import { useEffect, useRef } from "react";
import { useUser } from "@clerk/clerk-react";
import { useMutation, useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import {
  AssistantMessage,
  AssistantProvider,
  AssistantThread,
  UserMessage,
} from "@assistant-ui/react";
import { useAssistant } from "@assistant-ui/react-ai-sdk";

export const ChatBox = () => {
  const { user } = useUser();
  const sendMessage = useMutation(api.messages.send);
  const messages = useQuery(api.messages.list) ?? [];
  const chatEndRef = useRef<HTMLDivElement>(null);
  const { sendMessage: sendAiMessage, isLoading } = useAssistant();

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSendMessage = async (content: string) => {
    if (!user) return;

    if (content.startsWith("@ai")) {
      const aiPrompt = content.replace("@ai", "").trim();
      // First send user message
      await sendMessage({
        content,
        userId: user.id,
        username: user.username || "Anonymous",
        isAi: false,
      });
      // Then send AI response
      await sendAiMessage(aiPrompt);
      await sendMessage({
        content: "AI is thinking...",
        userId: "ai",
        username: "AI Assistant",
        isAi: true,
      });
    } else {
      await sendMessage({
        content,
        userId: user.id,
        username: user.username || "Anonymous",
        isAi: false,
      });
    }
  };

  return (
    <AssistantProvider>
      <div className="flex flex-col h-full">
        <AssistantThread
          className="flex-1 overflow-y-auto p-4 space-y-4"
          onSend={handleSendMessage}>
          {messages.map((msg) => {
            if (msg.isAi) {
              return <AssistantMessage key={msg._id}>{msg.content}</AssistantMessage>;
            }

            return (
              <UserMessage
                key={msg._id}
                user={{
                  name: msg.username,
                  id: msg.userId || undefined,
                }}>
                {msg.content}
              </UserMessage>
            );
          })}
          <div ref={chatEndRef} />
        </AssistantThread>
      </div>
    </AssistantProvider>
  );
};

import { ChatMessage } from "../types";

type MessageListProps = {
  messages: ChatMessage[];
};

export default function MessageList({ messages }: MessageListProps) {
  return (
    <div className="h-[300px] overflow-y-auto border border-gray-300 rounded-lg p-4 space-y-2">
      {messages.length === 0 && (
        <p className="text-gray-500">
          No messages yet. Open a second tab and say hello!
        </p>
      )}
      {messages.map((message, index) => (
        <p
          className="rounded-lg px-3 py-2 break-words"
          key={index}
          style={{ backgroundColor: message.color }}
        >
          <span className="text-xs text-gray-500">
            [
            {new Date(message.timestamp).toLocaleTimeString([], {
              hour: "numeric",
              minute: "2-digit",
            })}
            ]
          </span>{" "}
          <strong>{message.username}:</strong> {message.text}
        </p>
      ))}
    </div>
  );
}

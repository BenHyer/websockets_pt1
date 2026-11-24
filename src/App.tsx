import { useEffect, useRef, useState } from "react";
import "./App.css";
import { ChatMessage } from "./types";
import MessageList from "./components/MessageList";
import StatusBar from "./components/StatusBar";

function App() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [connected, setConnected] = useState(false);
  const socketRef = useRef<WebSocket | null>(null);
  const [username, setUsername] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [color] = useState(
    () => `hsl(${Math.floor(Math.random() * 360)}, 70%, 85%)`,
  );
  useEffect(() => {
    const socket = new WebSocket("ws://localhost:8080");
    socketRef.current = socket;

    socket.onopen = () => {
      console.log("Connected to server!");
      setConnected(true);
    };

    socket.onmessage = (event) => {
      const data = JSON.parse(String(event.data)) as ChatMessage;
      setMessages((previous) => [...previous, data]);
    };

    socket.onclose = () => {
      console.log("Disconnected from server.");
      setConnected(false);
    };

    socket.onerror = () => console.log("WebSocket error.");

    return () => {
      socket.close();
      socketRef.current = null;
    };
  }, []);

  function sendMessage() {
    if (!input.trim()) return setError("Message cannot be empty.");
    const socket = socketRef.current;
    if (socket?.readyState !== WebSocket.OPEN)
      return setError("WebSocket is not connected.");

    const message: ChatMessage = {
      username: username.trim() || "Anonymous",
      text: input,
      timestamp: Date.now(),
      color: color,
    };

    socket.send(JSON.stringify(message));
    setInput("");
    setError(null);
  }

  return (
    <div className="max-w-xl mx-auto my-10 p-6 flex flex-col gap-4">
      <h1 className="text-2xl font-bold">WebSocket Chat</h1>
      <StatusBar connected={connected} messageCount={messages.length} />
      <label className="flex flex-col gap-1 text-sm font-medium text-gray-700">
        {" "}
        Username:
        <input
          className="rounded-md border border-gray-300 px-3 py-2 font-normal
                    focus:outline-none focus:ring-2 focus:ring-blue-500"
          type="text"
          value={username}
          onChange={(event) => setUsername(event.target.value)}
          placeholder="Enter your username..."
        />
      </label>
      <MessageList messages={messages} />
      {error && <p className="text-sm text-red-600">{error}</p>}
      <div className="flex gap-2">
        <input
          className="flex-1 min-w-0 rounded-md border border-gray-300 px-3 py-2"
          value={input}
          onChange={(event) => setInput(event.target.value)}
          placeholder="Type a message..."
          onKeyDown={(event) => {
            if (event.key === "Enter") sendMessage();
          }}
        />
        <button
          className="rounded-md bg-blue-600 px-4 py-2 text-white disabled:opacity-50"
          onClick={sendMessage}
          disabled={!connected}
        >
          Send
        </button>
      </div>
    </div>
  );
}

export default App;

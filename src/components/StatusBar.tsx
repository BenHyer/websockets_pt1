type StatusBarProps = {
  connected: boolean;
  messageCount: number;
};

export default function StatusBar({ connected, messageCount }: StatusBarProps) {
  return (
    <div className="flex justify-between rounded-lg bg-gray-100 px-4 py-2 text-sm">
      <p>Messages Received: {messageCount}</p>
      <p>
        Status:{" "}
        <strong className={connected ? "text-green-700" : "text-red-700"}>
          {connected ? "Connected" : "Disconnected"}
        </strong>
      </p>
    </div>
  );
}

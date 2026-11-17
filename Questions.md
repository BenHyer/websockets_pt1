
Question 1: What happens when you send a message from one browser tab? Why?
- When I had one tab open and sent a message, it only showed up in that tab. Then When I had two tabs open, the messages showed up on both of them. When I added the 3rd tab, it only contained messages from the point in time that it joined. It didn't have the previous messages that tab 1 and tab 2 had.
- When a message gets there, onmessage adds it to thhat list of messages.But the list only lives in that tabs memmory. When it only shows on the single tab, it's because it's the only client in the server clients. When there's more than one tab, they're both connected so they show up in both. 


Question 2: What happens when you refresh one of the tabs? Do previous messages remain? Why or why not?
- The messages disappear, they are gone. 
- Refreshing destroys the tabs react app and everything in it's memory. The usestate on line 30 closes the old socket, then the page loads a new one which has an empty message list.

Part 2: Understanding WebSockets

Question 3: What is the difference between a traditional HTTP request and a WebSocket connection?
- An http request is opened for a request and then done. Where as a websocket is opened once and stays open. In http only the client can start talking, but with a websocket both the client and server can start talking. In http the direction is request, then response. The direction in websocket is two way at any time.

Question 4: What is polling? How could a chat application use HTTP polling instead of WebSockets?
- Polling means asking over and over on a timer to see if anything changed.
- It would have to poll very frequently for responses and messages
- Here's an example of it: 
    setInterval(async () => {
  const res = await fetch('/messages');
  const data = await res.json();
  setMessages(data);
}, 2000); // ask every 2 seconds

Question 5: Give two examples of applications that would benefit from WebSockets. Explain why.
- Multi-player games
    - player positions update many times per second, so polling would be far too slow and wasteful.
- Live Dashboards
    - Because it updates instantly, you don't have to manually refresh. Sports scores adn stock prices are some specifc examples.

Question 6: Give an example of an application where WebSockets would probably be unnecessary. Explain why.
- A recipe site. You load it once and read it. Nothing needs to be updated live. Keeping a connection open costs server resources. If nothing will be pushed through it, that cost buys you nothing, and a simple fetch() is easier to build and debug.

Question 7: What are two advantages and two disadvantages of WebSockets?
Pros:
- Real time: it updates instantly with no polling delay
- Efficient: once the handshake is made, each message is tiny and you don't have to deal with repeated headers, etc
- Two way: either side can send whenever it wants

Cons: 
- Server resources: each user hold an open connection
- No http caching: browsers and CDNs can cache HTTP responses, but they can't cache WebSocket messages.


Part 3: Understanding the Code
xplore the React application and WebSocket server.

Find where the application creates its connection:

const socket = new WebSocket("ws://localhost:8080");

Question 8: What does this line do? What does localhost:8080 represent?
- It creates a websocket object. The localhost 8080 is the port on the local machine where the server is listening.

Find the onmessage event handler.

Question 9: When does onmessage execute? How does receiving a message cause React to update the interface?
- Every time the server sends a message to that tab. 
- When a message comes in, onmessage runs. It creates a new array that contains the old messages with the new one added at the end. It calls a state setter which tells react that the state changed. React then rerenders the component and show all of the messages. 

Find where the application uses socket.send().

Question 10: What does send() do? Why should we check whether the connection is open before calling it?
- 

Find the code using useEffect and useRef.

Question 11: Why is useEffect useful for establishing a WebSocket connection?
- 

Question 12: Why might we use useRef to store our WebSocket connection instead of useState?
- 


Question 13: What is the purpose of the WebSocket server? Why can't the two React applications simply communicate directly in this example?
- 

Question 14: What would happen if the server only sent messages back to the browser that originally sent them?
- 

Part 4: Experiment with Connections


Question 15: What happens to your application when the server disconnects?
- 

Question 16: Does your application automatically reconnect when the server restarts? What would need to happen for it to reconnect?
- 

Part 5: Reflection
Question 17: How are WebSockets different from the API requests we previously made using fetch() and TanStack Query?
- 

Question 18: What was the most confusing part of working with WebSockets?
- 

Question 19: If you were building a multiplayer game or collaborative application, how might you use WebSockets?
- 
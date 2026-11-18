
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


Question 9: When does onmessage execute? How does receiving a message cause React to update the interface?
- Every time the server sends a message to that tab. 
- When a message comes in, onmessage runs. It creates a new array that contains the old messages with the new one added at the end. It calls a state setter which tells react that the state changed. React then rerenders the component and show all of the messages. 

Find where the application uses socket.send().

Question 10: What does send() do? Why should we check whether the connection is open before calling it?
- It pushes the data from the browser to the server. The server recieves in socket.on.
- Because it won't work if it's not open. Calling send while it's still connecting will throw an error. If it's closed, it does nothing. 

4 States of a Websocket:
- Connecting: Still dialing, not ready yet
- Open: Ready to send and recieve
- Closing: Hanging up
- Closed: Disconnected

Find the code using useEffect and useRef.

Question 11: Why is useEffect useful for establishing a WebSocket connection?
- It only runs once, so you get one connection. It runs after rendering. 
- The function you return runs when the component goes away. It calls socket.close(), which hangs up properly. Without it, old connections stay open and pile up.

Question 12: Why might we use useRef to store our WebSocket connection instead of useState?
- Because useRef persists across renders, whereas useState would cause an unneeded re-render when it's set.

Open the WebSocket server code.


Question 13: What is the purpose of the WebSocket server? Why can't the two React applications simply communicate directly in this example?
- It's like the middle man. It accepts connections from the browswers, keeps track of who is connected and relays the message to the everyone.
- Browsers can only connect out, not accept connections. The tabs don't know about each other and each tab is separate. Each tab runs their copy of the react app.

Question 14: What would happen if the server only sent messages back to the browser that originally sent them?
- Then the tabs wouldn't see what the other tabs say or send. Each tab would essentially be talking to itself. It would look exactly like the single-tab situation from Question 1, no matter how many tabs you opened.

Part 4: Experiment with Connections


Question 15: What happens to your application when the server disconnects?
- The status changes to Disconnected, but the messages still show

Question 16: Does your application automatically reconnect when the server restarts? What would need to happen for it to reconnect?
- No, it doesn't automatically reconnect. The page would have to be refreshed. 

Part 5: Reflection
Question 17: How are WebSockets different from the API requests we previously made using fetch() and TanStack Query?
- With api requests the component asks for data, the server answers once, and if the data changes you don't know about it until you ask again.
- With websockets, the server can push anytime, the connection is always open, everything updates automatically. But doesn't reconnect unless you write that code.

Question 18: What was the most confusing part of working with WebSockets?
- That when you refresh the page it erases everything that was there I kind of assumed that the server would remember it.
- Why tabs can't talk directly with each other . I kind of assumed that if they were on the same computer in the same browser that they could talk directly. But it does make sense when you think about the react at ran on different computers. Because each tab technically is its own copy of the React app.

Question 19: If you were building a multiplayer game or collaborative application, how might you use WebSockets?
- I would build a party trivia game I can play with my friends. Each round, the question is about one of the players. Everyone answers it, then the player the question is about enters the real answer. Next, everyone votes on which answer is the funniest and which one is correct, and points are awarded based on the votes.

I would use WebSockets to keep every player's screen in sync in real time:
- Joining: each player connects to the server. The server keeps track of who's in the game and broadcasts the player list so everyone sees who joined.
- Starting a round: the server picks a player and sends the question to everyone at the same time.
- Answering: each player sends their answer to the server. The server doesn't show the answers yet, but it broadcasts that a player has answered so everyone knows who we're waiting on.
- Voting: once everyone has answered, the server sends all the answers to every player. Players send their votes for funniest and correct back to the server.
- Scoring: the server counts the votes, calculates the points, and broadcasts the updated scoreboard to everyone.

The server should be in charge of the game. It stores the answers, votes, and scores, so a player can't cheat by changing their own score. It also means that a player who refreshes or reconnects can get the current game state back, which was a problem in our chat app.

WebSockets work well for this because the game constantly needs the server to tell every player when something happens, like a new question, someone answering, or the votes being counted. With fetch, every player would have to keep polling the server to check if the game had moved on, which would be slower and waste requests. With WebSockets, everyone moves to the next step at the same time.

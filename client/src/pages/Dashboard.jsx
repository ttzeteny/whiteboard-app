import { useState, useEffect } from "react";
import io from "socket.io-client";
import '../App.css';
import Board from "../Board";

const socket = io.connect("http://localhost:3001");

function App() {
  const [rooms, setRooms] = useState([]);
  const [currentRoom, setCurrentRoom] = useState(null);

  const [username, setUsername] = useState("");
  const [currentMessage, setCurrentMessage] = useState("");
  const [messageList, setMessageList] = useState([]);

  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showJoinModal, setShowJoinModal] = useState(false);
  
  const [newRoomName, setNewRoomName] = useState("");
  const [usernameInput, setUsernameInput] = useState("");
  const [roomToJoinId, setRoomToJoinId] = useState(null);

  useEffect(() => {
    const handleConnect = () => console.log("Connected");
    socket.on("connect", handleConnect);

    const handleRoomList = (data) => setRooms(data);
    socket.on("room_list", handleRoomList);

    const handleReceiveMessage = (data) => {
      setMessageList((prev) => [...prev, data]);
    };
    socket.on("receive_message", handleReceiveMessage);

    const handlePreviousMessages = (msgs) => setMessageList(msgs);
    socket.on("previous_messages", handlePreviousMessages);

    return () => {
      socket.off("connect", handleConnect);
      socket.off("room_list", handleRoomList);
      socket.off("receive_message", handleReceiveMessage);
      socket.off("previous_messages", handlePreviousMessages);
    };
  }, []);

  const openCreateModal = () => {
    setShowCreateModal(true);
    setNewRoomName("");
  };

  const handleCreateRoom = () => {
    if (newRoomName !== "") {
      socket.emit("create_room", { name: newRoomName });
      setShowCreateModal(false);
    } else {
      alert("Give the room a name!");
    }
  };

  const openJoinModal = (roomId) => {
    setRoomToJoinId(roomId);
    setShowJoinModal(true);
    setUsernameInput("");
  };

  const handleJoinRoom = () => {
    if (usernameInput !== "") {
      setUsername(usernameInput);
      socket.emit("join_room", roomToJoinId);
      setCurrentRoom(roomToJoinId);
      setMessageList([]);

      setShowJoinModal(false);
    } else {
      alert("Set a username!");
    }
  };

  const sendMessage = async () => {
    if (currentMessage !== "") {

      const now = new Date();
      const hours = now.getHours().toString().padStart(2, "0");
      const minutes = now.getMinutes().toString().padStart(2, "0");
      const formattedTime = `${hours}:${minutes}`;

      const messageData = {
        room: currentRoom,
        author: username,
        message: currentMessage,
        time: formattedTime
      };

      await socket.emit("send_message", messageData);

      setMessageList((list) => [...list, messageData]);
      setCurrentMessage("");
    }
  }

  return (
    <div className="App">
      
      {showCreateModal && (
        <div className="modal-overlay">
          <div className="modal-box">
            <h3>Create New Room</h3>
            <input 
              type="text" 
              placeholder="Room name..." 
              value={newRoomName}
              onChange={(e) => setNewRoomName(e.target.value)}
            />
            <p>Privacy Settings</p>
              <button>Private</button>
              <button>Public</button>
            <div className="modal-actions">
              <button className="btn-secondary" onClick={() => setShowCreateModal(false)}>Cancel</button>
              <button className="btn-primary" onClick={handleCreateRoom}>Create</button>
            </div>
          </div>
        </div>
      )}

      {showJoinModal && (
        <div className="modal-overlay">
          <div className="modal-box">
            <h3>Join Room</h3>
            <p>Set your username!</p>
            <input 
              type="text" 
              placeholder="Your name..." 
              value={usernameInput}
              onChange={(e) => setUsernameInput(e.target.value)}
            />
            <div className="modal-actions">
              <button className="btn-secondary" onClick={() => setShowJoinModal(false)}>Cancel</button>
              <button className="btn-primary" onClick={handleJoinRoom}>Join</button>
            </div>
          </div>
        </div>
      )}

      <nav className="navbar">
        <h1><a href="/">BOARD IT</a></h1>
        {currentRoom && <span style={{color: 'white'}}>Room: {currentRoom} | User: {username}</span>}
      </nav>

      <main className="main-content">
        {!currentRoom ? (
          <>
            <div>
              <h2>Available Rooms</h2>
              <button className="create-room-btn" onClick={openCreateModal}>+</button>
            </div>
            <div className="room-container">
              {rooms.map((room) => (
                <div key={room.id} className="room-card">
                  <h3>{room.name}</h3>
                  <p>{room.creator ? room.creator.substring(0,5) : "?"}'s room</p>
                  <button onClick={() => openJoinModal(room.id)}>Join</button>
                </div>
              ))}
            </div>
          </>
        ) : (
          <div className="room-view">
            <div className="board-placeholder">
              <Board socket = {socket} roomId = {currentRoom} />

              <button className="exit-btn" onClick={() => setCurrentRoom(null)}>Exit Room</button>
            </div>
            
            <div className="chat-window">
              <div className="chat-header">
                <p>Chat</p>
              </div>
              <div className="chat-body">
                {messageList.map((msg, index) => {
                  const isMyMessage = msg.author === username;
                  return (
                    <div key={index} className={`message ${isMyMessage ? "me" : "other"}`}>
                      <div className="message-content">
                        <p>{msg.message}</p>
                      </div>
                      <div className="message-meta">
                        <p>{msg.time} - {msg.author}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
              <div className="chat-footer">
                <input
                  type="text"
                  placeholder="Type something..."
                  value={currentMessage}
                  onChange={(event) => setCurrentMessage(event.target.value)}
                  onKeyPress={(event) => { event.key === "Enter" && sendMessage(); }}
                />
                <button onClick={sendMessage}>&#9654;</button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

export default App;
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import io from "socket.io-client";
import '../App.css';
import Board from "../Board";

const socket = io.connect("http://localhost:3001");

function Dashboard() {
  const navigate = useNavigate();

  const [rooms, setRooms] = useState([]);
  const [currentRoom, setCurrentRoom] = useState(null);

  const [username, setUsername] = useState("");
  const [currentMessage, setCurrentMessage] = useState("");
  const [messageList, setMessageList] = useState([]);

  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showJoinModal, setShowJoinModal] = useState(false);
  
  const [newRoomName, setNewRoomName] = useState("");
  const [roomToJoinId, setRoomToJoinId] = useState(null);
  const [roomToJoinName, setRoomToJoinName] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("token");
    const storedUser = localStorage.getItem("user");

    if (!token || !storedUser) {
      navigate("/login");
    } else {
      const userObj = JSON.parse(storedUser);
      setUsername(userObj.name);
    }
  }, [navigate]);

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
      socket.emit("create_room", {
         name: newRoomName,
         creatorName: username
      });
      setShowCreateModal(false);
    } else {
      alert("Give the room a name!");
    }
  };

  const openJoinModal = (roomId, roomName) => {
    setRoomToJoinId(roomId);
    setRoomToJoinName(roomName);
    setShowJoinModal(true);
  };

  const handleJoinRoom = () => {
    socket.emit("join_room", roomToJoinId);
    setCurrentRoom(roomToJoinId);
    setMessageList([]);
    setShowJoinModal(false);
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

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
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
            <h2>Privacy settings</h2>
            <div className="privacy-actions">
              <button>Private</button>
              <button>Public</button>
            </div>
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
            <h3>Join Room '{roomToJoinName}'?</h3>
            <div className="modal-actions">
              <button className="btn-secondary" onClick={() => setShowJoinModal(false)}>Cancel</button>
              <button className="btn-primary" onClick={handleJoinRoom}>Join</button>
            </div>
          </div>
        </div>
      )}

      <nav className="navbar">
        <h1><a href="/">BOARD IT</a></h1>
        <div style={{display: 'flex', alignItems: 'center', gap: '15px'}}>
            {currentRoom && <span style={{color: 'white', marginRight: '10px'}}>Room: {currentRoom}</span>}
            <span style={{color: '#ffffff', fontWeight: 'bold'}}>{username}</span>
            <button onClick={handleLogout} className="btn-secondary" style={{padding: '5px 12px', fontSize: '0.85rem'}}>Log out</button>
        </div>
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
                  <p>{room.creator}'s room</p>
                  <button onClick={() => openJoinModal(room.id, room.name)}>Join</button>
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

export default Dashboard;
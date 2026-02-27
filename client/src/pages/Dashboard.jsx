import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import io from "socket.io-client";
import '../App.css';
import '../Dashboard.css';
import Board from "../Board";

const socket = io.connect("http://localhost:3001");

function Dashboard() {
  const navigate = useNavigate();

  const [rooms, setRooms] = useState([]);
  const [currentRoom, setCurrentRoom] = useState(null);

  const [username, setUsername] = useState("");
  const [userId, setUserId] = useState(null);
  const [currentMessage, setCurrentMessage] = useState("");
  const [messageList, setMessageList] = useState([]);

  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showJoinModal, setShowJoinModal] = useState(false);
  
  const [newRoomName, setNewRoomName] = useState("");
  const [roomToJoinId, setRoomToJoinId] = useState(null);
  const [roomToJoinName, setRoomToJoinName] = useState("");
  const [openMenuId, setOpenMenuId] = useState(null);

  const [isPrivateRoom, setIsPrivateRoom] = useState(false);
  const [createPassword, setCreatePassword] = useState("");
  const [joinPassword, setJoinPassword] = useState("");
  const [roomToJoinIsPrivate, setRoomToJoinIsPrivate] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const storedUser = localStorage.getItem("user");

    if (!token || !storedUser) {
      navigate("/login");
    } else {
      const userObj = JSON.parse(storedUser);
      setUsername(userObj.name);
      setUserId(userObj.id);
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

    socket.emit("get_rooms");

    socket.on("join_error", (message) => {
      alert(message);
    });

    socket.on("join_success", (joinedRoomId) => {
      setCurrentRoom(joinedRoomId);
      setMessageList([]);
      setShowJoinModal(false);
    })

    return () => {
      socket.off("connect", handleConnect);
      socket.off("room_list", handleRoomList);
      socket.off("receive_message", handleReceiveMessage);
      socket.off("previous_messages", handlePreviousMessages);
      socket.off("join_error");
      socket.off("join_success");
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
         creatorName: username,
         ownerId: userId,
         isPrivate: isPrivateRoom,
         password: createPassword
      });
      setShowCreateModal(false);
      setCreatePassword("");
    } else {
      alert("Give the room a name!");
    }
  };

  const openJoinModal = (roomId, roomName, isPrivate) => {
    setRoomToJoinId(roomId);
    setRoomToJoinName(roomName);
    setRoomToJoinIsPrivate(isPrivate);
    setJoinPassword("");
    setShowJoinModal(true);
  };

  const handleJoinRoom = () => {
    socket.emit("join_room", {
      roomId: roomToJoinId,
      password: joinPassword,
      userId: userId
    });
  };

  const toggleMenu = (roomId) => {
    setOpenMenuId(openMenuId === roomId ? null : roomId);
  };

  const handleDeleteRoom = (roomId) => {
    if (window.confirm("Are you sure you want to delete this room?")) {
      socket.emit("delete_room", { roomId, userId });
      setOpenMenuId(null);
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

            <div className="toggle-container">
              <label className="toggle-switch">
                <input
                  type="checkbox"
                  checked={isPrivateRoom}
                  onChange={(e) => setIsPrivateRoom(e.target.checked)}
                />
                <span className="slider"></span>
              </label>
              <span className="toggle-label">Private Room</span>
            </div>

            {isPrivateRoom && (
              <input
                type = "password"
                placeholder = "Set password..."
                value = {createPassword}
                onChange = {(e) => setCreatePassword(e.target.value)}
                style = {{ marginBottom: '15px' }}
              />
            )}

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

            {roomToJoinIsPrivate && (
              <div style = {{ marginTop: '15px' }}> 
                <p style = {{ color: 'red', fontSize: '0.8rem', margin: '0 0 5px 0' }}>This room is private</p>
                <input
                  type = 'password'
                  placeholder = 'Enter room password...'
                  value = {joinPassword}
                  onChange = {(e) => setJoinPassword(e.target.value)}
                />
              </div>
            )}

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
                <div key={room.id} className="room-card" style={{ position: 'relative' }}>
                  
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <h3 style={{ margin: 0 }}>
                      {room.name}          
                    </h3>
                    
                    <div style={{ position: 'relative' }}>
                      <button 
                        onClick={() => toggleMenu(room.id)} 
                        style={{ background: 'none', border: 'none', fontSize: '1.5rem', cursor: 'pointer', padding: '0 5px', lineHeight: '1' }}
                      >
                        ⋮
                      </button>

                      {openMenuId === room.id && (
                        <div style={{
                          position: 'absolute', right: 0, top: '100%',
                          background: 'white', border: '1px solid #ccc', borderRadius: '5px',
                          padding: '5px', zIndex: 10, minWidth: '100px',
                          boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
                        }}>
                          <button 
                            onClick={() => openJoinModal(room.id, room.name, room.isPrivate)} 
                            style={{ display: 'block', width: '100%', textAlign: 'left', background: 'none', border: 'none', padding: '8px', cursor: 'pointer' }}
                          >
                            Join Room
                          </button>
                          
                          {room.ownerId === userId && (
                            <button 
                              onClick={() => handleDeleteRoom(room.id)} 
                              style={{ display: 'block', width: '100%', textAlign: 'left', background: 'none', border: 'none', padding: '8px', cursor: 'pointer', color: 'red' }}
                            >
                              Delete
                            </button>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                  <p style={{ marginTop: '10px' }}>{room.owner ? room.owner.name : "Someone"}'s room</p>
                  {room.isPrivate && <p style = {{ marginTop: '7px', fontSize: '0.75rem'}}>Private</p>}
                  {!room.isPrivate && <p style = {{ marginTop: '7px', fontSize: '0.75rem'}}>Public</p>}
                  <button onClick={() => openJoinModal(room.id, room.name, room.isPrivate)}>Join</button>
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
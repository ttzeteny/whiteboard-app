import { useEffect } from "react";
import io from "socket.io-client";

const socket = io.connect("http://localhost:3001");

function App() {

  useEffect(() => {
    console.log("Client running...");
  }, []);

  return (
    <div style={{ padding: "110px" }}>
      <h1>Whiteboard Project</h1>
      <p>Test</p>
    </div>
  );
}

export default App;
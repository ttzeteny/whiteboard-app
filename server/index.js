const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");
const authRoutes = require("../routes/authRoutes");

const port = 3001;

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoutes);

const server = http.createServer(app);

const io = new Server(server, {
    cors: {
        origin: "http://localhost:5173",
        methods: ["GET", "POST"],
    },
});

let rooms = [];

const roomMessages = {};

const roomDrawings = {};

io.on("connection", (socket) => {
    console.log('User connected: ', socket.id);

    socket.emit("room_list", rooms);

    socket.on("create_room", (data) => {

        const newRoom = {
            id: generateID(),
            name: data.name,
            creator: socket.id,
            users: []
        };

        rooms.push(newRoom);

        io.emit("room_list", rooms);
    });

    socket.on("join_room", (roomId) => {
        socket.join(roomId);
        console.log('User ${socket.id} joined room: ', roomId);

        socket.to(roomId).emit("user_joined", socket.id);

        if (roomMessages[roomId]) {
            socket.emit("previous_messages", roomMessages[roomId]);
        }

        if (roomDrawings[roomId]) {
            socket.emit("draw_history", roomDrawings[roomId]);
        }
    })

    socket.on("send_message", (data) => {
        if (!roomMessages[data.room]) {
            roomMessages[data.room] = [];
        }
        roomMessages[data.room].push(data);

        socket.to(data.room).emit("receive_message", data);
    });

    socket.on("draw_line", (data) => {
        const { roomId } = data;
        if (!roomDrawings[roomId]) {
            roomDrawings[roomId] = [];
        }
        roomDrawings[roomId].push(data);

        socket.to(roomId).emit("draw_line", data);
    });

    socket.on("disconnect", () => {
        console.log("User disconnected ", socket.id);
    });
});

function generateID() {
    return Math.random().toString(36).substring(2,9);
}

server.listen(port, () => {
    console.log("Server is listening on port ", port);
});
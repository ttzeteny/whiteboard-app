const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");
const authRoutes = require("./routes/authRoutes");
const prisma = require("./prismaClient");
const bcrypt = require("bcryptjs");

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

const roomMessages = {};
const roomDrawings = {};

io.on("connection", async (socket) => {
    console.log('User connected: ', socket.id);

    const allRooms = await prisma.room.findMany({
        include: { owner: true }
    });

    socket.emit("room_list", allRooms);

    socket.on("get_rooms", async () => {
        try {
            const allRooms = await prisma.room.findMany({
                include: { owner: true }
            });
            socket.emit("room_list", allRooms);
        } catch (e) {
            console.error("Error fetching rooms", e);
        }
    });

    socket.on("create_room", async (data) => {

        try {

            let hashedPassword = null;

            if (data.isPrivate && data.password) {
                const salt = await bcrypt.genSalt(10);
                hashedPassword = await bcrypt.hash(data.password, salt);
            }

            await prisma.room.create({
                data: {
                    name: data.name,
                    ownerId: data.ownerId,
                    isPrivate: data.isPrivate || false,
                    password: hashedPassword
                }
            });

            const updatedRooms = await prisma.room.findMany({
                include: { owner: true }
            });

            io.emit("room_list", updatedRooms);
        } catch (error) {
            console.error("An error occured while trying to create a room", error);
        }
    });

    socket.on("delete_room", async (data) => {
        const { roomId, userId } = data;

        try {
            const room = await prisma.room.findUnique({
                where: { id: roomId }
            });

            if ( room && room.ownerId === userId ) {
                await prisma.drawing.deleteMany({
                    where: { roomId: roomId }
                });

                await prisma.room.delete({
                    where: { id: roomId }
                });

                delete roomDrawings[roomId];
                delete roomMessages[roomId];

                const updatedRooms = await prisma.room.findMany({
                    include: { owner: true }
                });
                io.emit("room_list", updatedRooms);

                console.log("Room deleted: ", roomId);
            }
        } catch (e) {
            console.error("An error occured while trying to delete a room", e);
        }
    });

    socket.on("join_room", async (data) => {
        const { roomId, password, userId } = data;

        try {
            const room = await prisma.room.findUnique({ where: { id: roomId } });

            if (!room) {
                socket.emit("join_error", "Room not found");
                return;
            }

            if (room.isPrivate && room.ownerId !== userId) {
                if (!password || password.trim() === "") {
                    socket.emit("join_error", "You need a password for this room!");
                    return;
                }

                const isMatch = await bcrypt.compare(password, room.password);
                if (!isMatch) {
                    socket.emit("join_error", "Wrong password!");
                    return;
                }
            }
        } catch (e) {
            console.error("Error while trying to validate password: ", e);
            socket.emit("join_error", "Server error during verification.");
            return;
        }

        socket.join(roomId);
        console.log(`User ${socket.id} joined room: ${roomId}`);

        socket.emit("join_success", roomId);
        
        socket.to(roomId).emit("user_joined", socket.id);

        if (!roomDrawings[roomId]) {
            try {
                const savedDrawing = await prisma.drawing.findFirst({
                    where: { roomId: roomId },
                    orderBy: { createdAt: 'desc' }
                });

                if (savedDrawing) {
                    roomDrawings[roomId] = savedDrawing.content;
                } else {
                    roomDrawings[roomId] = [];
                }
            } catch (e) {
                console.error("Error while trying to load drawings:", e);
                roomDrawings[roomId] = [];
            }
        }

        socket.emit("draw_history", roomDrawings[roomId]);

        if (roomMessages[roomId]) {
            socket.emit("previous_messages", roomMessages[roomId]);
        }
    });

    socket.on("save_board", async (roomId) => {
        if (roomDrawings[roomId]) {
            try {
                const existingDrawing = await prisma.drawing.findFirst({
                    where: { roomId: roomId }
                });

                if (existingDrawing) {
                    await prisma.drawing.update({
                        where: { id: existingDrawing.id },
                        data: { content: roomDrawings[roomId] }
                    });
                } else {
                    await prisma.drawing.create({
                        data: { 
                            roomId: roomId,
                            content: roomDrawings[roomId]
                        }
                    });
                }
                console.log("Drawing saved for room ", roomId);
                socket.emit("board_saved");
            } catch (error) {
                console.error("An error occured while trying to save a drawing", error);
            }
        }
    });

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
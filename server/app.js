import dotenv from "dotenv";
dotenv.config();
import express from "express";
const app = express();
import cors from "cors";
import connectDb from './config/MongoDb.js'
import { Server } from "socket.io";
import userRoute from './routes/userRoutes.js'
import messageRoute from "./routes/messageRoute.js";




// Fetching Environmental variables
const url = process.env.MONGO_URL;
const port = process.env.PORT || 5000;
const origin = process.env.CONNECTION_URL;

// Super middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', userRoute);
app.use('/api/messages', messageRoute);



(async () => {
    try {
        await connectDb(url);
        const server = app.listen(port, () => console.log(`Server running on port http://localhost:${port}`))
        const io = new Server(server, {
            cors: {
                origin,
                methods: ['GET', 'POST'],
                credentials: true
            }
        });

        global.onlineUsers = new Map();

        io.on("connection", (socket) => {

            global.chatSocket = socket;
            socket.on("add-user", (userId) => {
                onlineUsers.set(userId, socket.id);
            });

            socket.on("send-msg", (data) => {
                const sendUserSocket = onlineUsers.get(data.to);
                if (sendUserSocket) {
                    socket.to(sendUserSocket).emit("msg-recieve", data.msg);
                }
            });
            
            
        });
    } catch (error) {
        console.log(`Error: ${error.message}`);
    }
})();
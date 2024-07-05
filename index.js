import express from "express";
import { config } from "dotenv";
import { Server } from "socket.io";
import http from "http";
// Middlewares
import morgan from "morgan";
import path from "path";
import { fileURLToPath } from "url";

// Load environment variables
config();

// Express and SocketIO basic setup
const app = express();
const server = http.createServer(app);
const io = new Server(server);

io.on("connection", (socket) => {
  socket.on("sendLocation", (data) => {
    io.emit("receiveLocation", { id: socket.id, ...data });
  });

  socket.on("disconnect", () => {
    io.emit("userDisconnected", socket.id);
  });
});

// EJS setup
const __dirname = path.dirname(fileURLToPath(import.meta.url));
app.set("view engine", "ejs");
app.use(express.static(path.join(__dirname, "public")));

// Middleware
app.use(express.json());
app.use(morgan("dev"));

// Routes
app.get("/", (req, res) => {
  res.render("index");
});

// SocketIO connection
const port = process.env.PORT || 5000;

server.listen(port, () => {
  console.log(`Server is running live on: http://localhost:${port}`);
});

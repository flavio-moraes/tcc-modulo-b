const express = require("express");
const app = express();
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cookieSession = require("cookie-session");
const passport = require("passport");
const cors = require("cors");
var session = require("express-session");
const MongoSessionStore = require("connect-mongo");
const { Server } = require("socket.io");
const { createServer } = require("http");
const path = require("path");

dotenv.config();
const passportSetup = require("./passportSetup");

const authRoute = require("./routes/auth");
const userRoute = require("./routes/user");
const productRoute = require("./routes/product");
const orderRoute = require("./routes/order");
const categoryRoute = require("./routes/category");
const bodyParser = require("body-parser");

process.env.NODE_ENV = process.env.NODE_ENV || "development";

const mongoClientPromisse = mongoose
  .connect(process.env.MONGO_URL)
  .then((res) => {
    console.log(`Conexão ao BD bem sucedida. ${res}`);
    return res.connection.getClient();
  })
  .catch((err) => console.log(`Falha na conexão com o BD. ${err}`));

app.use(
  cors({
    origin: process.env.CLIENT_URL,
    methods: "GET,POST,PUT,DELETE",
    credentials: true,
  })
);

app.enable("trust proxy");
app.set("trust proxy", 1);

app.use(express.json());

app.use(
  session({
    secret: process.env.PASS_SEC,
    resave: false,
    saveUninitialized: false,
    name: "sessionId-tccstorec",
    proxy: true,
    cookie: {
      secure: "auto",
      httpOnly: true,
      sameSite: false,
    },
    store: MongoSessionStore.create({
      clientPromise: mongoClientPromisse,
      ttl: 1 * 60 * 60,
    }),
  })
);

app.use(passport.initialize());
app.use(passport.session());

const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: process.env.CLIENT_URL,
    credentials: true,
  },
});
app.set("io", io);
io.on("connection", (socket) => {
  console.log(socket.id);
  socket.on("disconnect", (reason) => {
    console.log("Socket diconnect reason: ", reason);
  });
});

app.use("/images", express.static(process.env.IMG_UPLOAD_URL));

app.use("/api/v1/auth", authRoute);
app.use("/api/v1/users", userRoute);
app.use("/api/v1/products", productRoute);
app.use("/api/v1/orders", orderRoute);
app.use("/api/v1/categories", categoryRoute);

if (process.env.NODE_ENV === "production") {
  const __dirname = path.resolve();
  app.use(express.static(path.join(__dirname, "/store-client/build")));
  app.get("*", (req, res) =>
    res.sendFile(path.join(__dirname, "/store-client/build/index.html"))
  );
}

server.listen(process.env.PORT || 5000, () => {
  console.log("Servidor Backend está rodando.");
});

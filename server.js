const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const regjistrimiApi = require("./routes/regjistrimiApi");
const kycjaApi = require("./routes/kycjaApi");
const shpalljaApi = require("./routes/shpalljaApi");
const kerkoApi = require("./routes/kerkoApi");
const ckycjaApi = require("./routes/ckyckjaApi");
const profiliApi = require("./routes/profiliApi");
const aplikimiApi = require("./routes/aplikimiApi");
const kompaniteApi = require("./routes/kompaniteApi");
const punetRuajturaApi = require("./routes/punetRuajturaApi");
const aplikantetApi = require("./routes/aplikantetApi");
const session = require("express-session");
require("dotenv").config();

const app = express();

app.use(
  cors({
    origin: "https://punesohu.onrender.com",
    credentials: true,
  }),
);

app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ limit: "10mb", extended: true }));

app.use(
  session({
    name: "connect.sid",
    secret: process.env.SECRET_KEY,
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      secure: false,
      maxAge: 24 * 60 * 60 * 1000,
    },
  }),
);

app.use("/api/", kerkoApi);
app.use("/api/shpallja", aplikimiApi);
app.use("/api/shpallja", shpalljaApi);
app.use("/api/regjistrimi", regjistrimiApi);
app.use("/api/kycja", kycjaApi);
app.use("/api/ckycja", ckycjaApi);
app.use("/api/profili", profiliApi);
app.use("/api/kompania", kompaniteApi);
app.use("/api/aplikantet", aplikantetApi);
app.use("/api/punetRuajtura", punetRuajturaApi);
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => {
    console.error("MongoDB connection error:", err);
    process.exit(1);
  });

app.listen(process.env.PORT, () =>
  console.log("server running", process.env.PORT),
);

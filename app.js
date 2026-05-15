require("dotenv").config();
const express = require("express");
const cors = require("cors");
const morgan = require("morgan");

const taskRoutes = require("./routes/tasks");

const app = express();
const publicPath = path.join(__dirname, 'public');
app.use(express.static(publicPath));

app.use(cors());
app.use(morgan("dev"));
app.use(express.json());

app.get("/", (req, res) => res.send("API Running "));

app.use("/tasks", taskRoutes);

const PORT = process.env.PORT || 3000;


app.listen(PORT, () => {     // start the server on port 3000
  console.log("Server started");
});
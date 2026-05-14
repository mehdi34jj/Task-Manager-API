require("dotenv").config();
const express = require("express"); //express is a web framework for node.js
const cors = require("cors"); // cors is used to allow cross origin resource sharing
const morgan = require("morgan"); // morgan is used to log requests 

const taskRoutes = require("./routes/tasks");//  import task routes file 

const app = express();

app.use(cors()); // use cors 
app.use(mo  rgan("dev")); // use morgan
app.use(express.json()); // use express.json

app.get("/", (req, res) => res.send("API Running "));

app.use("/tasks", taskRoutes); // use task routes

const PORT = process.env.PORT || 3000;


app.listen(PORT, () => {     // start the server on port 3000
  console.log("Server started"); 
});
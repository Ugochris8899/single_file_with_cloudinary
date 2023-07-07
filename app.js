require("./config/clubDB")
const express = require("express");

const clubRouter = require("./routes/clubRoutes")

const app = express();
app.use(express.json());


app.use("/api", clubRouter)


module.exports = app;
const express = require("express");
const db = require("./config/db");
const app = express();
const PORT = process.env.PORT || 5000;

db();

app.get("/", (req, res) => res.send("API Running"));

app.listen(PORT, () => console.log(`Server started on port ${PORT}`));

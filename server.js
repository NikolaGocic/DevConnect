const express = require("express");
const db = require("./config/db");
const app = express();
const PORT = process.env.PORT || 5000;
db();

pp.use("/api/users", require("./routes/api/users"));
app.use("/api/auth", require("./routes/api/auth"));
app.use("/api/posts", require("./routes/api/posts"));
app.use("/api/profiles", require("./routes/api/profiles"));

app.listen(PORT, () => console.log(`Server started on port ${PORT}`));

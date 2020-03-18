const mongoose = require("mongoose");
const config = require("config");
const db = config.get("mongoURI");

const connect = async () => {
  try {
    await mongoose.connect(db, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true,
      useFindAndModify: false
    });
    console.log("Connected to mongodb... ");
  } catch (err) {
    console.error(err.message);
    process.exit(1);
  }
};

module.exports = connect;

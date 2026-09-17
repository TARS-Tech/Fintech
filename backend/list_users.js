const mongoose = require("mongoose");
const User = require("./src/models/user.model");
require("dotenv").config();

mongoose.connect(process.env.MONGO_URI)
  .then(async () => {
    console.log("Connected to MongoDB.");
    const users = await User.find({}, "email phone name isVerified profileCompleted kycCompleted");
    console.log("=== USER LIST ===");
    console.log(JSON.stringify(users, null, 2));
    console.log("=================");
    mongoose.connection.close();
  })
  .catch(err => {
    console.error("Error connecting to MongoDB:", err);
    process.exit(1);
  });

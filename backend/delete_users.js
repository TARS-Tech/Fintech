const mongoose = require("mongoose");
const User = require("./src/models/user.model");
const KYC = require("./src/models/kyc.model");
const Otp = require("./src/models/otp.model");
require("dotenv").config();

mongoose.connect(process.env.MONGO_URI)
  .then(async () => {
    console.log("Connected to MongoDB.");
    
    // Find Albert Einstein's user record
    const targetUser = await User.findOne({ email: "omp@gmail.com" });
    if (!targetUser) {
      console.log("Could not find Albert Einstein (omp@gmail.com). Aborting delete operation.");
      mongoose.connection.close();
      return;
    }
    
    const albertId = targetUser._id;
    console.log(`Found Albert Einstein with ID: ${albertId}`);
    
    // Delete other users
    const userDelResult = await User.deleteMany({ _id: { $ne: albertId } });
    console.log(`Deleted ${userDelResult.deletedCount} other users.`);
    
    // Delete other KYC records
    const kycDelResult = await KYC.deleteMany({ userId: { $ne: albertId } });
    console.log(`Deleted ${kycDelResult.deletedCount} associated KYC records.`);
    
    // Clear all OTP records to clean up the DB
    const otpDelResult = await Otp.deleteMany({});
    console.log(`Cleared ${otpDelResult.deletedCount} temporary OTP tokens.`);
    
    console.log("Cleanup operation completed successfully.");
    mongoose.connection.close();
  })
  .catch(err => {
    console.error("Error during cleanup:", err);
    process.exit(1);
  });

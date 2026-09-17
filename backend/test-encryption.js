require("dotenv").config();

const {
    encrypt,
    decrypt,
} = require("./src/services/encryption.service");

const originalValue = "ABCDE1234F";

console.log("Original:", originalValue);

const encryptedValue = encrypt(originalValue);

console.log("Encrypted:", encryptedValue);

const decryptedValue = decrypt(encryptedValue);

console.log("Decrypted:", decryptedValue);

if (decryptedValue === originalValue) {
    console.log("✅ Encryption test PASSED");
} else {
    console.log("❌ Encryption test FAILED");
}
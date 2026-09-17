const crypto = require("crypto");

const ALGORITHM = "aes-256-gcm";
const IV_LENGTH = 12;
const AUTH_TAG_LENGTH = 16;

const getEncryptionKey = () => {
    const key = process.env.ENCRYPTION_KEY;

    if (!key) {
        throw new Error("ENCRYPTION_KEY is not configured");
    }

    const encryptionKey = Buffer.from(key, "base64");

    if (encryptionKey.length !== 32) {
        throw new Error("ENCRYPTION_KEY must be exactly 32 bytes");
    }

    return encryptionKey;
};

exports.encrypt = (value) => {
    if (value === null || value === undefined) {
        return null;
    }

    const key = getEncryptionKey();

    const iv = crypto.randomBytes(IV_LENGTH);

    const cipher = crypto.createCipheriv(
        ALGORITHM,
        key,
        iv,
        {
            authTagLength: AUTH_TAG_LENGTH,
        }
    );

    const encrypted = Buffer.concat([
        cipher.update(String(value), "utf-8"),
        cipher.final(),
    ]);

    const authTag = cipher.getAuthTag();

    return {
        encrypted: encrypted.toString("base64"),
        iv: iv.toString("base64"),
        authTag: authTag.toString("base64"),
    };
};

exports.decrypt = (encryptedData) => {
    if (!encryptedData) {
        return null;
    }

    const key = getEncryptionKey();

    const encrypted = Buffer.from(
        encryptedData.encrypted,
        "base64",
    );

    const iv = Buffer.from(
        encryptedData.iv,
        "base64",
    );

    const authTag = Buffer.from(
        encryptedData.authTag,
        "base64",
    );

    const decipher = crypto.createDecipheriv(
        ALGORITHM,
        key,
        iv,
        {
            authTagLength: AUTH_TAG_LENGTH
        }
    );

    decipher.setAuthTag(authTag);

    const decrypted = Buffer.concat([
        decipher.update(encrypted),
        decipher.final(),
    ]);

    return decrypted.toString("utf8");
};
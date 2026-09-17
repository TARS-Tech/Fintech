exports.maskPan = (pan) => {
    if (!pan || pan.length !== 10) {
        return "";
    }

    return `XXXXXX${pan.slice(-4)}`;
};

exports.maskAadhaar = (aadhaar) => {
    if (!aadhaar || aadhaar.length !== 12) {
        return "";
    }

    return `XXXX-XXXX-${aadhaar.slice(-4)}`;
};
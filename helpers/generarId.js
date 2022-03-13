import crypto from "crypto";

const generarId = () => {
    return crypto.randomBytes(64).toString('hex');
}

export default generarId;
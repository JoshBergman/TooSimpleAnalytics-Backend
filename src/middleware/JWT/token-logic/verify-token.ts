import crypto from "crypto";
import dotenv from "dotenv";

dotenv.config();

export const verifyToken = (token: string) => {
  const [encodedHeader, encodedPayload, signature] = token.split(".");

  const key = process.env.SECRET_KEY;
  if (!key) {
    throw new Error("No Key Found @ Verify-Token, JWT");
  }

  const recreatedSignature = crypto
    .createHmac("sha256", key)
    .update(encodedHeader + "." + encodedPayload)
    .digest("base64");

  if (signature === recreatedSignature) {
    const decodedPayload = JSON.parse(
      Buffer.from(encodedPayload, "base64").toString("utf-8")
    );
    return decodedPayload;
  } else {
    return false;
  }
};

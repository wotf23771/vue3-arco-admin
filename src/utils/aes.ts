import { getSecretKey } from "@/utils/auth";
import CryptoJS from "crypto-js";

function getKey() {
  return getSecretKey();
}

function getIv() {
  return getKey().substring(0, 16);
}

export function aesEncode(originalText) {
  let encrypted = CryptoJS.AES.encrypt(
      originalText,
      CryptoJS.enc.Utf8.parse(getKey()),
      {
        iv: CryptoJS.enc.Utf8.parse(getIv()),
        mode: CryptoJS.mode.CBC,
        padding: CryptoJS.pad.Pkcs7,
      },
  );
  return String(encrypted);
}

export function aesDecode(encryptedText) {
  let base64 = CryptoJS.enc.Base64.parse(encryptedText);
  const decrypt = CryptoJS.AES.decrypt(
      encryptedText,
      CryptoJS.enc.Utf8.parse(getKey()),
      {
        iv: CryptoJS.enc.Utf8.parse(getIv()),
        mode: CryptoJS.mode.CBC,
        padding: CryptoJS.pad.Pkcs7,
      },
  );
  return String(decrypt.toString(CryptoJS.enc.Utf8));
}

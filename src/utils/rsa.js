import { JSEncrypt } from "jsencrypt";

export function decryptByPrivateKey(privateKey, encryptedText) {
  let sign = new JSEncrypt();
  sign.setPrivateKey("-----BEGIN RSA PRIVATE KEY-----" + privateKey + "-----END RSA PRIVATE KEY-----");
  let secret = sign.decrypt(encryptedText);
  return secret;
}

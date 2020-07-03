import CryptoJS from 'crypto-js';


const keySize = 256;
//const ivSize = 128;
const iterations = 100;

class Utils {

  static encrypt(value, secret) {
    const salt = CryptoJS.lib.WordArray.random(128/8);
    const key = CryptoJS.PBKDF2(secret, salt, {
      keySize: keySize / 32,
      iterations: iterations
    });
    const iv = CryptoJS.lib.WordArray.random(128/8);
    const encrypted = CryptoJS.AES.encrypt(value, key, {
      iv: iv,
      padding: CryptoJS.pad.Pkcs7,
      mode: CryptoJS.mode.CBC
    });

    return salt.toString()+ iv.toString() + encrypted.toString();
  }

  static decrypt(message, secret) {
    const salt = CryptoJS.enc.Hex.parse(message.substr(0, 32));
    const iv = CryptoJS.enc.Hex.parse(message.substr(32, 32));
    const encrypted = message.substring(64);
    const key = CryptoJS.PBKDF2(secret, salt, {
      keySize: keySize / 32,
      iterations: iterations
    });
    return CryptoJS.AES.decrypt(encrypted, key, {
      iv: iv,
      padding: CryptoJS.pad.Pkcs7,
      mode: CryptoJS.mode.CBC
    }).toString(CryptoJS.enc.Utf8);
  }
}

export default Utils;
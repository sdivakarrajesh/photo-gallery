import CryptoJS from 'crypto-js';

export default class CryptoService {
    async encryptData(data: string, secret: string) {
        return CryptoJS.AES.encrypt(data, secret).toString();
    }
    async decryptData(encryptedData: string, secret: string) {
        return CryptoJS.AES.decrypt(encryptedData, secret).toString(CryptoJS.enc.Utf8);
    }
}
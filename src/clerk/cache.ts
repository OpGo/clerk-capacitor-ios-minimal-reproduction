import { SecureStoragePlugin } from 'capacitor-secure-storage-plugin';

const SecureStorageTokenCache = {
  async getToken(key: string) {
    const { value } = await SecureStoragePlugin.get({ key });
    return value;
  },
  async saveToken(key: string, token: string) {
    await SecureStoragePlugin.set({ key, value: token });
  },
  async clearToken(key: string) {
    await SecureStoragePlugin.remove({ key });
  }
};

export default SecureStorageTokenCache;
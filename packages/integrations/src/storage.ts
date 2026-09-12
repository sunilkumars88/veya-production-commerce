export interface StorageProvider {
  getUploadUrl(key: string, contentType: string): Promise<{ url: string; key: string }>;
  getPublicUrl(key: string): string;
  delete(key: string): Promise<void>;
}

export class LocalStorageProvider implements StorageProvider {
  constructor(private baseUrl: string = '/uploads') {}

  async getUploadUrl(key: string, _contentType: string) {
    return { url: `${this.baseUrl}/${key}`, key };
  }

  getPublicUrl(key: string) {
    return `${this.baseUrl}/${key}`;
  }

  async delete(_key: string) {}
}

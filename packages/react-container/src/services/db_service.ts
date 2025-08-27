import Dexie, { type EntityTable } from 'dexie';
import AIService from './ai_service';
import CryptoService from './crypto_service';

interface Photo {
  id: number;
  imageData: string; //base64 encoded
  isEncrypted: boolean;
  encryptedImageData?: string | null;
  blurredImageData?: string | null; //base64 encoded
  keywords: string[];
  vector: number[];
  encryptedVector?: string | null;
}

const db = new Dexie('PhotosDatabase') as Dexie & {
  photos: EntityTable<
    Photo,
    'id'
  >;
};

db.version(1).stores({
  photos: '++id, isEncrypted, *keywords'
});


export default class StorageService {
  static secret = "secret";
  async getPhotos() {
    return db.photos.toArray();
  }

  async addPhoto(photo_data: string) {
    let hasPII = await new AIService().hasPII(photo_data)
    let keywords = await new AIService().extractKeywords(photo_data)
    let vector = await new AIService().generateVector(photo_data)

    let photo: Omit<Photo, "id"> = {
      imageData: hasPII ? "" : photo_data,
      isEncrypted: hasPII,
      encryptedImageData: hasPII  ? await  new CryptoService().encryptData(photo_data, StorageService.secret) : "",
      blurredImageData: hasPII ? await new AIService().getBlurredImage(photo_data) : "",
      keywords: keywords,
      vector: vector,
      encryptedVector: hasPII ? await new CryptoService().encryptData(JSON.stringify(vector), StorageService.secret) : "",
    }
    return db.photos.add(photo);
  }

  async filterPhotos(query: string) {
    return []
  }
}
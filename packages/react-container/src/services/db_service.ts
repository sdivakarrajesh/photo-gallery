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

export function cosinesim(A, B) {
  const len = Math.min(A.length, B.length);
  let dotproduct = 0, mA = 0, mB = 0;
  for (let i = 0; i < len; i++) {
    dotproduct += A[i] * B[i];
    mA += A[i] * A[i];
    mB += B[i] * B[i];
  }
  return dotproduct / (Math.sqrt(mA) * Math.sqrt(mB));
}


export default class StorageService {
  static secret = "secret";

  async pickPhoto(): Promise<string | null> {
    return new Promise((resolve, reject) => {
      const input = document.createElement('input');
      input.type = 'file';
      input.accept = 'image/*';
      input.style.display = 'none';
      document.body.appendChild(input);
      input.onchange = () => {
        const file = input.files && input.files[0];
        if (!file) {
          document.body.removeChild(input);
          resolve(null);
          return;
        }
        const reader = new FileReader();
        reader.onload = () => {
          document.body.removeChild(input);
          resolve(reader.result as string);
        };
        reader.onerror = (e) => {
          document.body.removeChild(input);
          reject(e);
        };
        reader.readAsDataURL(file);
      };
      input.click();
    });
  }
  async getPhotos() {
    return db.photos.toArray();
  }

  async addPhoto(photo_data: string) {
    let hasPII = await new AIService().hasPII(photo_data)
    let keywords = await new AIService().extractKeywords(photo_data)
    let vector = await new AIService().generateVector(keywords.join(","))

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
    const photos = await this.getPhotos();
    let queryFeature = await new AIService().generateVector(query);
    return photos.map(photo => {
      let curr = photo.vector || []
      let sim = cosinesim(curr, queryFeature);
      return { ...photo, similarity: sim, org_vector: curr, comp_vector: queryFeature };
    });
  }
}
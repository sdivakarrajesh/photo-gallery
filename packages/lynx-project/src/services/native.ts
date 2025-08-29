import type { Photo } from "../App.jsx";

export class NativeService {

    static async _native(method: string, params: any): Promise<any> {
        return new Promise<any>((resolve, reject) => {
            //@ts-ignore
            NativeModules.bridge.call(method, params, (response) => {
                console.log(method, response);
                resolve(response);
            })
        })
    }

    static async pickImage(): Promise<string | null> {
        return this._native("pickImage", null);
    }

    static async unlockImage(picture: Photo): Promise<Photo> {
        let response: Photo = await this._native("unlockImage", picture);
        return response;
    }

    static async getPhotos() {
        let response: Photo[] = await this._native("getPhotos", null);
        return response;
    }

    static async filterPhotos(query: string): Promise<Photo[]> {
        return this._native("filterPhotos", query);
    }

    //hack to access value in web
    static async getInputValue(element_id: string) {
        return this._native("getInputValue", element_id);
    }
    //hack to set value in web
    static async setInputValue(element_id: string, value: string) {
        return this._native("setInputValue", { element_id, value });
    }
}
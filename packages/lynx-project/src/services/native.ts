import type { Photo } from "../App.jsx";

export class NativeService {
    static async unlockImage(picture: Photo): Promise<Photo> {
        return new Promise<Photo>((resolve, reject) => {
            //@ts-ignore
            NativeModules.bridge.call("unlockImage", picture, (response) => {
                console.log("unlockImage", response);
                resolve(response as Photo);
            })
        })
    }

    static async getPhotos() {
        return new Promise<any>((resolve, reject) => {
            //@ts-ignore
            NativeModules.bridge.call("getPhotos", null, (response) => {
                console.log("getPhotos", response);
                resolve(response);
            })
        })
    }

    //hack to access value in web
    static async getPinInputValue() {
        return new Promise<string>((resolve, reject) => {
            //@ts-ignore
            NativeModules.bridge.call("getPinInputValue", null, (response) => {
                console.log("getPinInputValue", response);
                resolve(response as string);
            })
        })
    }
}
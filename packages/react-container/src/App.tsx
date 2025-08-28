//@ts-nocheck

import "./App.css";
import "@lynx-js/web-core/index.css";
import "@lynx-js/web-elements/index.css";
import "@lynx-js/web-core";
import { useEffect } from "react";
import { imageData } from './services/data'
import StorageService from "./services/db_service";
import AIService from "./services/ai_service";
import CryptoService from "./services/crypto_service";

const App = () => {
  useEffect(() => {

    const lynxView = document.querySelector('lynx-view');
    lynxView.onNativeModulesCall = (name, data, moduleName) => {
      console.log("From host react", name, data, moduleName);
      return {
        "status": "success"
      }
    };
    const run = async () => {
      try { 
        // let pickedImageData = await new StorageService().pickPhoto(); # requires user action, use button
        // await new StorageService().addPhoto(imageData);
        // console.log(...await new StorageService().filterPhotos("passport"));
        // console.log(...await new StorageService().filterPhotos("A girl is shown on a card with the words Grand Duche De Luxembourg on it."));
        // await new AIService().hasPII(imageData)
        // await new AIService().extractKeywords(imageData)
        // let textFeatures = await new AIService().generateVector("passport")
        // let imageFeatures = await new AIService().generateImageVector(imageData)
        // console.log("similarity", await new AIService().computeSimilarity(textFeatures, imageFeatures))
        // console.log("features", { textFeatures, imageFeatures });
        // await new AIService().getBlurredImage(imageData)
        // let encrypted = await new CryptoService().encryptData(imageData, "secret")
        // let decrypted = await new CryptoService().decryptData(encrypted, "secret")
        // console.log("image added");
      } catch (error) {
        console.error(error);
      }

    }
    run()
  }, []);

  return (<>
    {/* <button onClick={async ()=>{
    let pickedImageData = await new StorageService().pickPhoto();
    console.log("picked", pickedImageData)
  }}>pick me</button> */}
    <lynx-view style={{ height: "100vh", width: "100vw" }} url="/main.web.bundle">
    </lynx-view>
  </>
  );
};

export default App;

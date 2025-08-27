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
    };
    const run = async () => {
      // await new StorageService().addPhoto(imageData);
      // await new AIService().hasPII(imageData)
      // await new AIService().extractKeywords(imageData)
      // await new AIService().generateVector(imageData)
      // await new AIService().getBlurredImage(imageData)
      // let encrypted = await new CryptoService().encryptData(imageData, "secret")
      // let decrypted = await new CryptoService().decryptData(encrypted, "secret")
      console.log("image added");
    }
    run()
  }, []);

  return (
    <lynx-view style={{ height: "100vh", width: "100vw" }} url="/main.web.bundle">
    </lynx-view>
  );
};

export default App;

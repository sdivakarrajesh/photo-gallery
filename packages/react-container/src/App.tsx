//@ts-nocheck

import "./App.css";
import "@lynx-js/web-core/index.css";
import "@lynx-js/web-elements/index.css";
import "@lynx-js/web-core";
import { useEffect } from "react";

const App = () => {
  useEffect(() => {
   
    const lynxView = document.querySelector('lynx-view');
    lynxView.onNativeModulesCall = (name, data, moduleName) => {
      console.log("From host react", name, data, moduleName);
    };
  }, []);

  return (
    <lynx-view style={{ height: "100vh", width: "100vw" }} url="/main.web.bundle">
    </lynx-view>
  );
};

export default App;

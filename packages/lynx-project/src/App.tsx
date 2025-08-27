//@ts-nocheck
import { useEffect, useMainThreadRef, useRef, useState } from "@lynx-js/react";
import "./App.css";
import pic0 from "./resources/passport.jpg";
import {
  adjustScrollbarMTS,
  NiceScrollbarMTS,
} from "./components/NiceScrollbarMTS.jsx";
import { DetailView } from "./DetailView.jsx";

const pictureData = [
  { src: pic0 },
  { src: pic0 },
  { src: pic0 },
  { src: pic0 },
  { src: pic0 },
  { src: pic0 },
  { src: pic0 },
  { src: pic0 },
  { src: pic0 },
  { src: pic0 },
];

export function App() {
  const [showDetail, setShowDetail] = useState(false);
  const [selectedPicture, setSelectedPicture] = useState(null);
  const scrollbarMTSRef = useMainThreadRef<MainThread.Element>(null);
  const galleryRef = useRef<NodesRef>(null);

  useEffect(() => {
    console.info("Hello, from Lynx");
    // NativeModules.bridge.call("getImages", null, ()=>{})
  }, []);

  const onScrollMTS = (event: ScrollEvent) => {
    "main thread";
    console.log("onScroll");
    adjustScrollbarMTS(
      event.detail.scrollTop,
      event.detail.scrollHeight,
      scrollbarMTSRef
    );
  };

  return (
    <view className="page">
      {showDetail ? (
        <DetailView picture={selectedPicture} onClose={() => setShowDetail(false)} />
      ) : (
        <view>
          <text className="heading">Gallery</text>

          <text className="subheading">Tap a photo to view details</text>
          <NiceScrollbarMTS main-thread:ref={scrollbarMTSRef} />
          <list
            ref={galleryRef}
            className="list"
            list-type="waterfall"
            column-count={2}
            scroll-orientation="vertical"
            custom-list-name="list-container"
            main-thread:bindscroll={onScrollMTS}
          >
            {pictureData.map((picture, index: number) => (
              <list-item item-key={"" + index} key={"" + index} bindtap={() => {
                setSelectedPicture(picture);
                setShowDetail(true);
              }}>
                <image className="gallery-image" src={pic0} auto-size />
              </list-item>
            ))}
          </list>
        </view>
      )}
    </view>
  );
}

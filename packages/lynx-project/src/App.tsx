//@ts-nocheck
import { useEffect, useMainThreadRef, useRef, useState } from "@lynx-js/react";
import "./App.css";
import pic0 from "./resources/passport.jpg";
import {
  adjustScrollbarMTS,
  NiceScrollbarMTS,
} from "./components/NiceScrollbarMTS.jsx";
import { DetailView } from "./DetailView.jsx";
import searchImage from "./resources/search.png";
import addImage from "./resources/plus.png";

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
  { src: pic0 },
  { src: pic0 },
  { src: pic0 },
  { src: pic0 },
];

export function App() {
  const [showDetail, setShowDetail] = useState(false);
  const [searchQuery, setSearchQuery] = useState(null);
  const [selectedPicture, setSelectedPicture] = useState(null);
  const scrollbarMTSRef = useMainThreadRef<MainThread.Element>(null);
  const galleryRef = useRef<NodesRef>(null);

  useEffect(() => {
    console.info("Hello, from Lynx 2");
    

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
        <DetailView
          picture={selectedPicture}
          onClose={() => setShowDetail(false)}
        />
      ) : (
        <view class="gallery-page">
          <view className="header">
            <text className="heading">Gallery</text>
            <image
            bindtap={()=>{
              NativeModules.bridge.call("pickImage", null, (response)=>{
                console.log("picked", response);
              })
            }}
              className="add-image"
              auto-size
              style={{
                display: "inline-block",
                backgroundImage: `url(${addImage})`,
                width: "24px",
                height: "24px",
                backgroundSize: "contain",
                backgroundPosition: "center",
                backgroundRepeat: "no-repeat",
              }}
            ></image>
          </view>

          <text className="subheading">Tap a photo to view details</text>
          <view className="search-box">
            <image
              src={searchImage}
              style={{ width: "24px", opacity: 0.7 }}
              auto-size
            />
            <input
              className="search-input"
              style={{ width: "100%", color: "white" }}
              placeholder="Search Photos"
              bindinput={(res: any) => {
                console.log(res.detail.value);
                setSearchQuery(res.detail.value);
              }}
            />
          </view>

          <NiceScrollbarMTS main-thread:ref={scrollbarMTSRef} />
          <scroll-view
            scroll-orientation="vertical"
            style={{ width: "100%", height: "500px" }}
          >
            <view className="gallery-grid">
              {pictureData.map((picture, index) => (
                <view
                  item-key={"" + index}
                  key={"" + index}
                  bindtap={() => {
                    setSelectedPicture(picture);
                    setShowDetail(true);
                  }}
                >
                  <image
                    className="gallery-image"
                    auto-size
                    style={{ backgroundImage: `url(${pic0})` }}
                  />
                </view>
              ))}
            </view>
            {/* <list
            ref={galleryRef}
            className="list"
            list-type="waterfall"
            column-count={2}
            scroll-orientation="vertical"
            custom-list-name="list-container"
            main-thread:bindscroll={onScrollMTS}
          >
            {pictureData.map((picture, index: number) => (
              <list-item
                item-key={"" + index}
                key={"" + index}
                bindtap={() => {
                  setSelectedPicture(picture);
                  setShowDetail(true);
                }}
              >
                <image className="gallery-image" src={pic0} auto-size />
              </list-item>
            ))}
          </list> */}
          </scroll-view>
        </view>
      )}
    </view>
  );
}

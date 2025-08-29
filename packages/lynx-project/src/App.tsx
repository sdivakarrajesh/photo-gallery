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
import crossImage from "./resources/cross.png";
import addImage from "./resources/plus.png";
import lockImage from './resources/lock.png';
// import AIService from "./services/ai_service.js";
import { photosData } from "./services/data.js";
import { NativeService } from "./services/native.js";

export interface Photo {
  id: number;
  imageData: string; //base64 encoded
  isEncrypted: boolean;
  encryptedImageData?: string | null;
  blurredImageData?: string | null; //base64 encoded
  keywords: string[];
  vector: number[];
  encryptedVector?: string | null;
}



export function App() {
  const [pictures, setPictures] = useState<Photo[]>(photosData);
  const [isFiltered, setIsFiltered] = useState(false);
  const [showDetail, setShowDetail] = useState(false);
  const [searchQuery, setSearchQuery] = useState(null);
  const [selectedPicture, setSelectedPicture] = useState(null);
  const scrollbarMTSRef = useMainThreadRef<MainThread.Element>(null);
  const galleryRef = useRef<NodesRef>(null);

  useEffect(() => {
    console.info("Hello, from Lynx 2");
    const run = async () => {
      let photos = await NativeService.getPhotos()
      setPictures(photos);
    }
    run();
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

  const search = async () => {
    if (isFiltered) {
      let allPhotos = await NativeService.getPhotos()
      setPictures(allPhotos)
      setIsFiltered(false)
      NativeService.setInputValue("search-input", "")
    } else {
      let searchQuery = await NativeService.getInputValue("search-input")
      console.log(searchQuery)
      let filteredPhotos = await NativeService.filterPhotos(searchQuery)
      setPictures(filteredPhotos)
      setIsFiltered(true)
    }

  }

  return (
    <view className="page">
      {showDetail ? (
        <DetailView
          picture={selectedPicture}
          onClose={() => setShowDetail(false)}
        />
      ) : (
        <scroll-view scroll-orientation="vertical" style={{ width: "100%", height: "100%" }}>
          <view class="gallery-page">
            <view className="header">
              <text className="heading">Gallery</text>
              <image
                bindtap={() => {
                  NativeModules.bridge.call("pickImage", null, (response) => {
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
              <input
                id="search-input"
                className="search-input"
                style={{ color: "white" }}
                placeholder="Search Photos"
              // bindinput={(res: any) => {
              //   console.log(res.detail.value);
              //   setSearchQuery(res.detail.value);
              // }}
              />
              <view
                style={{
                  backgroundColor: isFiltered ? "transparent" : "#7d82d4"
                }}
                className="search-icon"
                bindtap={() => search()}>
                <image
                  style={{
                    display: "inline-block",
                    width: "24px",
                    height: "24px",
                    backgroundImage: `url(${isFiltered ? crossImage : searchImage})`,
                    backgroundSize: "contain",
                    backgroundPosition: "center",
                    backgroundRepeat: "no-repeat",
                  }}
                  auto-size
                />
              </view>
            </view>


            <view className="gallery-grid">
              {pictures.map((picture, index) => (
                <view
                  className="gallery-item"
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
                    style={{ backgroundImage: `url(${picture.imageData || picture.blurredImageData})` }}
                  />
                  {picture.isEncrypted && <image
                    className="lock-icon"
                    style={{ backgroundImage: `url(${lockImage})` }}
                  />}
                </view>
              ))}
            </view>
          </view>
        </scroll-view>
      )}
    </view>

  );
}

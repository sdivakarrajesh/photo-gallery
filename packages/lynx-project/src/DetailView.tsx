import { useEffect, useMainThreadRef, useRef, useState } from "@lynx-js/react";
import backImage from "./resources/arrow-left.png";
import infoImage from "./resources/info.png";
import lockImage from "./resources/lock.png";
import type { Photo } from "./App.jsx";
import { NativeService } from "./services/native.js";

interface DetailParams {
  picture: Photo;
  onClose: () => void;
}

export function DetailView({ picture: pic, onClose }: DetailParams) {
  const [picture, setPicture] = useState<Photo>(pic);
  const [isUnlocking, setIsUnlocking] = useState(false);
  const [showImage, setShowImage] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const [error, setShowError] = useState(false);
  const [showLog, setShowLog] = useState(false)
  const tapTSRef = useRef();

  const unlock = async () => {
    let pin = await NativeService.getInputValue("pin-input");

    if (pin === "1234") {
      setShowError(false);
      setShowPopup(false);
      setShowImage(true);
      setIsUnlocking(true);
      let newPicture = await NativeService.unlockImage(picture);
      console.log(newPicture)
      setPicture(newPicture);
      setIsUnlocking(false);
    } else {
      setShowError(true);
    }
  }


  return (
    <scroll-view scroll-orientation="vertical" style={{ width: "100%", height: "calc(100vh - 10px)" }}>
      <view className="detail-view">
        <view className="detail-view-header">
          <image
            style={{
              //@ts-ignore
              display: "inline-block",
              width: "24px",
              height: "24px",
              backgroundImage: `url(${backImage})`,
              backgroundSize: "contain",
              backgroundPosition: "center",
              backgroundRepeat: "no-repeat",
            }}
            auto-size
            bindtap={onClose}
          />
          <image
            style={{
              //@ts-ignore
              display: "inline-block",
              width: "24px",
              height: "24px",
              backgroundImage: `url(${infoImage})`,
              backgroundSize: "contain",
              backgroundPosition: "center",
              backgroundRepeat: "no-repeat",
            }}
            auto-size
            bindtap={() => setShowLog(!showLog)}
          />
        </view>

        <view className={`image-full-view`}>
          <image
            style={{
              //@ts-ignore
              display: "inline-block",
              width: "100%",
              height: "100%",
              backgroundImage: `url(${picture.imageData || picture.blurredImageData})`,
              backgroundSize: "contain",
              backgroundPosition: "center",
              backgroundRepeat: "no-repeat",
            }} auto-size />
          {picture.isEncrypted && !picture.imageData && (
            <view id="lock-aurora" className="overlay-lock anim" bindtap={(event) => {
              console.log("clicked on lock", event);
              setShowPopup(true);
              tapTSRef.current = event.timestamp;
            }}>
              <image
                className="image"
                style={{
                  //@ts-ignore
                  display: "inline-block",
                  width: "24px",
                  height: "24px",
                  backgroundImage: `url(${lockImage})`,
                  backgroundSize: "contain",
                  backgroundPosition: "center",
                  backgroundRepeat: "no-repeat",
                }}
                auto-size
              />
            </view>
          )}
        </view>

        {
          showPopup && (
            <view className="popup-container">
              <view className="popup" id="unlock-popup">
                <text style={{ marginBottom: 10 }}>Enter PIN to unlock</text>
                <input
                  id="pin-input"
                  type="number"
                  className="pin-input"
                  placeholder="Enter PIN"
                // bindinput={(res: any) => {
                //   console.log(res)
                //   console.log(res.detail.value)
                //   setPinInput(res.detail.value);
                // }}
                />
                <view className="popup-btns">
                  <view className="cancel-btn" bindtap={() => setShowPopup(false)}>
                    <text style={{ color: "white" }}>Cancel</text>
                  </view>
                  <view id="unlock-btn" className={`unlock-button ${isUnlocking ? "is-unlocking" : ""}`} bindtap={() => !isUnlocking && unlock()}>
                    {isUnlocking && <view className="loader small" style={{ marginRight: "8px" }} />}
                    <text className="unlock-button-text">{
                      isUnlocking ? "Unlocking..." : "Unlock"
                    }</text>
                  </view>
                </view>

                {error && <view style={{ marginTop: "10px" }}>
                  <text style={{ color: "red", textAlign: "center" }}>Incorrect PIN. Please try again.</text>
                </view>}
              </view>
            </view>

          )
        }

      </view>
      {showLog && <scroll-view scroll-orientation="vertical" style={{ height: "500px", width: "100%" }}>
        <view className="log-view">
          <text className="log-title">Log:</text>
          <text>
            ID: {picture.id}
          </text>
          <text>
            IMAGE DATA: {picture.imageData ? "Available" : "Not Available"}
          </text>
          <text>
            ENCRYPTED IMAGE DATA: {picture.encryptedImageData ? "Available" : "Not Available"}
          </text>
          <text>
            BLURRED IMAGE DATA: {picture.blurredImageData ? "Available" : "Not Available"}
          </text>
          <text>
            IS ENCRYPTED: {picture.isEncrypted ? "Yes" : "No"}
          </text>
          <text>
            KEYWORD: {picture.keywords}
          </text>
        </view>
      </scroll-view>}
    </scroll-view>
  );
}

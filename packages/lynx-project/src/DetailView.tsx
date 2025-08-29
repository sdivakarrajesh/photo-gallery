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
    <view className="detail-view" bindtap={() => showPopup && setShowPopup(false)}>
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
          auto-size />
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
      </view>
      {picture.isEncrypted && !picture.imageData && (
        <view className="overlay-lock anim" bindtap={() => setShowPopup(true)}>
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

      {
        showPopup && (
          <view className="popup">
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
            <view className={`unlock-button ${isUnlocking ? "is-unlocking" : ""}`} bindtap={() => !isUnlocking && unlock()}>
              {isUnlocking && <view className="loader small" style={{ marginRight: "8px" }} />}
              <text className="unlock-button-text">{
                isUnlocking ? "Unlocking..." : "Unlock"
              }</text>
            </view>
            {error && <view style={{ marginTop: "10px" }}>
              <text style={{ color: "red", textAlign: "center" }}>Incorrect PIN. Please try again.</text>
            </view>}
          </view>
        )
      }
    </view>
  );
}

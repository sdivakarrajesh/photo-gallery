import { useEffect, useMainThreadRef, useRef, useState } from "@lynx-js/react";
import backImage from "./resources/arrow-left.png";
import infoImage from "./resources/info.png";
import lockImage from "./resources/lock.png";

interface DetailParams {
  picture: any;
  onClose: () => void;
}

export function DetailView({ picture, onClose }: DetailParams) {
  const [isPII, setIsPII] = useState(true);
  return (
    <view className="detail-view">
      <view className="detail-view-header">
        <image src={backImage} style={{ width: "24px" }} auto-size bindtap={onClose} />
        <image src={infoImage} style={{ width: "24px" }} auto-size />
      </view>

      <view
        className={`image-full-view ${isPII ? "blurred" : ""}`}
        
      >
        <image src={picture.src} style={{ width: "100%" }} auto-size />
      </view>
      {isPII && (
        <view className="overlay-lock anim" bindtap={() => setIsPII(!isPII)}>
          <image
            className="image"
            src={lockImage}
            style={{ width: "100%" }}
            auto-size
          />
        </view>
      )}
    </view>
  );
}

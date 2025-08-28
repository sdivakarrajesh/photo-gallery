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

      <view
        className={`image-full-view ${isPII ? "blurred" : ""}`}

      >
        <image
          style={{
            //@ts-ignore
            display: "inline-block",
            width: "100%",
            height: "100%",
            backgroundImage: `url(${picture.src})`,
            backgroundSize: "contain",
            backgroundPosition: "center",
            backgroundRepeat: "no-repeat",
          }} auto-size />
      </view>
      {isPII && (
        <view className="overlay-lock anim" bindtap={() => setIsPII(!isPII)}>
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
  );
}

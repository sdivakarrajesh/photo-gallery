import { type MainThreadRef, type RefObject } from "@lynx-js/react";
import { MainThread } from "@lynx-js/types";
import '../App.css'
export const adjustScrollbarMTS = (scrollTop: number, scrollHeight: number, ref: RefObject<MainThread.Element>) => {
  "main thread";
  const listHeight = SystemInfo.pixelHeight / SystemInfo.pixelRatio - 48;
  const scrollbarHeight = listHeight * (listHeight / scrollHeight);
  const scrollbarTop = listHeight * (scrollTop / scrollHeight);
  ref.current?.setStyleProperties({
    height: `${scrollbarHeight}px`,
    top: `${scrollbarTop}px`,
  });
};

export const NiceScrollbarMTS = (props: { "main-thread:ref": RefObject<MainThread.Element> }) => {
  return (
    <view
      main-thread:ref={props["main-thread:ref"]}
      className="scrollbar"
    >
      <view className="scrollbar-effect glow" />
    </view>
  );
};

//https://gist.github.com/ashwin1014/6bb7d7c1fd0800117547a2aa8bd5f65b 06/09/24

import { useEffect, useState } from "react";
import { Keyboard, KeyboardEvent } from "react-native";

/**
 * Shows height of keyboard when shown
 */
function useKeyboardHeight() {
  const [keyboardHeight, setKeyboardHeight] = useState(0);
  function onKeyboardShow(event) {
    setKeyboardHeight(event.endCoordinates.height);
  }
  function onKeyboardHide() {
    setKeyboardHeight(0);
  }
  useEffect(() => {
    const onShow = Keyboard.addListener("keyboardDidShow", onKeyboardShow);
    const onHide = Keyboard.addListener("keyboardDidHide", onKeyboardHide);

    return () => {
      onShow.remove();
      onHide.remove();
    };
  }, []);

  return keyboardHeight;
}
export default useKeyboardHeight;

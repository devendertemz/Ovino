import React from "react";
import { Alert, Share } from "react-native";

const ShareChannelLinkUtil = async (title, msg) => {
  try {
    const result = await Share.share({
      title: title,
      message: msg,
    });
    if (result.action === Share.sharedAction) {
      console.log(
        "\u001b[1;33mSU.js : result.activityType = ",
        JSON.stringify(result.activityType)
      );
      if (result.activityType) {
        // shared with activity type of result.activityType
      } else {
        // shared
      }
    } else if (result.action === Share.dismissedAction) {
      // dismissed
    }
  } catch (error) {
    Alert.alert(error.message);
  }
};
export { ShareChannelLinkUtil };

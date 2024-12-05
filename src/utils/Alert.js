import React from "react";
import { Alert, Text } from "react-native";
import CustomMsgAlert from "../components/popup/CustomMsgAlert";

export const showMsgAlert = (msg, title = "Message") => {
  Alert.alert(title, msg + "", [{ text: "OK" }]);
};

export const showCustomAlertWithMsg = (msg, navigation) => {
  navigation.navigate("CustomMsgAlert", {
    msg: msg,
  });
};

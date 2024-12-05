//#region import
import React, { useEffect } from "react";
import {
  Image,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
//local
import { ovnioColors, scaleXiPhone15 } from "../../../../utils/Variable";
import { stylesCommon } from "../../../../utils/CommonStyle";
//#endregion

//#region Main
export default Live = ({ navigation }) => {
  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: ovnioColors.background,
      }}
    ></SafeAreaView>
  );
};

const styles = StyleSheet.create({
  title: {
    ...stylesCommon.titleWelcome,
  },
});

//#endregion

//#region import
import React from "react";
import { View, Text, StyleSheet } from "react-native";
//utils
import { ovnioColors, fonts, scaleXiPhone15 } from "../../utils/Variable";
import { stylesCommon } from "../../utils/CommonStyle";
//#endregion

const PopupHeader = ({ title }) => {
  return (
    <View style={styles.container}>
      <View style={styles.line} />
      <Text style={[styles.title]}>{title}</Text>
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    paddingHorizontal: scaleXiPhone15.sixteenH,
    gap: scaleXiPhone15.sixteenH,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: ovnioColors.background,
  },
  line: {
    borderRadius: scaleXiPhone15.fourH,
    height: scaleXiPhone15.fourH,
    width: scaleXiPhone15.sixtyH,
    backgroundColor: "#8E8E8E",
  },
  title: {
    ...stylesCommon.titleWelcome,
  },
});

export default PopupHeader;

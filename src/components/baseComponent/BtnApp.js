//#region import
import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
//misc
import CustomLoader from "./CustomLoader";
import { ovnioColors, fonts, scaleXiPhone15 } from "../../utils/Variable";
import { stylesCommon } from "../../utils/CommonStyle";
//#endregion

const BtnApp = ({ title, marginVertical, onPress, isAPICall }) => {
  return (
    <TouchableOpacity
      disabled={isAPICall}
      style={[
        styles.button,
        { marginVertical: marginVertical ? marginVertical : 0 },
      ]}
      onPress={onPress}
    >
      {isAPICall ? (
        <CustomLoader isSmall={true} />
      ) : (
        <Text style={styles.buttonText}>{title}</Text>
      )}
    </TouchableOpacity>
  );
};
const styles = StyleSheet.create({
  button: {
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
    paddingHorizontal: scaleXiPhone15.sixteenW,
    height: scaleXiPhone15.fivtyH,
    borderRadius: scaleXiPhone15.fourH,
    backgroundColor: ovnioColors.primaryRed,
  },
  buttonText: {
    ...stylesCommon.txtBtn,
    //paddingVertical: scaleXiPhone15.sixteenH,
  },
});

export default BtnApp;

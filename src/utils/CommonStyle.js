import React from "react";
import { StyleSheet, Dimensions } from "react-native";
const { height, width } = Dimensions.get("window");
import { scaleXiPhone15, fonts, ovnioColors, checkForTablet } from "./Variable";

const stylesCommon = StyleSheet.create({
  elvation: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: scaleXiPhone15.twoH },
    shadowOpacity: scaleXiPhone15.oneH,
    shadowRadius: scaleXiPhone15.twoH,
    elevation: scaleXiPhone15.twoH,
  },
  titleWelcome: {
    fontSize: scaleXiPhone15.twentyH,
    fontFamily: fonts.bold,
    color: ovnioColors.white,
    textAlign: "center",
  },
  subTitleWelcome: {
    fontSize: scaleXiPhone15.fouteenH,
    fontFamily: fonts.regular,
    color: ovnioColors.white,
    textAlign: "center",
  },
  txtInput: {
    fontFamily: fonts.regular,
    color: ovnioColors.white,
    fontSize: checkForTablet() ? 22 : 15,
  },
  txtFgetPswd: {
    color: ovnioColors.primaryRed,
    fontFamily: fonts.bold,
    fontSize: scaleXiPhone15.fouteenH,
  },
  txtBtn: {
    fontSize: scaleXiPhone15.sixteenH,
    fontFamily: fonts.bold,
    color: ovnioColors.white,
    textAlign: "center",
  },
  txtCtryName: {
    fontFamily: fonts.medium,
    fontSize: scaleXiPhone15.sixteenH,
    color: ovnioColors.blackContainerBg,
  },
  txtGuideTime: {
    fontSize: scaleXiPhone15.twelveH,
    fontFamily: fonts.regular,
    color: ovnioColors.grayDesc,
  },
  plugrDrawerTxt: {
    fontFamily: fonts.medium,
    fontSize: scaleXiPhone15.sixteenH,
  },
});

export { stylesCommon };

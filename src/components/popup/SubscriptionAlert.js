//#region import
import React, { useState, useEffect } from "react";
import {
  Text,
  View,
  StyleSheet,
  TouchableOpacity,
  Linking,
} from "react-native";
//misc
import {
  fonts,
  ovnioColors,
  scaleXiPhone15,
  checkForTablet,
} from "../../utils/Variable";
import Ionicons from "react-native-vector-icons/Ionicons";
import { stylesCommon } from "../../utils/CommonStyle";
import CustomLoader from "../baseComponent/CustomLoader";
//api
import GlobalValue from "../../api/GlobalVar";
//#endregion

//#region Main
export default SubscriptionAlert = ({ navigation, route }) => {
  console.log("\u001b[1;33mSA.js | freeHrsLeft = ", GlobalValue.freeHrsLeft);

  //#region action
  const onSubmitPress = () => {
    navigation.goBack();
    return;

    if (GlobalValue.freeHrsLeft <= 0) {
      console.log(
        "\u001b[1;33mSL.js | freeHrsLeft is consumed already = ",
        GlobalValue.freeHrsLeft
      );
      Linking.openURL(
        "https://zealous-cliff-082548f0f.5.azurestaticapps.net/"
      ).catch((err) => console.error("An error occurred", err));
    } else {
      navigation.goBack();
    }
  };
  //#endregion

  return (
    <View style={styles.container}>
      <View style={styles.centeredView}>
        <CrossComp onSubmitPress={onSubmitPress} />
        <View style={styles.containerAlert}>
          <Ionicons
            name="information-circle-outline"
            size={scaleXiPhone15.sixtyH}
            color={ovnioColors.primaryRed}
          />
          <Text style={styles.txtTite}>{getTitleText()}</Text>
          <Text
            style={[
              styles.txtSubTitle,
              { marginHorizontal: scaleXiPhone15.sixteenH },
            ]}
          >
            {getMiddleText()}
          </Text>
          <SubmitComp onSubmitPress={onSubmitPress} />
        </View>
      </View>
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  centeredView: {
    gap: scaleXiPhone15.twelveH,
    padding: scaleXiPhone15.eightH,
    width: checkForTablet() ? "60%" : "90%",
    justifyContent: "center",
    alignItems: "center",
    //backgroundColor: ovnioColors.white,
  },
  containerCross: {
    justifyContent: "center",
    alignItems: "center",
    height: scaleXiPhone15.sixtyH,
    width: scaleXiPhone15.sixtyH,
    borderRadius: scaleXiPhone15.sixtyH * 0.5,
    backgroundColor: ovnioColors.blackContainerBg,
  },
  containerAlert: {
    //paddingHorizontal: scaleXiPhone15.eightH,
    gap: scaleXiPhone15.twelveH,
    paddingTop: scaleXiPhone15.twentyFourH,
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: scaleXiPhone15.tenW,
    backgroundColor: ovnioColors.white,
  },
  containerBtmBtn: {
    marginTop: scaleXiPhone15.sixteenH,
    paddingVertical: scaleXiPhone15.sixteenH,
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
    borderBottomLeftRadius: scaleXiPhone15.tenW,
    borderBottomRightRadius: scaleXiPhone15.tenW,
    backgroundColor: ovnioColors.primaryRed,
  },
  txtTite: {
    textAlign: "center",
    fontFamily: fonts.bold,
    fontSize: scaleXiPhone15.sixteenH,
    color: ovnioColors.blackContainerBg,
    // backgroundColor: "red",
  },
  txtSubTitle: {
    textAlign: "center",
    fontFamily: fonts.regular,
    fontSize: scaleXiPhone15.fouteenH,
    color: "#8E8E8E",
    //backgroundColor: "red",
  },
});
//#endregion

//#region JSX
const getTitleText = () => {
  if (GlobalValue.freeHrsLeft <= 0) {
    return "Your Free Access Has Expired!";
  } else {
    return "Enjoy Free Access for 24 Hours!";
  }
};
const getMiddleText = () => {
  if (GlobalValue.freeHrsLeft <= 0) {
    return "You’ve enjoyed 24 hours of free access to Dropz. Don't miss out on more amazing content!";
  } else {
    return "Unlock one channel and enjoy it for free for the next 24 hours.Don’t miss out on this limited-time offer!";
  }
};
const getBtnText = () => {
  if (GlobalValue.freeHrsLeft <= 0) {
    return "Subscribe Now to Continue Watching";
  } else {
    return "Unlock Now";
  }
};
const CrossComp = (prop) => {
  return (
    <TouchableOpacity
      onPress={prop.onSubmitPress}
      style={styles.containerCross}
    >
      <Ionicons
        name="close"
        size={scaleXiPhone15.fortyH}
        color={ovnioColors.white}
      />
    </TouchableOpacity>
  );
};
const SubmitComp = (prop) => {
  return (
    <TouchableOpacity
      style={styles.containerBtmBtn}
      onPress={prop.onSubmitPress}
    >
      <Text style={stylesCommon.txtBtn}>{getBtnText()}</Text>
    </TouchableOpacity>
  );
};
//#endregion

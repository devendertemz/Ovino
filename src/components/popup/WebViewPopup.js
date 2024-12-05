//#region import
import React, { useState, useEffect } from "react";
import {
  Modal,
  FlatList,
  Text,
  View,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
} from "react-native";
const height = Dimensions.get("window").height;
import Ionicons from "react-native-vector-icons/Ionicons";
import WebView from "react-native-webview";
//baseComponent
import CustomLoader from "../baseComponent/CustomLoader";

//utils
import {
  appSize,
  fonts,
  ovnioColors,
  scaleXiPhone15,
  checkForTablet,
} from "../../utils/Variable";

import { stylesCommon } from "../../utils/CommonStyle";
//#endregion

//#region Main
export default WebViewPopup = (prop) => {
  return (
    <Modal animationType="fade" transparent={true} visible={prop.status}>
      <View style={styles.centeredView}>
        <View style={[styles.container]}>
          <HeaderPopUp
            name={prop.selItem.name ? prop.selItem.name : ""}
            onClose={prop.onClose}
          />
          <View style={styles.containerWeb}>
            <WebView
              style={styles.webView}
              originWhitelist={["*"]}
              source={{
                uri: prop.selItem.url,
              }}
            />
          </View>
        </View>
      </View>
    </Modal>
  );
};
const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: "flex-end",
    backgroundColor: "rgba(52, 52, 52, 0.7)",
  },
  container: {
    //backgroundColor: "yellow",
  },
  containerWeb: {
    width: "100%",
    height: height * 0.6,
    //backgroundColor: "pink",
  },
  webView: {
    width: "100%",
    height: "100%",
    backgroundColor: ovnioColors.blackContainerBg,
  },
});
//#endregion

//#region HeaderPopUp
const HeaderPopUp = (prop) => {
  return (
    <View style={styleH.container}>
      <Text numberOfLines={1} style={styleH.txtTitle}>
        {prop.name}
      </Text>
      <TouchableOpacity onPress={() => prop.onClose()}>
        <Ionicons
          name="close"
          size={scaleXiPhone15.thrityH}
          color={ovnioColors.white}
        />
      </TouchableOpacity>
    </View>
  );
};
const styleH = StyleSheet.create({
  container: {
    paddingHorizontal: scaleXiPhone15.eightH,
    paddingVertical: scaleXiPhone15.eightH,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: ovnioColors.primaryRed,
  },
  txtTitle: {
    flex: 1,
    fontFamily: fonts.bold,
    fontSize: scaleXiPhone15.twelveH,
    color: "white",
  },
});

//#endregion

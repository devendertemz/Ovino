//#region import
import React, { useState, useEffect } from "react";
import { Text, View, StyleSheet, TouchableOpacity } from "react-native";
//misc
import {
  appSize,
  fonts,
  ovnioColors,
  scaleXiPhone15,
  checkForTablet,
} from "../../utils/Variable";
import Ionicons from "react-native-vector-icons/Ionicons";
import BtnApp from "../baseComponent/BtnApp";
//#endregion

//#region CustomMsgAlert
export default CustomMsgAlert = ({ navigation, route }) => {
  const { msg } = route.params;
  return (
    <View style={styles.container}>
      <View style={styles.centeredView}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.containerCross}
        >
          <Ionicons
            name="close"
            size={scaleXiPhone15.thrityH}
            color={ovnioColors.primaryRed}
          />
        </TouchableOpacity>
        <Text style={styles.text}>{msg}</Text>
        <View style={[styles.bottomView]}>
          <BtnApp title="OK" onPress={() => navigation.goBack()} />
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
    gap: scaleXiPhone15.eightH,
    paddingTop: scaleXiPhone15.eightH,
    paddingHorizontal: scaleXiPhone15.sixteenH,
    borderRadius: scaleXiPhone15.eightH,
    width: checkForTablet() ? "60%" : "90%",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: ovnioColors.white,
  },
  containerCross: {
    alignItems: "flex-end",
    width: "100%",
    //backgroundColor: "green",
  },

  text: {
    textAlign: "center",
    fontFamily: fonts.medium,
    color: "black",
    fontSize: scaleXiPhone15.sixteenH,
  },
  bottomView: {
    marginTop: scaleXiPhone15.eightH,
    paddingBottom: scaleXiPhone15.twelveH,
    width: "100%",
    alignSelf: "center",
  },
});
//#endregion

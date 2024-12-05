//#region import
import React, { useState } from "react";
import {
  View,
  TextInput,
  Text,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
//package
import Feather from "react-native-vector-icons/Feather";
//utils
import { ovnioColors, fonts, scaleXiPhone15 } from "../../utils/Variable";
import { stylesCommon } from "../../utils/CommonStyle";
//#endregion

//#region Main
const MobileNoTextInputWithLabel = ({
  marginBottom,
  value,
  onChangeText,
  onDialCodeSel,
  dialCode,
  placeholder, //optional
}) => {
  return (
    <View
      style={[
        styleMIT.containerMain,
        { marginBottom: marginBottom ? marginBottom : 0 },
      ]}
    >
      <Text style={styleMIT.label}>{placeholder}</Text>
      <View style={[styleMIT.container]}>
        <TouchableOpacity
          activeOpacity={0.5}
          style={styleMIT.containerDialCd}
          onPress={onDialCodeSel}
        >
          <Text style={styleMIT.txtDialCd}>
            {dialCode ? "+" + dialCode : ""}
          </Text>
          <Feather
            name={"chevron-down"}
            size={scaleXiPhone15.twentyFourH}
            style={{
              color: ovnioColors.white,
            }}
          />
          <View style={styleMIT.sepLine}></View>
        </TouchableOpacity>
        <TextInput
          style={[styleMIT.containerInput, { flex: 0.8 }]}
          placeholder={placeholder}
          placeholderTextColor="#999"
          maxLength={50}
          keyboardType={"numeric"}
          onChangeText={onChangeText}
          value={value}
          secureTextEntry={false}
        />
      </View>
    </View>
  );
};
const styleMIT = StyleSheet.create({
  containerMain: {
    alignItems: "flex-start",
  },
  container: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",

    borderRadius: scaleXiPhone15.fourH,
    borderWidth: scaleXiPhone15.twoH,
    borderColor: "#8E8E8E",
    backgroundColor: "#161616",
  },
  containerDialCd: {
    padding: scaleXiPhone15.fourH,
    flex: 0.2,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    //backgroundColor: "blue",
  },
  txtDialCd: {
    flex: 1,
    textAlign: "center",
    fontFamily: fonts.medium,
    fontSize: scaleXiPhone15.fouteenH,
    color: ovnioColors.white,
    //backgroundColor: "pink",
  },
  sepLine: {
    height: "100%",
    width: 0.5,
    backgroundColor: ovnioColors.grayDesc,
    position: "absolute",
    right: scaleXiPhone15.twoH,
  },
  containerInput: {
    //paddingVertical: 8,
    paddingVertical: scaleXiPhone15.sixteenH,
    paddingHorizontal: scaleXiPhone15.fouteenH,
    fontFamily: fonts.regular,
    ...stylesCommon.txtInput,
  },
  label: {
    color: ovnioColors.white,
    fontFamily: fonts.medium,
    fontSize: scaleXiPhone15.fouteenH,
    lineHeight: scaleXiPhone15.twelveH,
    paddingVertical: scaleXiPhone15.eightH,
  },
});
//#endregion

export default MobileNoTextInputWithLabel;

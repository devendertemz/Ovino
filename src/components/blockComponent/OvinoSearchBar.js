//#region import
import React, { useState } from "react";
import {
  View,
  TextInput,
  StyleSheet,
  Text,
  TouchableOpacity,
} from "react-native";
//package
import Feather from "react-native-vector-icons/Feather";
//misc
import { stylesCommon } from "../../utils/CommonStyle";
import TextInputField from "./TextInputField";
import {
  ovnioColors,
  fonts,
  appSize,
  scaleXiPhone15,
} from "../../utils/Variable";
//#endregion

//#region OvinoSearchBar
const OvinoHomeSearchBar = (props) => {
  return (
    <View
      style={{
        flexDirection: "row",
        alignItems: "center",
        padding: scaleXiPhone15.eightH,
        gap: scaleXiPhone15.eightH,
        // backgroundColor: 'lightgreen',
      }}
    >
      <View style={{ flex: 1, height: scaleXiPhone15.fivtyH }}>
        <TextInputField
          marginBottom={0}
          icon="search"
          placeholder="Search"
          value={props.sch}
          onChangeText={props.setSearch}
        />
      </View>

      <Text
        onPress={props.onCancelClick}
        style={{
          fontFamily: fonts.medium,
          color: ovnioColors.white,
          fontSize: scaleXiPhone15.fouteenH,
          //backgroundColor: "gray",
        }}
      >
        Cancel
      </Text>
    </View>
  );
};
//#endregion

//#region OvinoChatSearchBar
const OvinoChatSearchBar = (props) => {
  return (
    <View style={styleChatHead.container}>
      <TextInput
        style={styleChatHead.text}
        autoCorrect={false}
        spellCheck={false}
        allowFontScaling={false}
        numberOfLines={1}
        placeholder={props.placeholder}
        placeholderTextColor="#999"
        value={props.sch}
        onChangeText={props.setSearch}
      />
      <View style={{ flex: 0.1, alignItems: "flex-end" }}>
        <Feather
          name={props.icon}
          size={scaleXiPhone15.twentyFourH}
          color="#FFFFFF"
        />
      </View>
    </View>
  );
};
//#endregion

//#region OvinoReqSearchBar
const OvinoReqSearchBar = (props) => {
  return (
    <View style={styleChatHead.container}>
      <TextInput
        style={styleChatHead.text}
        autoCorrect={false}
        spellCheck={false}
        allowFontScaling={false}
        numberOfLines={1}
        placeholder={props.placeholder}
        placeholderTextColor="#999"
        value={props.sch}
        onChangeText={props.setSearch}
      />
      <View style={{ flex: 0.1, alignItems: "flex-end" }}>
        <Feather
          name={props.icon}
          size={scaleXiPhone15.twentyFourH}
          color="#FFFFFF"
        />
      </View>
    </View>
  );
};
//#endregion

//#region LoopzSearchBar
const LoopzSearchBar = (props) => {
  return (
    <View style={styleLoopz.container}>
      <TextInput
        style={styleLoopz.text}
        autoCorrect={false}
        spellCheck={false}
        allowFontScaling={false}
        numberOfLines={1}
        placeholder={props.placeholder}
        placeholderTextColor="#999"
        value={props.sch}
        onChangeText={props.setSearch}
      />
      <TouchableOpacity
        onPress={props.onClearClick}
        style={{ flex: 0.1, alignItems: "flex-end" }}
      >
        <Feather
          name={props.icon}
          size={scaleXiPhone15.twentyFourH}
          color={ovnioColors.txtOffWhite}
        />
      </TouchableOpacity>
    </View>
  );
};
const styleLoopz = StyleSheet.create({
  container: {
    height: scaleXiPhone15.fivtySixH,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    // backgroundColor: 'blue',
  },
  text: {
    flex: 0.9,
    ...stylesCommon.txtInput,
    paddingVertical: scaleXiPhone15.sixteenH,
    paddingHorizontal: scaleXiPhone15.fouteenH,
    borderRadius: scaleXiPhone15.eightH,
    backgroundColor: "#161616",
    borderColor: ovnioColors.txtOffWhite,
    borderWidth: scaleXiPhone15.oneH,
  },
});
//#endregion

//#region StyleSheet
const styleChatHead = StyleSheet.create({
  container: {
    height: scaleXiPhone15.fivtyH,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    //backgroundColor: "blue",
  },
  text: {
    flex: 0.9,
    ...stylesCommon.txtInput,
    paddingVertical: scaleXiPhone15.sixteenH,
    paddingHorizontal: scaleXiPhone15.fouteenH,
    borderRadius: scaleXiPhone15.eightH,
    backgroundColor: "#232325",
  },
});
//#endregion

export {
  OvinoHomeSearchBar,
  OvinoChatSearchBar,
  OvinoReqSearchBar,
  LoopzSearchBar,
};

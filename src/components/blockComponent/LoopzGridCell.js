//#region import
import React, { useState, useEffect } from "react";
import {
  TouchableOpacity,
  Dimensions,
  View,
  StyleSheet,
  Text,
  Image,
} from "react-native";
const { height, width } = Dimensions.get("window");
//utils
import { fonts, ovnioColors, scaleXiPhone15 } from "../../utils/Variable";
//#endregion

//#region ProfileCompGrid - FollowAndFollowing.js
const ProfileCompGrid = (props) => {
  const { item } = props;

  return (
    <View style={stylesPCG.prflCont}>
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          gap: scaleXiPhone15.eightH,
        }}
      >
        <Image
          source={{
            uri: "https://plus.unsplash.com/premium_photo-1664474619075-644dd191935f?fm=jpg&q=60&w=3000&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8aW1hZ2V8ZW58MHx8MHx8fDA%3D",
          }}
          style={stylesPCG.profileIcon}
        />

        <View>
          <Text style={stylesPCG.prflTitle}>
            {item.first_name}&nbsp;{item.last_name}
          </Text>
          <Text
            style={[stylesPCG.prflTitle, { fontSize: scaleXiPhone15.fouteenH }]}
          >
            {item.username ? item.username : "Loopz user"}
          </Text>
        </View>
      </View>
      <TouchableOpacity
        style={[stylesPCG.btnBg]}
        onPress={() => console.log("clicked")}
      >
        <Text style={[stylesPCG.btnTxt]}>{"Send"}</Text>
      </TouchableOpacity>
    </View>
  );
};
const stylesPCG = StyleSheet.create({
  prflCont: {
    flexDirection: "row",
    gap: scaleXiPhone15.eightH,

    alignItems: "center",

    //backgroundColor: 'red',

    justifyContent: "space-between",
  },

  prflTitle: {
    fontSize: scaleXiPhone15.sixteenH,
    fontWeight: "800",
    fontFamily: fonts.medium,
    color: ovnioColors.white,
    // textAlign: 'center',
    lineHeight: scaleXiPhone15.eightteenH,
  },

  profileIcon: {
    width: scaleXiPhone15.fivtySixH,
    height: scaleXiPhone15.fivtySixH,
    borderRadius: scaleXiPhone15.fivtySixH / 2,
  },

  btnBg: {
    paddingHorizontal: scaleXiPhone15.fouteenH,
    paddingVertical: scaleXiPhone15.sixH,
    borderRadius: scaleXiPhone15.fourH,
    backgroundColor: ovnioColors.primaryRed,
  },
  btnTxt: {
    fontSize: scaleXiPhone15.twelveH,
    fontFamily: fonts.bold,
    color: "#000000",
  },
});
//#endregion

export { ProfileCompGrid };

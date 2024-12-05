//#region import
import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
//package
import Ionicons from "react-native-vector-icons/Ionicons";
import { useNavigation } from "@react-navigation/native";
//utils
import { ovnioColors, fonts, scaleXiPhone15 } from "../../utils/Variable";
import { stylesCommon } from "../../utils/CommonStyle";
//#endregion

const HeaderRightIcon = ({
  title,
  onBackBtnPress,
  onFavBtnPress,
  onShareBtnPress,
  iconRightOne,
  iconRightTwo,
}) => {
  return (
    <View style={styles.headerContainer}>
      <TouchableOpacity style={{ flex: 0.2 }} onPress={onBackBtnPress}>
        <Ionicons
          name="arrow-back"
          size={scaleXiPhone15.thrityH}
          color="white"
        />
      </TouchableOpacity>
      <Text numberOfLines={1} style={[styles.title, { flex: 0.6 }]}>
        {title}
      </Text>
      <View style={{ flex: 0.2, flexDirection: "row" }}>
        <TouchableOpacity
          style={{
            marginLeft: "auto", // Push the icon to the right
          }}
          onPress={onFavBtnPress}
        >
          <Ionicons
            name={iconRightOne}
            size={scaleXiPhone15.thrityH}
            color={ovnioColors.primaryRed}
          />
        </TouchableOpacity>
        <TouchableOpacity
          style={{
            marginLeft: "auto", // Push the icon to the right
          }}
          onPress={onShareBtnPress}
        >
          <Ionicons
            name={iconRightTwo}
            size={scaleXiPhone15.thrityH}
            color="white"
          />
        </TouchableOpacity>
      </View>
    </View>
  );
};
const styles = StyleSheet.create({
  headerContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: scaleXiPhone15.tenH,
    paddingHorizontal: scaleXiPhone15.twelveW,
    backgroundColor: ovnioColors.background,
    //backgroundColor: "yellow",
  },
  title: {
    ...stylesCommon.titleWelcome,

    //backgroundColor: "pink",
  },
});

export default HeaderRightIcon;

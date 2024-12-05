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

const Header = ({
  isBackDisable = false,
  title,
  actionText,
  onBackBtnPress,
  onActionBtnPress,
}) => {
  if (isBackDisable) {
    return (
      <View style={styles.headerContainer}>
        <Text style={[styles.title, { flex: 1 }]}>{title}</Text>
      </View>
    );
  } else {
    return (
      <View style={styles.headerContainer}>
        <TouchableOpacity style={{ flex: 0.2 }} onPress={onBackBtnPress}>
          <Ionicons
            name="arrow-back"
            size={scaleXiPhone15.twentyFourH}
            color="white"
          />
        </TouchableOpacity>
        <Text style={[styles.title, { flex: 0.6 }]}>{title}</Text>
        <TouchableOpacity style={{ flex: 0.2 }} onPress={onActionBtnPress}>
          <Text style={styles.actionText}>{actionText}</Text>
        </TouchableOpacity>
      </View>
    );
  }
};
const styles = StyleSheet.create({
  headerContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: scaleXiPhone15.sixteenH,
    paddingHorizontal: scaleXiPhone15.sixteenW,
    backgroundColor: ovnioColors.background,
    //backgroundColor: "yellow",
  },
  title: {
    ...stylesCommon.titleWelcome,
  },
  actionText: {
    textAlign: "right",
    color: ovnioColors.primaryRed,
    fontSize: scaleXiPhone15.twelveH,
    fontFamily: fonts.bold,
  },
});

export default Header;

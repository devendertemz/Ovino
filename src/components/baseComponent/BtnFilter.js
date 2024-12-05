//#region import
import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Dimensions,
  StyleSheet,
  Image,
} from "react-native";
const { height, width } = Dimensions.get("window");
import Ionicons from "react-native-vector-icons/Ionicons";
import { ovnioColors, fonts, scaleXiPhone15 } from "../../utils/Variable";
//#endregion

//#region asset
const filter = require("../../assets/images/filter/filter.png");
//#endregion

//#region Main
const BtnFilter = ({ onPress }) => {
  return (
    <TouchableOpacity style={styles.container} onPress={onPress}>
      <View style={styles.containerIcon}>
        <Image
          source={filter}
          style={{
            width: scaleXiPhone15.twentyFourH,
            height: scaleXiPhone15.twentyFourH,
          }}
        />
      </View>
    </TouchableOpacity>
  );
};
const styles = StyleSheet.create({
  container: {
    bottom: height / 10,
    position: "absolute",
    right: 0,
  },
  containerIcon: {
    height: scaleXiPhone15.fortyH,
    width: scaleXiPhone15.sixtyH,
    borderTopLeftRadius: scaleXiPhone15.twentyH,
    borderBottomLeftRadius: scaleXiPhone15.twentyH,

    justifyContent: "center",
    alignItems: "center",
    backgroundColor: ovnioColors.primaryRed,
  },
});
//#endregion

export default BtnFilter;

//#region import
import React from "react";
import { View, Text, StyleSheet, Image } from "react-native";
import { fonts, ovnioColors, scaleXiPhone15 } from "../../utils/Variable";
import Ionicons from "react-native-vector-icons/Ionicons";
//#endregion

//#region asset
const icEmpty = require("../../assets/icon/emptybox.png");
//#endregion

//#region EmptyListComp
export default EmptyListComp = (prop) => {
  return (
    <View style={stylesEmptyList.containerBox}>
      {prop.ionIcons ? (
        <Ionicons
          name={prop.ionIcons}
          size={scaleXiPhone15.hundredTwentyW}
          color={ovnioColors.grayIconColor}
        />
      ) : (
        <Image
          style={{ tintColor: ovnioColors.grayIconColor }}
          source={prop.imgEmpty ? prop.imgEmpty : icEmpty}
        />
      )}

      <Text style={stylesEmptyList.txtHead}>{prop.title}</Text>
      <Text style={[stylesEmptyList.txtdes, { marginTop: 16 }]}>
        {prop.desc}
      </Text>
    </View>
  );
};
const stylesEmptyList = StyleSheet.create({
  containerBox: {
    alignItems: "center",
    flex: 1,
    justifyContent: "center",
    padding: 16,
  },
  txtdes: {
    textAlign: "center",
    fontFamily: fonts.medium,
    fontSize: scaleXiPhone15.sixteenH,
    fontWeight: "700",
    color: ovnioColors.white,
  },
  txtHead: {
    textAlign: "center",
    fontFamily: fonts.medium,
    fontSize: scaleXiPhone15.twentyFourH,
    //fontWeight: "500",
    color: ovnioColors.white,
  },
});
//#endregion

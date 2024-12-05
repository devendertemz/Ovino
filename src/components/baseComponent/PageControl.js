//#region import
import React from "react";
import { View, Dimensions, StyleSheet } from "react-native";
import { ovnioColors, appSize, scaleXiPhone15 } from "../../utils/Variable";
const { height, width } = Dimensions.get("window");
//#endregion

//#region PageControl - Welcome.js
const PageControl = (props) => {
  return (
    <View style={styles.containerMain}>
      <PageDot isSel={props.selIndex === 0} />
      <PageDot isSel={props.selIndex === 1} />
      <PageDot isSel={props.selIndex === 2} />
    </View>
  );
};
//#endregion

//#region PageDot
const PageDot = (props) => {
  if (props.isSel) {
    return <View style={styles.dotSel}></View>;
  } else {
    return <View style={styles.dotNormal}></View>;
  }
};
//#endregion

//#region StyleSheet
const styles = StyleSheet.create({
  containerMain: {
    flexDirection: "row",
    marginTop: appSize.ten,
    //backgroundColor: 'blue',
  },
  dotSel: {
    margin: appSize.four,
    height: scaleXiPhone15.tenH,
    width: scaleXiPhone15.tenH,
    borderRadius: scaleXiPhone15.tenH * 0.5,
    backgroundColor: ovnioColors.primaryRed,
  },
  dotNormal: {
    margin: appSize.four,
    height: scaleXiPhone15.tenH,
    width: scaleXiPhone15.tenH,
    borderRadius: scaleXiPhone15.tenH * 0.5,
    backgroundColor: ovnioColors.grayDot,
  },
});
//#endregion

export { PageControl };

//#region import
import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, Dimensions } from "react-native";
import { ovnioColors } from "../../utils/Variable";
import { scaleXiPhone15 } from "../../utils/Variable";
//#endregion

//#region RowSeparator
const RowSeparator = (prop) => (
  <View
    style={{
      marginHorizontal: prop.marginHorizontal ? prop.marginHorizontal : 0,
      marginTop: prop.marginTop ? prop.marginTop : 0,
      marginBottom: prop.marginBottom ? prop.marginBottom : 0,
      backgroundColor: ovnioColors.grayDesc,
      height: scaleXiPhone15.oneH,
    }}
  />
);
//#endregion

export default RowSeparator;

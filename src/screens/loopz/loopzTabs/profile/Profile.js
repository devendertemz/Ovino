//#region import
import React, { useEffect } from "react";
import {
  Image,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
//local
import { ovnioColors, scaleXiPhone15 } from "../../../../utils/Variable";
import { stylesCommon } from "../../../../utils/CommonStyle";
import BtnApp from "../../../../components/baseComponent/BtnApp";

//#region Main
export default Profile = ({ navigation }) => {
  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: ovnioColors.background,
      }}
    ></SafeAreaView>
  );
};

//#endregion

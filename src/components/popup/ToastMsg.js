//#region import
import React, { useState, useEffect } from "react";
import { View, StyleSheet } from "react-native";
import BtnApp from "../baseComponent/BtnApp";
//#endregion

//#region Main
export default ToastMsg = ({ navigation, route }) => {
  const { btnTitle } = route.params;
  const timeoutId = setTimeout(() => {
    navigation.goBack();
  }, 2000);
  const btnClick = () => {
    clearTimeout(timeoutId);
    navigation.goBack();
  };
  return (
    <View style={styles.container}>
      <BtnApp title={btnTitle} onPress={btnClick} />
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    top: "10%",
    paddingHorizontal: "8%",
  },
});
//#endregion

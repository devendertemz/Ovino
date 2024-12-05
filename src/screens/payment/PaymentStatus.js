//#region import
import {
  StyleSheet,
  Dimensions,
  SafeAreaView,
  View,
  Image,
  Text,
  TouchableOpacity,
} from "react-native";
import React, { useEffect, useRef, useState } from "react";
const { height, width } = Dimensions.get("window");

//baseComponents

//util
import TextStrings from "../../utils/TextStrings";
import { ovnioColors, fonts, appSize } from "../../utils/Variable";
//#endregion

//#endregion
import Icon from "react-native-vector-icons/FontAwesome";

//#region Main
export default function PaymentStatus({ navigation }) {
  return (
    <SafeAreaView backgroundColor={ovnioColors.background} flex={1}>
      <View
        style={{
          alignItems: "center",
          justifyContent: "center",
          flex: 1,
        }}
      >
        <Icon name="arrow-circle-o-right" size={60} color={ovnioColors.white} />
        <Text style={[styles.desc, { marginTop: 20 }]}>
          Your plan has been successfully
        </Text>
        <Text style={styles.desc}>Now Enjoy!</Text>
        <View
          style={{
            marginVertical: 20,
            width: 120,
            height: 120,

            borderRadius: 80,
            backgroundColor: "red",

            justifyContent: "center",
          }}
        >
          <Text
            style={{
              fontFamily: fonts.bold,
              fontSize: appSize.eighteen,
              textAlign: "center",
              color: ovnioColors.white,
            }}
          >
            Basic
          </Text>
          <Text
            style={{
              fontFamily: fonts.bold,
              fontSize: appSize.twentyFive,
              textAlign: "center",
              color: ovnioColors.white,
            }}
          >
            $150
          </Text>

          <Text
            style={{
              fontFamily: fonts.bold,
              fontSize: appSize.ten,
              textAlign: "center",
              color: ovnioColors.white,
            }}
          >
            for 3 months
          </Text>
        </View>
        <Text style={[styles.desc, { fontSize: appSize.twelve }]}>
          Next Billing: 20 June, 2019
        </Text>
      </View>
    </SafeAreaView>
  );
}
const styles = StyleSheet.create({
  desc: {
    margin: appSize.two,
    fontFamily: fonts.regular,
    fontSize: appSize.eighteen,

    color: ovnioColors.grayDesc,
    textAlign: "center",
    lineHeight: appSize.eighteen,
  },
});
//#endregion

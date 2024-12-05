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
import { ovnioColors, scaleXiPhone15, APP_SCREEN } from "../../utils/Variable";
import { stylesCommon } from "../../utils/CommonStyle";
//#endregion

//#region asset
const plugerLogo = require("../../assets/images/header/header.png");
const plugrLoopz = require("../../assets/images/lopz/splashOption/plugrLoopz.png");
const plugrWatch = require("../../assets/images/lopz/splashOption/plugrWatch.png");
//#endregion

//#region Main
export default SplashOption = ({ navigation }) => {
  //FROM - Login.js | RegPrefrences.js | SpashScreen.js

  const onPlugrWatchClick = () => {
    navigation.navigate("WatchAppStack", {
      screen: "BtmTabs",
      params: {
        screen: "Home",
      },
    });
  };
  const onPlugrLoopzClick = () => {
    navigation.navigate("LoopzAppStack", {
      screen: APP_SCREEN.LOOPZ_HOME_TABBAR,
      params: {
        screen: "homeloopz",
      },
    });
  };

  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: ovnioColors.background,
      }}
    >
      <View style={styles.topView}>
        <Image
          style={{
            height: scaleXiPhone15.eightyH,
            width: scaleXiPhone15.eightyH,
          }}
          source={plugerLogo}
          resizeMode={"cover"}
        />
        <Text
          style={[
            styles.title,
            {
              paddingVertical: scaleXiPhone15.thrityH,
              lineHeight: scaleXiPhone15.thrityH,
            },
          ]}
        >
          Endless Entertainment {"\n"}with Plugr Watch & Loopz
        </Text>
      </View>
      <View style={styles.centerView}>
        <OptionComp imgName={plugrWatch} onClick={onPlugrWatchClick} />
        <OptionComp
          imgName={plugrLoopz}
          width={true}
          onClick={onPlugrLoopzClick}
        />
      </View>
    </SafeAreaView>
  );
};
const OptionComp = (prop) => {
  return (
    <TouchableOpacity style={[styles.optionBg]} onPress={prop.onClick}>
      <Image source={prop.imgName} resizeMode={"cover"} />
    </TouchableOpacity>
  );
};
const styles = StyleSheet.create({
  optionBg: {
    // backgroundColor: 'red',
    backgroundColor: "#000000",
    marginVertical: scaleXiPhone15.twentyFourH,
    width: scaleXiPhone15.hundredFiftyH,
    height: scaleXiPhone15.hundredFiftyH,
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    ...stylesCommon.titleWelcome,
  },
  topView: {
    alignItems: "center", // Center text horizontally
    marginTop: scaleXiPhone15.sixtyH, // Space from top
  },
  centerView: {
    marginTop: scaleXiPhone15.thrityH,
    alignItems: "center", // Center text horizontally
    justifyContent: "center", // Center content vertically
  },
});
//#endregion

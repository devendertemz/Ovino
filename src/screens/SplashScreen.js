//#region import
import React, { useEffect, useState } from "react";
import { Image, Text, SafeAreaView, View, StyleSheet } from "react-native";
import Video from "react-native-video";
//baseComponent
import CustomLoader from "../components/baseComponent/CustomLoader";
//utils
import { ovnioColors, scaleXiPhone15, APP_SCREEN } from "../utils/Variable";
import { getUserID, getUserSetPin } from "../utils/LocalDataStorage";
//api
import GlobalValue from "../api/GlobalVar";
import { GetUserProfileAPICall } from "../api/GlobalAPICall";
import { GetBrandVideo } from "../api/GetRequest";
import { showAPIError } from "../api/Config";

//#endregion

//#region asset
const splash = require("../assets/images/splash/splash.png");
const plugrLogo = require("../assets/images/header/header.png");
//#endregion

//#region Main
export default SplashScreen = ({ navigation }) => {
  const [brand, setBrand] = useState(null);
  useEffect(() => {
    checkForAutoLogin();
    GetBrandVideoAPICall(setBrand);
  }, []);
  const onVideoEnd = () => {
    console.log("SS.js : onVideoEndCallback = ", Number(GlobalValue.userId));
    if (isNaN(GlobalValue.userId) || Number(GlobalValue.userId) === 0) {
      navigation.navigate("Welcome", {
        navType: 1,
      });
    } else {
      navigation.navigate(APP_SCREEN.APP_SPLASH_OPTION);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={{ color: ovnioColors.white }} onPress={onVideoEnd}>
        FORWARD
      </Text>
      {/*  {brand ? (
        <Video
          source={{
            uri: "https://videos.pexels.com/video-files/3843425/3843425-uhd_1440_2732_25fps.mp4", //brand
          }}
          style={styles.video}
          onEnd={onVideoEnd}
          resizeMode="cover" // Adjust video content ('contain', 'cover', 'stretch', etc.)
          controls={false}
        />
      ) : (
        <CustomLoader />
      )} */}
      {/* <View style={styles.bottomView}>
        <Image style={styles.img} source={plugrLogo} />
      </View> */}
    </SafeAreaView>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    backgroundColor: ovnioColors.background,
  },
  bottomView: {
    position: "absolute",
    bottom: scaleXiPhone15.fivtyH,
    left: 0,
    right: 0,
    backgroundColor: ovnioColors.background,
    alignItems: "center",
  },
  video: {
    flex: 1,
    textAlign: "center",
    width: "100%",
    //height: scaleXiPhone15.threeHunderd,
    backgroundColor: ovnioColors.grayLoopzInActiveColor,
  },
  img: {
    width: scaleXiPhone15.hundredH, // Set your width
    height: scaleXiPhone15.hundredH, // Set your height
    resizeMode: "cover", // Adjust the image content if needed ('contain', 'cover', 'stretch', etc.)
    backgroundColor: ovnioColors.background,
  },
});
//#endregion

//#region API
async function checkForAutoLogin() {
  const userid = await getUserID();
  console.log("\u001b[1;35mSS.js :  userid = ", userid);
  if (isNaN(userid) || Number(userid) === 0) {
    GlobalValue.userId = 0;
  } else {
    GlobalValue.userId = userid;
    const pinSet = await getUserSetPin();
    GlobalValue.pinSet = pinSet;
    console.log("\u001b[1;35mSS.js :  pinSet  = ", pinSet);
    GetUserProfileAPICall();
  }
}
async function GetBrandVideoAPICall(setBrand) {
  await GetBrandVideo()
    .then((res) => {
      console.log(
        "\u001b[1;32mSS.js :  brand video = ",
        JSON.stringify(res.data)
      );
      setBrand(res.data.link);
    })
    .catch((error) => {
      showAPIError(error, "Error | User Types");
    });
}
//#endregion

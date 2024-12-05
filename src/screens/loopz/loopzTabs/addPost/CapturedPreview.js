//#region import
import React, { useEffect, useRef, useState } from "react";
import {
  SafeAreaView,
  View,
  StyleSheet,
  TouchableOpacity,
  Text,
  Dimensions,
  Image,
  ImageBackground,
} from "react-native";
//#region package
import Video from "react-native-video";
import Feather from "react-native-vector-icons/Feather";

//#endregion

//#region local
import {
  APP_SCREEN,
  ovnioColors,
  scaleXiPhone15,
} from "../../../../utils/Variable";
import { showAPIError } from "../../../../api/Config";
import BtnApp from "../../../../components/baseComponent/BtnApp";
import FontIcons from "../../../../components/baseComponent/FontIcons";
import { showCustomAlertWithMsg } from "../../../../utils/Alert";
import GlobalValue from "../../../../api/GlobalVar";
//#endregion

//#region Main
export default function CapturedPreview({ navigation, route }) {
  const { mediaObj } = route.params ? route.params : false;
  console.log("mediaObj:--" + JSON.stringify(mediaObj));

  //useState
  const [isVideoPlay, setIsVideoPlay] = useState(false);

  //action
  const onNextClick = () => {
    // return;
    // if (mediaObj.mediaType !== 2) {
    //   showCustomAlertWithMsg('Video is requried for post', navigation);
    //   return;
    // }

    navigation.navigate("AddPost", { mediaObj: mediaObj });
  };
  const onCrossIconClick = () => {
    navigation.goBack();
  };

  //#region video controls
  const onVieoBuffer = ({ isBuffering }) => {
    console.log("onVieoBuffer  " + JSON.stringify(isBuffering));
  };
  const onVieoError = (error) => {
    showAPIError("Error", JSON.stringify(error));
  };
  //#endregion

  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: ovnioColors.background,
      }}
    >
      {isVideoPlay ? (
        <Video
          source={{
            uri: mediaObj.path,
          }}
          style={styles.mediaPreview}
          poster={mediaObj.thumbLink}
          posterResizeMode={"cover"}
          onBuffer={onVieoBuffer}
          onError={onVieoError}
          onEnd={() => setIsVideoPlay(false)} // Callback when video ends
          repeat={false}
          playInBackground={false}
          playWhenInactive={false}
          resizeMode={"cover"}
          autoplay // Autoplay the video
          controls={true}
        />
      ) : (
        <ImageBackground
          style={styles.mediaPreview}
          source={{
            uri: mediaObj.mediaType == 2 ? mediaObj.thumbLink : mediaObj.path,
          }}
        >
          {mediaObj.mediaType == 2 ? (
            <TouchableOpacity
              onPress={() => setIsVideoPlay(true)} // Pause on tap
            >
              <FontIcons
                name="play-large-fill"
                size={scaleXiPhone15.sixtyH}
                color="#fff"
              />
            </TouchableOpacity>
          ) : null}
        </ImageBackground>
      )}
      <HeaderComp onCrossClick={onCrossIconClick} />
      <View style={styles.footer}>
        <View style={{ width: scaleXiPhone15.eightyH, alignSelf: "flex-end" }}>
          <BtnApp
            //isAPICall={loader}
            title="Next"
            marginVertical={scaleXiPhone15.eightH}
            onPress={onNextClick}
          />
        </View>
      </View>
    </SafeAreaView>
  );
}
const HeaderComp = (prop) => {
  return (
    <TouchableOpacity style={styles.containerHead} onPress={prop.onCrossClick}>
      <Feather
        name="x-circle"
        size={scaleXiPhone15.twentyEightH}
        color={ovnioColors.white}
      />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  mediaPreview: {
    flex: 1,

    justifyContent: "center",
    alignItems: "center",
  },
  containerHead: {
    marginLeft: scaleXiPhone15.sixteenH,
    top: GlobalValue.btmSafeArearHt + 24,
    position: "absolute",
    //backgroundColor: "red",
  },
  footer: {
    paddingRight: scaleXiPhone15.eightteenH,
    position: "absolute",
    bottom: scaleXiPhone15.eightteenH,
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
  },
});
//#endregion

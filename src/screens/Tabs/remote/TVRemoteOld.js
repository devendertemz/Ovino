//#region import
import React, { useState, useEffect } from "react";
import {
  Alert,
  View,
  Text,
  Dimensions,
  TouchableOpacity,
  StyleSheet,
  Platform,
  Linking,
  ImageBackground,
  Image,
} from "react-native";
const { height, width } = Dimensions.get("window");
import { useSafeAreaInsets } from "react-native-safe-area-context";
//package
import { BlurView } from "@react-native-community/blur";
import { VolumeManager } from "react-native-volume-manager";

//baseComponent
import CustomLoader from "../../../components/baseComponent/CustomLoader";
//utils
import {
  appSize,
  fonts,
  ovnioColors,
  scaleXiPhone15,
} from "../../../utils/Variable";
import { stylesCommon } from "../../../utils/CommonStyle";
import { removeUserEmail, removeUserID } from "../../../utils/LocalDataStorage";
import DeviceInfo from "react-native-device-info";
const isTablet = DeviceInfo.isTablet();

//api
import { showAPIError } from "../../../api/Config";
import { GetLogOut } from "../../../api/GetRequest";
import {
  PostChannelFind,
  PostChannelNext,
  PostChannelPrevious,
} from "../../../api/PostRequest";
import GlobalValue from "../../../api/GlobalVar";

//#endregion

//#region asset
const remote_bg = require("../../../assets/images/remote/remote_bg/remote_bg.png");
const btnBg = require("../../../assets/icon/remote/btnBg.png");
const btnBgL = require("../../../assets/icon/remote/btnBg.png");
const icRemoteBgAnd = require("../../../assets/images/remote/icRemoteBgAnd.png");
const ic_back = require("../../../assets/icon/remote/back/ic_back.png");
const ic_cross = require("../../../assets/icon/remote/cross/ic_cross.png");
const ic_keypad = require("../../../assets/icon/remote/keypad/ic_keypad.png");
const ic_leftArrow = require("../../../assets/icon/remote/leftArrow/ic_leftArrow.png");
const ic_maximize = require("../../../assets/icon/remote/maximize/ic_maximize.png");
const ic_minus = require("../../../assets/icon/remote/minus/ic_minus.png");
const ic_mute = require("../../../assets/icon/remote/mute/ic_mute.png");
const ic_plus = require("../../../assets/icon/remote/plus/ic_plus.png");
const ic_rightArrow = require("../../../assets/icon/remote/rightArrow/ic_rightArrow.png");
const ic_share = require("../../../assets/icon/remote/share/ic_share.png");
const ic_user = require("../../../assets/icon/remote/user/ic_user.png");
//#endregion

//#region Main
export default function TVRemote({ navigation, route }) {
  const insets = useSafeAreaInsets();
  console.log("\u001b[1;35mR.js insets.top = ", insets.top);

  //#region useState
  const [loader, setLoader] = useState(false);
  const [isLandscape, setIsLandscape] = useState(false);
  const [volume, setVolume] = useState(0);
  const [widthWindow, setWidthWindow] = useState(0);
  console.log("\u001b[1;35mR.js widthWindow = ", widthWindow);
  //#endregion

  //#region useEffect
  console.log(
    "\u001b[1;35mR.js GlobalValue.crtChannel = ",
    GlobalValue.crtChannel
  );
  useEffect(() => {
    // Get the current volume on component mount
    VolumeManager.getVolume().then((currentVolume) => {
      console.log("currentVolume:- " + JSON.stringify(currentVolume));
      setVolume(currentVolume.volume);
    });

    // Subscribe to volume changes
    const volumeListener = VolumeManager.addVolumeListener(({ volume }) => {
      console.log("volumeListener-" + volume);
      setVolume(volume);
    });

    // Cleanup listener on unmount
    return () => {
      volumeListener.remove();
    };
  }, []);
  useEffect(() => {
    Dimensions.addEventListener("change", ({ window: { width, height } }) => {
      if (width < height) {
        setIsLandscape(false);
        setWidthWindow(width);
      } else {
        setIsLandscape(true);
        setWidthWindow(width);
      }
    });
  }, []);
  //#endregion

  //#region action
  const increaseVolume = () => {
    let newVolume = Math.min(volume + 0.1, 1); // Increase volume by 10%
    VolumeManager.setVolume(newVolume);
    console.log("increaseVolume: " + newVolume);
    setVolume(newVolume);
  };
  const decreaseVolume = () => {
    let newVolume = Math.max(volume - 0.1, 0); // Decrease volume by 10%
    VolumeManager.setVolume(newVolume);
    console.log("decreaseVolume: " + newVolume);

    setVolume(newVolume);
  };
  const onRBtnPress = (index) => {
    console.log("index = ", index);
    //return;
    if (index === 1) {
      showAlertForLogout(navigation, setLoader);
    } else if (index === 2) {
      navigation.navigate("Profile");
    } else if (index === 3) {
      navigation.navigate("TV Guide");
    } else if (index === 4) {
    } else if (index === 5) {
      navigation.goBack();
    } else if (index === 6) {
      //maximize
    } else if (index === 7) {
      //share
    } else if (index === 8) {
      if (GlobalValue.crtChannel?.id) {
        navigation.goBack();
        setTimeout(() => {
          navigation.navigate("ShopNow");
        }, 50);
      }
    } else if (index === 9) {
      //on demand
    } else if (index === 100) {
      //on inc volume
      increaseVolume();
    } else if (index === 101) {
      //on prev Channel
      if (GlobalValue.crtChannel?.id) {
        PostChannelPrevAPICall(
          GlobalValue.crtChannel?.id,
          setLoader,
          navigation
        );
      }
    } else if (index === 102) {
      navigation.navigate("Keypad");
    } else if (index === 103) {
      if (GlobalValue.crtChannel?.id) {
        PostChannelNextAPICall(
          GlobalValue.crtChannel?.id,
          setLoader,
          navigation
        );
      }
    } else if (index === 6) {
      //max
    } else if (index === 104) {
      //on dec volume
      decreaseVolume();
    } else if (index >= 500) {
      Linking.openURL("https://www.walmart.com/").catch((err) =>
        console.error("An error occurred", err)
      );
    } else {
      console.log("else");
    }
  };
  //#endregion

  //#region JSX
  const ScreenWrapper = ({ children }) => {
    if (isLandscape) {
      return (
        <ImageBackground
          style={stylesL.container}
          resizeMode="cover"
          source={remote_bg}
          blurRadius={4}
        >
          {children}
        </ImageBackground>
      );
    } else {
      return (
        <ImageBackground
          style={styles.container}
          resizeMode="cover"
          source={remote_bg}
          blurRadius={4}
        >
          {children}
        </ImageBackground>
      );
    }

    if (Platform.OS === "android") {
      return (
        <ImageBackground
          style={styles.container}
          resizeMode="cover"
          source={icRemoteBgAnd}
          blurRadius={4}
        >
          {children}
        </ImageBackground>
      );
    } else {
      return (
        <BlurView
          style={[styles.container]}
          blurType="light"
          blurAmount={20}
          reducedTransparencyFallbackColor="white"
        >
          {children}
        </BlurView>
      );
    }
  };
  const ChannelTitle = () => {
    return (
      "Ch. " +
      GlobalValue.crtChannel?.channel +
      " " +
      GlobalValue.crtChannel?.channel_name
    );
  };
  const RemoteCompPortrait = () => {
    const KeyPadComp = () => {
      return (
        <ImageBackground
          style={{
            position: "absolute",
            alignSelf: "center",
            marginTop: height * 0.00023,
            alignItems: "center",
            justifyContent: "center",

            width: height * 0.36,
            height: height * 0.36,
            //backgroundColor: "green",
          }}
          source={btnBg}
        >
          <View
            style={{
              flexDirection: "row",
              width: "100%",
              alignItems: "center",
              justifyContent: "space-between",
              //backgroundColor: "pink",
            }}
          >
            <TouchableOpacity onPress={() => onRBtnPress(101)}>
              <Image
                source={ic_leftArrow}
                style={{
                  width: scaleXiPhone15.fivtyH,
                  height: scaleXiPhone15.fivtyH,
                }}
              ></Image>
            </TouchableOpacity>
            <WithoutBGBtnComp
              isShowBg={true}
              icon={ic_keypad}
              onPress={() => onRBtnPress(102)}
            />
            <TouchableOpacity onPress={() => onRBtnPress(103)}>
              <Image
                source={ic_rightArrow}
                style={{
                  width: scaleXiPhone15.fivtyH,
                  height: scaleXiPhone15.fivtyH,
                }}
              ></Image>
            </TouchableOpacity>
          </View>
        </ImageBackground>
      );
    };

    return (
      <View
        style={[
          {
            flex: 0.38,
            width: "100%",
            justifyContent: "space-between",
            //backgroundColor: "yellow",
          },
        ]}
      >
        <KeyPadComp />
        <View
          style={{
            flexDirection: "row",
            width: "100%",
            justifyContent: "space-evenly",
            //backgroundColor: "red",
          }}
        >
          <RoundBtnComp title={"TV\nGUIDE"} onPress={() => onRBtnPress(3)} />
          <View
            style={{
              height: scaleXiPhone15.eightyH, //height * 0.09
              width: scaleXiPhone15.eightyH,
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <TouchableOpacity onPress={() => onRBtnPress(100)}>
              <Image
                source={ic_plus}
                style={{
                  width: scaleXiPhone15.fivtyH,
                  height: scaleXiPhone15.fivtyH,
                }}
              ></Image>
            </TouchableOpacity>
          </View>
          <RoundBtnComp icon={ic_mute} onPress={() => onRBtnPress(4)} />
        </View>
        <View
          style={{
            flexDirection: "row",
            width: "100%",
            justifyContent: "space-evenly",
            //backgroundColor: "red",
          }}
        >
          <RoundIconWithLbl
            icon={ic_back}
            title={"BACK"}
            onPress={() => onRBtnPress(5)}
          />
          <View
            style={{
              height: scaleXiPhone15.eightyH, //height * 0.09
              width: scaleXiPhone15.eightyH,
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <TouchableOpacity onPress={() => onRBtnPress(104)}>
              <Image
                source={ic_minus}
                style={{
                  width: scaleXiPhone15.fivtyH,
                  height: scaleXiPhone15.fivtyH,
                }}
              ></Image>
            </TouchableOpacity>
          </View>
          <RoundBtnComp icon={ic_maximize} onPress={() => onRBtnPress(6)} />
        </View>
      </View>
    );
  };
  //#endregion

  //#region LandscapeRemoteComp
  const LandscapeRemoteComp = () => {
    return (
      <ScreenWrapper>
        <ChNameSec />
        <VolumeSec />
        <OffSec />
      </ScreenWrapper>
    );

    return (
      <ScreenWrapper>
        <View style={stylesH.container}>
          <View style={stylesH.leftSide}>
            <View style={[stylesH.containerPower, {}]}>
              <RoundBtnComp
                isLandscape={isLandscape}
                isBorder={true}
                icon={ic_share}
                onPress={() => onRBtnPress(7)}
              />
              <RoundBtnComp
                isLandscape={isLandscape}
                isBorder={true}
                title={"BUY \nNOW"}
                onPress={() => onRBtnPress(8)}
              />

              <RoundBtnComp
                isLandscape={isLandscape}
                isBorder={true}
                title={"ON DEMAND"}
                onPress={() => onRBtnPress(9)}
              />
            </View>
            <View
              style={[
                stylesH.containerPower,
                { width: "75%", marginTop: scaleXiPhone15.eightH },
              ]}
            >
              <RoundBtnWithLblComp
                isLandscape={isLandscape}
                color={"#7C4781"}
                title={"TEXT"}
                onPress={() => onRBtnPress(500)}
              />
              <RoundBtnWithLblComp
                isLandscape={isLandscape}
                color={"#46457F"}
                title={"DVR"}
                onPress={() => onRBtnPress(501)}
              />
              <RoundBtnWithLblComp
                isLandscape={isLandscape}
                title={"Premium"}
                color={"#15757E"}
                onPress={() => onRBtnPress(502)}
              />
              <RoundBtnWithLblComp
                isLandscape={isLandscape}
                color={"#7E7B45"}
                title={"PPV"}
                onPress={() => onRBtnPress(503)}
              />
            </View>
            <View style={[stylesH.containerPower, { width: "60%" }]}>
              <RoundBtnWithLblComp
                isLandscape={isLandscape}
                color={"#7E4545"}
                title={"EAT"}
                onPress={() => onRBtnPress(504)}
              />
              <RoundBtnWithLblComp
                isLandscape={isLandscape}
                color={"#476C81"}
                title={"TRAVEL"}
                onPress={() => onRBtnPress(505)}
              />
              <RoundBtnWithLblComp
                isLandscape={isLandscape}
                title={"INFO"}
                color={"#4F8147"}
                onPress={() => onRBtnPress(506)}
              />
            </View>
          </View>
          <View style={stylesH.rightSide}>
            <ImageBackground style={[stylesH.imgContainer]} source={btnBg}>
              <View>
                <View
                  style={{
                    alignItems: "center",
                    //  backgroundColor: 'red',
                    marginTop: isTablet ? scaleXiPhone15.twelveH : 0,
                  }}
                >
                  <WithoutBGBtnComp
                    icon={ic_plus}
                    onPress={() => onRBtnPress(100)}
                  />
                </View>
                <View
                  style={{
                    // paddingHorizontal: scaleXiPhone15.oneH,
                    marginTop: isTablet
                      ? scaleXiPhone15.hundredSixtyH
                      : scaleXiPhone15.eightyH,
                    flex: 1,
                    flexDirection: "row",
                    justifyContent: "space-between", // Align items at the top
                    alignItems: "center", // centers horizontally
                  }}
                >
                  <WithoutBGBtnComp
                    icon={ic_leftArrow}
                    onPress={() => onRBtnPress(101)}
                  />
                  <WithoutBGBtnComp
                    isShowBg={true}
                    icon={ic_keypad}
                    onPress={() => onRBtnPress(102)}
                  />
                  <WithoutBGBtnComp
                    icon={ic_rightArrow}
                    onPress={() => onRBtnPress(103)}
                  />
                </View>
                <View
                  style={{
                    alignItems: "center",

                    marginTop: isTablet
                      ? scaleXiPhone15.hundredFiftyH
                      : scaleXiPhone15.eightyH,
                  }}
                >
                  <WithoutBGBtnComp
                    icon={ic_minus}
                    onPress={() => onRBtnPress(104)}
                  />
                </View>
              </View>
            </ImageBackground>
            <View
              style={[
                stylesH.containerPower,
                {
                  marginTop: isTablet
                    ? -scaleXiPhone15.twoHundredH -
                      scaleXiPhone15.twoHundredH -
                      scaleXiPhone15.fortyH
                    : -scaleXiPhone15.twoHundredH - scaleXiPhone15.eightyH,
                },
              ]}
            >
              <RoundBtnComp
                isLandscape={isLandscape}
                title={"TV GUIDE"}
                onPress={() => onRBtnPress(3)}
              />
              <WhiteSpeceComp />

              <RoundBtnComp
                isLandscape={isLandscape}
                icon={ic_mute}
                onPress={() => onRBtnPress(4)}
              />
            </View>

            <View
              style={[
                stylesH.containerPower,
                {
                  marginTop: isTablet
                    ? scaleXiPhone15.twoHundredH
                    : scaleXiPhone15.hundredH + scaleXiPhone15.twentyH,
                },
              ]}
            >
              <RoundIconWithLbl
                isLandscape={isLandscape}
                icon={ic_back}
                title={"BACK"}
                onPress={() => onRBtnPress(5)}
              />
              <WhiteSpeceComp />
              <RoundBtnComp
                isLandscape={isLandscape}
                icon={ic_maximize}
                onPress={() => onRBtnPress(6)}
              />
            </View>
          </View>

          <View style={stylesH.rightSideLast}>
            <RoundBtnComp
              isLandscape={isLandscape}
              icon={ic_user}
              onPress={() => onRBtnPress(2)}
            />

            <RoundBtnComp
              isLandscape={isLandscape}
              title={"OFF"}
              onPress={() => onRBtnPress(1)}
            />
            <WhiteSpeceComp />
          </View>
          <View
            style={{
              flexDirection: "row", // Arrange children in a row

              width: "100%",
              position: "absolute", //Here is the trick
              bottom: scaleXiPhone15.eightteenH, //Here is the trick
              justifyContent: "space-between",
              paddingHorizontal: scaleXiPhone15.fivtyH,
            }}
          >
            <Text style={[stylesH.txtHeader, { textAlign: "left" }]}>
              {ChannelTitle()}
            </Text>
            <CloseComp navigation={navigation} />
          </View>
        </View>
      </ScreenWrapper>
    );
  };
  const ChNameSec = () => {
    const TopSec = () => {
      return (
        <View
          style={{
            flex: 0.3,
            flexDirection: "row",
            width: "100%",
            justifyContent: "space-around",
            alignItems: "center",
            //backgroundColor: "white",
          }}
        >
          <RoundBtnComp
            isLandscape={false}
            isBorder={false}
            title={"SHARE"}
            onPress={() => onRBtnPress(9)}
          />
          <RoundBtnComp
            isLandscape={false}
            isBorder={false}
            title={"BUY\nNOW"}
            onPress={() => onRBtnPress(9)}
          />
          <RoundBtnComp
            isLandscape={false}
            isBorder={false}
            title={"ON\nDEMAND"}
            onPress={() => onRBtnPress(9)}
          />
        </View>
      );
    };
    const MiddleSec = () => {
      return (
        <View
          style={{
            flex: 0.5,
            width: "100%",
          }}
        >
          <View
            style={{
              gap: scaleXiPhone15.twelveW,
              flex: 0.4,
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "center",
              height: "100%",
              //backgroundColor: "green",
            }}
          >
            <RoundBtnWithLblComp
              isLandscape={false}
              color={"#7C4781"}
              title={"TEXT"}
              onPress={() => onRBtnPress(500)}
            />
            <RoundBtnWithLblComp
              isLandscape={false}
              color={"#46457F"}
              title={"DVR"}
              onPress={() => onRBtnPress(501)}
            />
            <RoundBtnWithLblComp
              isLandscape={false}
              title={"Premium"}
              color={"#15757E"}
              onPress={() => onRBtnPress(502)}
            />
            <RoundBtnWithLblComp
              isLandscape={false}
              color={"#7E7B45"}
              title={"PPV"}
              onPress={() => onRBtnPress(503)}
            />
          </View>
          <View
            style={{
              flex: 0.6,
              gap: scaleXiPhone15.twelveW,
              flexDirection: "row",
              alignItems: "flex-start",
              justifyContent: "center",
              height: "100%",
              //backgroundColor: "blue",
            }}
          >
            <RoundBtnWithLblComp
              isLandscape={false}
              color={"#7E4545"}
              title={"EAT"}
              onPress={() => onRBtnPress(504)}
            />
            <RoundBtnWithLblComp
              isLandscape={false}
              color={"#476C81"}
              title={"TRAVEL"}
              onPress={() => onRBtnPress(505)}
            />
            <RoundBtnWithLblComp
              isLandscape={false}
              title={"INFO"}
              color={"#4F8147"}
              onPress={() => onRBtnPress(506)}
            />
            <RoundBtnWithLblComp
              isLandscape={false}
              title={"GIFTS"}
              color={"white"}
              onPress={() => onRBtnPress(506)}
            />
          </View>
        </View>
      );
    };
    const BtmSec = () => {
      return (
        <View
          style={{
            flex: 0.2,
            width: "100%",
            justifyContent: "center",
            alignItems: "center",
            //backgroundColor: "white",
          }}
        >
          <Text>Ch - 251 STAR SPORTS</Text>
        </View>
      );
    };

    return (
      <View style={{ flex: 0.4, height: "100%" }}>
        <TopSec />
        <MiddleSec />
        <BtmSec />
      </View>
    );
  };
  const VolumeSec = () => {
    const TopSec = () => {
      return (
        <View
          style={{
            flex: 0.3,
            flexDirection: "row",
            width: "100%",
            justifyContent: "space-around",
            alignItems: "center",
            //backgroundColor: "white",
          }}
        >
          <RoundBtnComp
            isLandscape={false}
            title={"TV\nGUIDE"}
            onPress={() => onRBtnPress(3)}
          />
          <WhiteSpeceComp />
          <RoundBtnComp
            isLandscape={false}
            icon={ic_mute}
            onPress={() => onRBtnPress(4)}
          />
        </View>
      );
    };
    const MidSec = () => {
      return (
        <View
          style={{
            flex: 0.4,
            flexDirection: "row",
            width: "100%",
            justifyContent: "space-around",
            alignItems: "center",
            //backgroundColor: "blue",
          }}
        >
          <WhiteSpeceComp />
          <WithoutBGBtnComp
            isShowBg={true}
            icon={ic_keypad}
            onPress={() => onRBtnPress(102)}
          />
          <WhiteSpeceComp />
        </View>
      );
    };

    return (
      <View
        style={{
          flex: 0.42,
          justifyContent: "center",
          alignItems: "center",
          height: "100%",
          backgroundColor: "pink",
        }}
      >
        <ImageBackground
          style={{
            top: scaleXiPhone15.sixteenW,
            position: "absolute",
            width: widthWindow * 0.41,
            height: widthWindow * 0.41,
            backgroundColor: "green",
          }}
          source={btnBgL}
        ></ImageBackground>
        <TopSec />
        <MidSec />
        <TopSec />
      </View>
    );
  };
  const OffSec = () => {
    return (
      <View
        style={{
          flex: 0.18,
          height: "100%",
          justifyContent: "space-around",
          alignItems: "flex-start",
          //backgroundColor: "green",
        }}
      >
        <RoundBtnComp
          isLandscape={false}
          icon={ic_user}
          onPress={() => onRBtnPress(2)}
        />
        <RoundBtnComp
          isLandscape={false}
          title={"OFF"}
          onPress={() => onRBtnPress(1)}
        />
        <View
          style={{
            height: "20%",
            width: "100%",
            alignItems: "center",
            justifyContent: "flex-end",
            //backgroundColor: "blue",
          }}
        >
          <CloseComp navigation={navigation} />
        </View>
      </View>
    );
  };
  //#endregion

  //#region PortraitRemoteComp
  const PortraitRemoteComp = () => {
    //Flex = 10+14+36 = 58 | 14+16+12 = 42
    return (
      <ScreenWrapper>
        <View
          style={[
            {
              flex: 0.1,
              width: "100%",
              justifyContent: "flex-end",
              //backgroundColor: "yellow",
            },
          ]}
        >
          <Text style={styles.txtHeader}>{ChannelTitle()}</Text>
        </View>
        <View style={[styles.containerPower, { flex: 0.14 }]}>
          <RoundBtnComp
            isLandscape={false}
            title={"OFF"}
            onPress={() => onRBtnPress(1)}
          />
          <WhiteSpeceComp />
          <RoundBtnComp
            isLandscape={false}
            icon={ic_user}
            onPress={() => onRBtnPress(2)}
          />
        </View>
        <RemoteCompPortrait />
        <View
          style={[styles.containerPower, { flex: 0.14, alignItems: "center" }]}
        >
          <RoundBtnComp
            isLandscape={false}
            isBorder={false}
            icon={ic_share}
            onPress={() => onRBtnPress(7)}
          />
          <RoundBtnComp
            isLandscape={false}
            isBorder={false}
            title={"BUY \nNOW"}
            onPress={() => onRBtnPress(8)}
          />
          <RoundBtnComp
            isLandscape={false}
            isBorder={false}
            title={"ON DEMAND"}
            onPress={() => onRBtnPress(9)}
          />
        </View>
        <View
          style={{
            flex: 0.16,
            width: "100%",
            alignItems: "center",
            //backgroundColor: "yellow",
          }}
        >
          <View style={[styles.containerTxtBtn, { width: "74%" }]}>
            <RoundBtnWithLblComp
              color={"#7C4781"}
              title={"TEXT"}
              onPress={() => onRBtnPress(500)}
            />
            <RoundBtnWithLblComp
              color={"#46457F"}
              title={"DVR"}
              onPress={() => onRBtnPress(501)}
            />
            <RoundBtnWithLblComp
              title={"Premium"}
              color={"#15757E"}
              onPress={() => onRBtnPress(502)}
            />
            <RoundBtnWithLblComp
              color={"#7E7B45"}
              title={"PPV"}
              onPress={() => onRBtnPress(503)}
            />
          </View>
          <View style={[styles.containerTxtBtn, { width: "74%" }]}>
            <RoundBtnWithLblComp
              color={"#7E4545"}
              title={"EAT"}
              onPress={() => onRBtnPress(504)}
            />
            <RoundBtnWithLblComp
              color={"#476C81"}
              title={"TRAVEL"}
              onPress={() => onRBtnPress(505)}
            />
            <RoundBtnWithLblComp
              title={"INFO"}
              color={"#4F8147"}
              onPress={() => onRBtnPress(506)}
            />
            <RoundBtnWithLblComp
              title={"GIFTS"}
              color={"#FFFFFF"}
              textColor={"black"}
              onPress={() => onRBtnPress(507)}
            />
          </View>
        </View>
        <View
          style={[
            {
              flex: 0.12,
              width: "100%",
              justifyContent: "center",
              alignItems: "center",
              //backgroundColor: "gray",
            },
          ]}
        >
          {loader ? (
            <CustomLoader isSmall={false} color={ovnioColors.primaryRed} />
          ) : (
            <CloseComp navigation={navigation} />
          )}
        </View>
      </ScreenWrapper>
    );
  };
  //#endregion

  return isLandscape ? <LandscapeRemoteComp /> : <PortraitRemoteComp />;
}

const stylesL = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: ovnioColors.Remote_Red_Trans,
  },
});
const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: ovnioColors.Remote_Red_Trans,
  },
  txtHeader: {
    ...stylesCommon.titleWelcome,
  },
  containerPower: {
    alignItems: "center",
    flexDirection: "row",
    width: "100%",
    justifyContent: "space-evenly",
    //backgroundColor: "gray",
  },
  containerTxtBtn: {
    flex: 0.5,
    flexDirection: "row",
    justifyContent: "space-evenly",
    alignItems: "center",
  },
  imgContainer: {
    // marginTop: isTablet ? -scaleXiPhone15.hundredH : -scaleXiPhone15.hundredW,
    width: isTablet
      ? width - scaleXiPhone15.eightyW * 2.2
      : width - scaleXiPhone15.eightyW * 1.3,
    height: isTablet
      ? width - scaleXiPhone15.eightyW * 2.2
      : width - scaleXiPhone15.eightyW * 1.3,

    //  backgroundColor: 'green',
  },
});
const stylesH = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "row", // Arrange children in a row
  },
  leftSide: {
    paddingVertical: scaleXiPhone15.fortyH,

    flex: 0.45, // 45% of the container's width
    //backgroundColor: 'lightblue',
    //justifyContent: 'center',
    alignItems: "center",
  },
  rightSide: {
    flex: 0.4, // 40% of the container's width
    //backgroundColor: 'lightcoral',
    paddingVertical: scaleXiPhone15.fortyH,

    //    justifyContent: 'center',
    alignItems: "center",
  },
  rightSideLast: {
    gap: scaleXiPhone15.eightteenH,

    paddingVertical: scaleXiPhone15.fortyH,

    flex: 0.15, // 15% of the container's width
    //backgroundColor: 'red',
    //  justifyContent: 'center',
    alignItems: "center",
  },

  imgContainer: {
    // marginTop: isTablet ? -scaleXiPhone15.hundredH : -scaleXiPhone15.hundredW,
    width: isTablet
      ? height - scaleXiPhone15.eightyW * 3.5
      : height - scaleXiPhone15.eightyW * 1.3,
    height: isTablet
      ? height - scaleXiPhone15.eightyW * 3.5
      : height - scaleXiPhone15.eightyW * 1.3,

    //  backgroundColor: 'green',
  },

  containerPower: {
    flexDirection: "row",
    width: "100%",
    justifyContent: "space-evenly",
    //backgroundColor: "gray",
  },
  txtHeader: {
    marginTop: scaleXiPhone15.twentyFourH,
    ...stylesCommon.titleWelcome,
  },
});
//#endregion

//#region RoundBtnComp
const RoundBtnComp = (prop) => {
  return (
    <TouchableOpacity
      style={{
        // ...(prop.isBorder ? stylesCommon.elvation : null),
        // borderWidth: prop.isBorder ? scaleXiPhone15.oneH : scaleXiPhone15.oneH,
        // borderColor: prop.isBorder ? "#fbb231" : null,
        height:
          prop.isLandscape && isTablet
            ? scaleXiPhone15.eightyW
            : scaleXiPhone15.eightyH, //height * 0.09
        width:
          prop.isLandscape && isTablet
            ? scaleXiPhone15.eightyW
            : scaleXiPhone15.eightyH, //height * 0.09
        borderRadius:
          prop.isLandscape && isTablet
            ? scaleXiPhone15.eightyW * 0.5
            : scaleXiPhone15.eightyH * 0.5,
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#000000",
      }}
      onPress={prop.onPress}
    >
      {prop.icon ? (
        <Image
          source={prop.icon}
          style={{
            width: scaleXiPhone15.thrityTwoH,
            height: scaleXiPhone15.thrityTwoH,
            tintColor: ovnioColors.white,
            resizeMode: "contain",

            // backgroundColor: ovnioColors.white,
          }}
        />
      ) : (
        <Text
          style={[
            {
              textAlign: "center",
              fontSize: prop.isBorder
                ? scaleXiPhone15.fouteenH
                : scaleXiPhone15.sixteenH,
              fontFamily: fonts.medium,
              color: ovnioColors.white,
            },
          ]}
        >
          {prop.title}
        </Text>
      )}
    </TouchableOpacity>
  );
};
//#endregion

//#region RoundIconWithLbl
const RoundIconWithLbl = (prop) => {
  return (
    <TouchableOpacity
      style={{
        gap: scaleXiPhone15.twoH,
        ...(prop.isBorder ? stylesCommon.elvation : null),
        height:
          prop.isLandscape && isTablet
            ? scaleXiPhone15.eightyW
            : scaleXiPhone15.eightyH, //height * 0.09
        width:
          prop.isLandscape && isTablet
            ? scaleXiPhone15.eightyW
            : scaleXiPhone15.eightyH, //height * 0.09
        borderRadius:
          prop.isLandscape && isTablet
            ? scaleXiPhone15.eightyW * 0.5
            : scaleXiPhone15.eightyH * 0.5,
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#000000",
      }}
      onPress={prop.onPress}
    >
      <Image
        source={prop.icon}
        style={{
          width: scaleXiPhone15.thrityTwoH,
          height: scaleXiPhone15.thrityTwoH,
          tintColor: ovnioColors.white,
          resizeMode: "contain",

          // backgroundColor: ovnioColors.white,
        }}
      />

      <Text
        style={[
          {
            textAlign: "center",
            fontSize: scaleXiPhone15.fouteenH,
            fontFamily: fonts.medium,
            color: ovnioColors.white,
          },
        ]}
        //onPress={prop.onPress}
      >
        {prop.title}
      </Text>
    </TouchableOpacity>
  );
};
//#endregion

//#region WithoutBGBtnComp
const WithoutBGBtnComp = (prop) => {
  return (
    <TouchableOpacity
      style={{
        ...(prop.isShowBg ? stylesCommon.elvation : null),
        height: prop.isShowBg ? scaleXiPhone15.hundredH : scaleXiPhone15.sixtyH, //height * 0.06
        width: prop.isShowBg ? scaleXiPhone15.hundredH : scaleXiPhone15.sixtyH, //height * 0.06
        alignItems: "center",
        justifyContent: "center",

        borderRadius: prop.isShowBg
          ? scaleXiPhone15.hundredH * 2
          : scaleXiPhone15.sixtyH * 2,
        borderWidth: prop.isShowBg ? scaleXiPhone15.eightH : 0,
        borderColor: "#413F38", //"#625133",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: prop.isShowBg ? "#636260" : null,
        //  backgroundColor: 'red',
      }}
      onPress={prop.onPress}
    >
      <Image
        source={prop.icon}
        style={{
          width: prop.isShowBg
            ? scaleXiPhone15.thrityTwoH
            : scaleXiPhone15.fivtyH,
          height: prop.isShowBg
            ? scaleXiPhone15.thrityTwoH
            : scaleXiPhone15.fivtyH,
          tintColor: ovnioColors.white,
          resizeMode: "contain",

          // backgroundColor: ovnioColors.white,
        }}
      />
    </TouchableOpacity>
  );
};
//#endregion

//#region WhiteSpeceComp
const WhiteSpeceComp = (prop) => {
  return (
    <View
      style={{
        height: scaleXiPhone15.eightyH, //height * 0.09
        width: scaleXiPhone15.eightyH,
      }}
    />
  );
};
//#endregion

//#region RoundBtnWithLblComp
const RoundBtnWithLblComp = (prop) => {
  return (
    <TouchableOpacity
      onPress={prop.onPress}
      style={{
        alignItems: "center",
        justifyContent: "center",
        ...stylesCommon.elvation,
        height:
          prop.isLandscape && isTablet
            ? scaleXiPhone15.sixtyW
            : scaleXiPhone15.sixtyH,
        width:
          prop.isLandscape && isTablet
            ? scaleXiPhone15.sixtyW
            : scaleXiPhone15.sixtyH,
        borderRadius:
          prop.isLandscape && isTablet
            ? scaleXiPhone15.sixtyW * 0.5
            : scaleXiPhone15.sixtyH * 0.5,
        backgroundColor: prop.color ? prop.color : "#000000",
      }}
    >
      <Text
        style={[
          {
            textAlign: "center",
            fontSize: scaleXiPhone15.twelveH,
            fontFamily: fonts.medium,
            color: prop.textColor ? prop.textColor : ovnioColors.white,
          },
        ]}
      >
        {prop.title.toUpperCase()}
      </Text>
    </TouchableOpacity>
  );
};
//#endregion

//#region CloseComp
const CloseComp = (prop) => {
  return (
    <TouchableOpacity
      style={{
        width: scaleXiPhone15.fivtyH,
        height: scaleXiPhone15.fivtyH,
        borderRadius: scaleXiPhone15.fivtyH * 0.5,
        justifyContent: "center",
        alignItems: "center", // centers horizontally
        backgroundColor: "#C7C7C7",
      }}
      onPress={() => prop.navigation.goBack()}
    >
      <Image
        source={ic_cross}
        style={{
          width: scaleXiPhone15.thrityTwoH,
          height: scaleXiPhone15.thrityTwoH,
          resizeMode: "contain",
        }}
      />
    </TouchableOpacity>
  );
};
//#endregion

//#region API
async function PostChannelNextAPICall(currentChannelId, setLoader, navigation) {
  const body = {
    channel: currentChannelId,
  };
  setLoader(true);
  await PostChannelNext(body, {})
    .then((res) => {
      setLoader(false);
      console.log(
        "\u001b[1;32mTVR.js : Res next ch = ",
        JSON.stringify(res.data)
      );
      navigateToChannelDetail(navigation, res.data.data[0]);
    })
    .catch((error) => {
      setLoader(false);
      showAPIError(error, "Channel Next Error");
    });
}
async function PostChannelPrevAPICall(currentChannelId, setLoader, navigation) {
  const para = { page: 1, count: 5 };
  const body = {
    channel: currentChannelId,
  };
  setLoader(true);
  await PostChannelPrevious(body, para)
    .then((res) => {
      setLoader(false);
      console.log(
        "\u001b[1;32mTVR.js : Res prev ch = ",
        JSON.stringify(res.data)
      );
      navigateToChannelDetail(navigation, res.data.data[0]);
    })
    .catch((error) => {
      setLoader(false);
      showAPIError(error, "Channel Next Error");
    });
}
function navigateToChannelDetail(navigation, chDet) {
  //TODO: Navigation when using "HomeDetails"
  const chTmp = {
    id: chDet.id,
    channel: "",
    channel_name: chDet.name,
    image: chDet.image,
    ispinned: false,
    blocked: false,
  };
  navigation.goBack();
  setTimeout(() => {
    navigation.navigate("HomeStack", {
      screen: "HomeDetails",
      params: { ChannelDetails: chDet, navType: 5 },
    });
  }, 50);
  //TODO: Navigation when using "ChannelDetails"
  /*
  navigation.navigate("HomeDetails", { ChannelDetails: chTmp });
  navigation.navigate("Channel", {
    screen: "ChannelDetails",
    params: { ChannelDetails: chDet },
  }); */
}

//logout
function showAlertForLogout(navigation, setLoader) {
  Alert.alert(
    TextStrings.Logout,
    TextStrings.sureLogout,
    [
      {
        text: "NO",
        style: "cancel",
      },
      {
        text: "YES",
        onPress: () => {
          GetLogOutAPICall(navigation, setLoader);
        },
        style: "destructive",
      },
    ],
    { cancelable: true }
  );
}
async function GetLogOutAPICall(navigation, setLoader) {
  setLoader(true);
  await GetLogOut()
    .then((res) => {
      setLoader(false);
      console.log(
        "\u001b[1;32mTVR.js : Res GetLogOut = ",
        JSON.stringify(res.data)
      );
      Logout(navigation);
    })
    .catch((error) => {
      setLoader(false);
      showAPIError(error, "Log out Error");
    });
}
async function Logout(navigation) {
  await removeUserID();
  await removeUserEmail();
  GlobalValue.userId = 0;
  GlobalValue.emailId = "";
  setTimeout(() => {
    navigation.navigate("Welcome", {
      navType: 2,
    });
  }, 50);
}
//#endregion

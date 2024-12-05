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
  SafeAreaView,
} from "react-native";
const { height, width } = Dimensions.get("window");

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
import { showCustomAlertWithMsg } from "../../../utils/Alert";
import { ShareChannelLinkUtil } from "../../../utils/ShareUtil";
import { stylesCommon } from "../../../utils/CommonStyle";
import { removeUserEmail, removeUserID } from "../../../utils/LocalDataStorage";
import DeviceInfo from "react-native-device-info";
const isTablet = DeviceInfo.isTablet();
//api
import { FreeChannelViewingCheck } from "../../../api/GlobalAPICall";
import GlobalValue from "../../../api/GlobalVar";
import { showAPIError } from "../../../api/Config";
import { GetLogOut, GetChannelDetail } from "../../../api/GetRequest";
import {
  PostChannelFind,
  PostChannelNext,
  PostChannelPrevious,
} from "../../../api/PostRequest";

//#endregion

//#region asset
const remote_bg_p = require("../../../assets/images/remote/remote_bg/remote_bg.png");
const remote_bg_l = require("../../../assets/images/remote/remote_bg/remote_bgL.png");
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
  console.log(
    "\u001b[1;35mR.js GlobalValue.crtChannel = ",
    GlobalValue.crtChannel
  );

  //#region useState
  const [loader, setLoader] = useState(false);
  const [isLandscape, setIsLandscape] = useState(false);
  const [volume, setVolume] = useState(0);
  const [widthWindow, setWidthWindow] = useState(width);
  const [htWindow, setHtWindow] = useState(height);
  // console.log("\u001b[1;33mR.js widthWindow = ", widthWindow);
  // console.log("\u001b[1;33mR.js htWindow = ", htWindow);
  //#endregion

  //#region useEffect
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
    const subscription = Dimensions.addEventListener(
      "change",
      ({ window: { width, height } }) => {
        console.log("Dimensions listner change width ", JSON.stringify(width));
        setWidthWindow(width);
        setHtWindow(height);
        if (width < height) {
          setIsLandscape(false);
        } else {
          setIsLandscape(true);
        }
      }
    );
    return () => subscription?.remove();
  });
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
  const muteVolume = () => {
    VolumeManager.setVolume(0);
    setVolume(0);
  };
  const onBtnPress = (index) => {
    if (index === 1) {
      showAlertForLogout(navigation, setLoader);
    } else if (index === 2) {
      navigation.navigate("Profile");
    } else if (index === 3) {
      navigation.navigate("TV Guide");
    } else if (index === 4) {
      muteVolume();
    } else if (index === 5) {
      navigation.goBack();
    } else if (index === 6) {
      //maximize
    } else if (index === 7) {
      ShareChannelLinkUtil(
        GlobalValue.crtChannel?.name,
        "https://zealous-cliff-082548f0f.5.azurestaticapps.net/"
      );
    } else if (index === 8) {
      if (GlobalValue.crtChannel?.id) {
        GetChannelDetailAPICall(
          GlobalValue.crtChannel?.id,
          setLoader,
          navigation
        );
      }
    } else if (index === 9) {
      //on demand
    } else if (index === 100) {
      //on inc volume
      increaseVolume();
    } else if (index === 101) {
      //on prev Channel
      if (GlobalValue.crtChannel?.id) {
        if (
          !FreeChannelViewingCheck(GlobalValue.crtChannel?.channel, navigation)
        )
          return;
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
        if (
          !FreeChannelViewingCheck(GlobalValue.crtChannel?.channel, navigation)
        )
          return;
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
    } else if (index >= 500 && index <= 503) {
      Linking.openURL("https://www.walmart.com/").catch((err) =>
        console.error("An error occurred", err)
      );
    } else if (index >= 504 && index <= 507) {
      navigation.goBack();
      navigation.navigate("WebViewASM", {
        url: "https://www.demo.iscripts.com/socialware/demo/",
        headerTxt: "Social Media",
      });
    } else {
      console.log("else");
    }
  };
  //#endregion

  /* return (
    <PortraitRemoteComp
      loader={loader}
      height={htWindow}
      navigation={navigation}
      onPress={onBtnPress}
    />
  ); */

  return isLandscape ? (
    <LandscapeRemoteComp />
  ) : (
    <PortraitRemoteComp
      loader={loader}
      height={htWindow}
      navigation={navigation}
      onPress={onBtnPress}
    />
  );
}
//#endregion

//#region LandscapeRemoteComp
const LandscapeRemoteComp = () => {
  return <ScreenWrapper isLandscape={true}></ScreenWrapper>;
};

//#endregion

//#region PortraitRemoteComp
const PortraitRemoteComp = (prop) => {
  //Flex = 10+14+34 = 58 | 14+16+12 = 42

  return (
    <ScreenWrapper isLandscape={false}>
      <PortraitChNameComp />
      <PortraitOffComp height={prop.height} onPress={prop.onPress} />
      <PortraitRemoteBtnComp height={prop.height} onPress={prop.onPress} />
      <PortraitShareComp height={prop.height} onPress={prop.onPress} />
      <PortraitTextBtnComp height={prop.height} onPress={prop.onPress} />
      <PortraitCloseComp
        loader={prop.loader}
        height={prop.height}
        navigation={prop.navigation}
      />
    </ScreenWrapper>
  );
};
const PortraitChNameComp = () => {
  const ChannelTitle = () => {
    return (
      "Ch. " +
      GlobalValue.crtChannel?.channel +
      " " +
      GlobalValue.crtChannel?.channel_name
    );
  };
  return (
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
      <Text style={{ ...stylesCommon.titleWelcome }}>{ChannelTitle()}</Text>
    </View>
  );
};
const PortraitOffComp = (prop) => {
  const onRBtnPress = (index) => prop.onPress(index);
  return (
    <View
      style={{
        flex: 0.14,
        alignItems: "center",
        flexDirection: "row",
        width: "100%",
        justifyContent: "space-evenly",
        //backgroundColor: "pink",
      }}
    >
      <RoundBtnComp
        title={"OFF"}
        height={prop.height}
        onPress={() => onRBtnPress(1)}
      />
      <WhiteSpeceComp height={prop.height} />
      <RoundBtnComp
        height={prop.height}
        icon={ic_user}
        onPress={() => onRBtnPress(2)}
      />
    </View>
  );
};
//PortraitRemoteBtnComp
const PortraitRemoteBtnComp = (prop) => {
  return (
    <View
      style={[
        {
          flex: 0.34,
          width: "100%",
          justifyContent: "space-between",
          //backgroundColor: "blue",
        },
      ]}
    >
      <PortraitKeypadBtnComp height={prop.height} onPress={prop.onPress} />
      <PortraitRemoteBtnTopComp height={prop.height} onPress={prop.onPress} />
      <PortraitRemoteBtnBtmComp height={prop.height} onPress={prop.onPress} />
    </View>
  );
};
//PortraitRemoteBtnComp
const PortraitKeypadBtnComp = ({ height, onPress }) => {
  const onRBtnPress = (index) => onPress(index);
  return (
    <ImageBackground
      style={{
        position: "absolute",
        alignSelf: "center",
        alignItems: "center",
        justifyContent: "center",

        width: height * 0.34,
        height: height * 0.34,
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
              width: height * 0.05,
              height: height * 0.05,
            }}
          ></Image>
        </TouchableOpacity>
        <RoundBtnComp
          bgColor={"#636260"}
          isBorder={true}
          height={height}
          icon={ic_keypad}
          onPress={() => onRBtnPress(102)}
        />
        <TouchableOpacity onPress={() => onRBtnPress(103)}>
          <Image
            source={ic_rightArrow}
            style={{
              width: height * 0.05,
              height: height * 0.05,
            }}
          ></Image>
        </TouchableOpacity>
      </View>
    </ImageBackground>
  );
};
//PortraitRemoteBtnComp
const PortraitRemoteBtnTopComp = ({ height, onPress }) => {
  const onRBtnPress = (index) => onPress(index);
  return (
    <View
      style={{
        flexDirection: "row",
        width: "100%",
        justifyContent: "space-evenly",
        //backgroundColor: "red",
      }}
    >
      <RoundBtnComp
        height={height}
        title={"TV\nGUIDE"}
        onPress={() => onRBtnPress(3)}
      />
      <View
        style={{
          height: height * 0.09, //height * 0.09
          width: height * 0.09,
          justifyContent: "center",
          alignItems: "center",
          //backgroundColor: "blue",
        }}
      >
        <TouchableOpacity onPress={() => onRBtnPress(100)}>
          <Image
            source={ic_plus}
            style={{
              width: height * 0.05,
              height: height * 0.05,
            }}
          ></Image>
        </TouchableOpacity>
      </View>
      <RoundBtnComp
        height={height}
        icon={ic_mute}
        onPress={() => onRBtnPress(4)}
      />
    </View>
  );
};
//PortraitRemoteBtnComp
const PortraitRemoteBtnBtmComp = ({ height, onPress }) => {
  const onRBtnPress = (index) => onPress(index);
  return (
    <View
      style={{
        flexDirection: "row",
        width: "100%",
        justifyContent: "space-evenly",
        //backgroundColor: "red",
      }}
    >
      <RoundBtnComp
        height={height}
        icon={ic_back}
        onPress={() => onRBtnPress(5)}
      />
      <View
        style={{
          height: height * 0.09, //height * 0.09
          width: height * 0.09,
          justifyContent: "center",
          alignItems: "center",
          //backgroundColor: "blue",
        }}
      >
        <TouchableOpacity onPress={() => onRBtnPress(104)}>
          <Image
            source={ic_minus}
            style={{
              width: height * 0.05,
              height: height * 0.05,
            }}
          ></Image>
        </TouchableOpacity>
      </View>
      <RoundBtnComp
        height={height}
        icon={ic_maximize}
        onPress={() => onRBtnPress(6)}
      />
    </View>
  );
};

const PortraitShareComp = (prop) => {
  const onRBtnPress = (index) => prop.onPress(index);

  return (
    <View
      style={{
        flex: 0.14,
        alignItems: "center",
        flexDirection: "row",
        width: "100%",
        justifyContent: "space-evenly",
        //backgroundColor: "yellow",
      }}
    >
      <RoundBtnComp
        height={prop.height}
        title={"SHARE"}
        onPress={() => onRBtnPress(7)}
      />
      <RoundBtnComp
        height={prop.height}
        title={"BUY \nNOW"}
        onPress={() => onRBtnPress(8)}
      />
      <RoundBtnComp
        height={prop.height}
        title={"ON DEMAND"}
        onPress={() => onRBtnPress(9)}
      />
    </View>
  );
};
const PortraitTextBtnComp = (prop) => {
  const onRBtnPress = (index) => prop.onPress(index);

  return (
    <View
      style={{
        flex: 0.16,
        width: "100%",
        alignItems: "center",
        //backgroundColor: "pink",
      }}
    >
      <View
        style={{
          width: "74%",
          flex: 0.5,
          flexDirection: "row",
          justifyContent: "space-evenly",
          alignItems: "center",
          //backgroundColor: "blue",
        }}
      >
        <RoundBtnWithLblComp
          height={prop.height}
          color={"#7C4781"}
          title={"TEXT"}
          onPress={() => onRBtnPress(500)}
        />
        <RoundBtnWithLblComp
          height={prop.height}
          color={"#46457F"}
          title={"DVR"}
          onPress={() => onRBtnPress(501)}
        />
        <RoundBtnWithLblComp
          height={prop.height}
          title={"Premium"}
          color={"#15757E"}
          onPress={() => onRBtnPress(502)}
        />
        <RoundBtnWithLblComp
          height={prop.height}
          color={"#7E7B45"}
          title={"PPV"}
          onPress={() => onRBtnPress(503)}
        />
      </View>
      <View
        style={{
          width: "74%",
          flex: 0.5,
          flexDirection: "row",
          justifyContent: "space-evenly",
          alignItems: "center",
          //backgroundColor: "green",
        }}
      >
        <RoundBtnWithLblComp
          height={prop.height}
          color={"#7E4545"}
          title={"EAT"}
          onPress={() => onRBtnPress(504)}
        />
        <RoundBtnWithLblComp
          height={prop.height}
          color={"#476C81"}
          title={"TRAVEL"}
          onPress={() => onRBtnPress(505)}
        />
        <RoundBtnWithLblComp
          height={prop.height}
          title={"INFO"}
          color={"#4F8147"}
          onPress={() => onRBtnPress(506)}
        />
        <RoundBtnWithLblComp
          height={prop.height}
          title={"GIFTS"}
          color={"#FFFFFF"}
          textColor={"black"}
          onPress={() => onRBtnPress(507)}
        />
      </View>
    </View>
  );
};
const PortraitCloseComp = (prop) => {
  return (
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
      {prop.loader ? (
        <CustomLoader isSmall={false} color={ovnioColors.white} />
      ) : (
        <CloseComp height={prop.height} navigation={prop.navigation} />
      )}
    </View>
  );
};
//#endregion

//#region ScreenWrapper
const ScreenWrapper = ({ children, isLandscape }) => {
  return (
    <ImageBackground
      style={{
        flex: 1,
        flexDirection: isLandscape ? "row" : "column",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: ovnioColors.Remote_Red_Trans,
      }}
      resizeMode="cover"
      source={isLandscape ? remote_bg_l : remote_bg_p}
    >
      {children}
    </ImageBackground>
  );
};
//#endregion

//#region RoundBtnComp
const RoundBtnComp = (prop) => {
  const { height, isBorder, bgColor } = prop;
  const heightFactor = height * 0.09;
  return (
    <TouchableOpacity
      style={{
        borderWidth: isBorder ? heightFactor * 0.1 : 0,

        backgroundColor: bgColor ? bgColor : "#000000",
        height: heightFactor, //height * 0.09
        width: heightFactor, //height * 0.09
        borderRadius: heightFactor * 0.5,
        borderColor: "#413F38", //"#625133",
        alignItems: "center",
        justifyContent: "center",
      }}
      onPress={prop.onPress}
    >
      {prop.icon ? (
        <Image
          source={prop.icon}
          style={{
            width: heightFactor * 0.4,
            height: heightFactor * 0.4,
            tintColor: ovnioColors.white,
            resizeMode: "contain",
            //backgroundColor: ovnioColors.white,
          }}
        />
      ) : (
        <Text
          style={[
            {
              textAlign: "center",
              fontSize: heightFactor * 0.2,
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

//#region WhiteSpeceComp
const WhiteSpeceComp = (prop) => {
  const heightFactor = prop.height * 0.09;
  return (
    <View
      style={{
        height: heightFactor, //height * 0.09
        width: heightFactor, //height * 0.09
      }}
    />
  );
};
//#endregion

//#region RoundBtnWithLblComp
const RoundBtnWithLblComp = (prop) => {
  const heightFactor = prop.height * 0.065;
  return (
    <TouchableOpacity
      onPress={prop.onPress}
      style={{
        alignItems: "center",
        justifyContent: "center",
        ...stylesCommon.elvation,
        height: heightFactor,
        width: heightFactor,
        borderRadius: heightFactor * 0.5,
        backgroundColor: prop.color ? prop.color : "#000000",
      }}
    >
      <Text
        style={[
          {
            textAlign: "center",
            fontSize: heightFactor * 0.2,
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
  const heightFactor = prop.height * 0.065;
  return (
    <TouchableOpacity
      style={{
        width: heightFactor,
        height: heightFactor,
        borderRadius: heightFactor * 0.5,
        justifyContent: "center",
        alignItems: "center", // centers horizontally
        backgroundColor: "#C7C7C7",
      }}
      onPress={() => prop.navigation.goBack()}
    >
      <Image
        source={ic_cross}
        style={{
          width: heightFactor * 0.6,
          height: heightFactor * 0.6,
          resizeMode: "contain",
        }}
      />
    </TouchableOpacity>
  );
};
//#endregion

//#region API
async function GetChannelDetailAPICall(chId, setLoader, navigation) {
  setLoader(true);
  await GetChannelDetail(chId)
    .then((res) => {
      setLoader(false);
      /* console.log(
        "\u001b[1;32mTR.js : Res GetChannelDetail = ",
        JSON.stringify(res.data.data)
      ); */
      const { channel, schedules } = res.data.data;
      if (schedules.length > 0) {
        const arrTmp = schedules.filter((item) => item.active == 1);
        const schData = arrTmp.length === 1 ? arrTmp[0] : schedules[0];
        const chDet = {
          id: channel.id,
          channel: channel.seq_no,
          channel_name: channel.channel_name,
          image: channel.channel_image,
          ispinned: channel.ispinned,
          blocked: channel.blocked,
          content_id: schData.content_id,
          schedule_id: schData.id,
        };
        GlobalValue.crtChannel = chDet;
        navigation.goBack();
        setTimeout(() => {
          navigation.navigate("ShopNow");
        }, 50);
      } else {
        const chDet = {
          id: channel.id,
          channel: channel.seq_no,
          channel_name: channel.channel_name,
          image: channel.channel_image,
          ispinned: channel.ispinned,
          blocked: channel.blocked,
        };
        GlobalValue.crtChannel = chDet;
        const chData = { ...chDet };
        chData.isfavourite = channel.isfavourite;
        chData.ch_description = channel.description;
        chData.liveUrl = channel.liveUrl;
        GlobalValue.crtChannel = chData;
        showCustomAlertWithMsg("No product found", navigation);
      }
      console.log(
        "\u001b[1;32mHD.js :  GlobalValue.crtChannel = ",
        JSON.stringify(GlobalValue.crtChannel)
      );
    })
    .catch((error) => {
      setLoader(false);
      showAPIError(error, "Error | Channel Detail");
    });
}
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
  const body = {
    channel: currentChannelId,
  };
  setLoader(true);
  await PostChannelPrevious(body, {})
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
    navigation.navigate("HomeDetails", {
      ChannelDetails: chDet,
      navType: 5,
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
  GlobalValue.userId = 0;
  navigation.goBack();
  setTimeout(() => {
    navigation.navigate("Welcome", {
      navType: 2,
    });
  }, 50);
}
//#endregion

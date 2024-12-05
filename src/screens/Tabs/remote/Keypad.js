//#region import
import React, { useState } from "react";
import {
  View,
  Text,
  Dimensions,
  TouchableOpacity,
  StyleSheet,
  Platform,
  ImageBackground,
  Image,
} from "react-native";
//package
import { BlurView } from "@react-native-community/blur";
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
import { showCustomAlertWithMsg } from "../../../utils/Alert";
//api
import { showAPIError } from "../../../api/Config";
import { PostChannelFind } from "../../../api/PostRequest";
import { FreeChannelViewingCheck } from "../../../api/GlobalAPICall";
//#endregion

//#region asset
const remote_bg = require("../../../assets/images/remote/remote_bg/remote_bg.png");
const plugr_logo = require("../../../assets/images/plugr_logo/plugr_logo.png");
const icRemoteBgAnd = require("../../../assets/images/remote/icRemoteBgAnd.png");
const ic_cross = require("../../../assets/icon/remote/cross/ic_cross.png");
const ic_go = require("../../../assets/icon/remote/Go/ic_go.png");
const ic_backA = require("../../../assets/icon/remote/backA/ic_backA.png");
//#endregion

//#region Main
export default function Keypad({ navigation }) {
  //#region useState
  const [loader, setLoader] = useState(false);
  const [arrChannel, setArrChannel] = useState(["_", "_", "_", "_", "_", "_"]);
  //#endregion

  //#region action
  const onRBtnPress = (item) => {
    if (item === 12) {
      let strChannel = arrChannel.toString();
      strChannel = strChannel.replaceAll("_", "");
      strChannel = strChannel.replaceAll(",", "");
      if (!FreeChannelViewingCheck(strChannel, navigation)) return;
      if (strChannel.length > 0) {
        PostChannelFindAPICall(strChannel, setLoader, navigation);
      }
    } else if (item === 11) {
      //navigation.pop(2);
      navigation.goBack();
    } else if (item === 10) {
      let arrTemp = [...arrChannel];
      for (let i = 5; i >= 0; i--) {
        const item = arrTemp[i];
        if (item !== "_") {
          arrTemp[i] = "_";
          setArrChannel(arrTemp);
          break;
        }
      }
    } else {
      let arrTemp = [...arrChannel];
      const index = arrTemp.indexOf("_");
      if (index !== -1) {
        arrTemp[index] = item;
        setArrChannel(arrTemp);
      }
    }
  };

  //#endregion

  return (
    <ScreenWrapper>
      <Image
        source={plugr_logo}
        style={{
          width: scaleXiPhone15.hundredH,
          height: scaleXiPhone15.hundredH,
        }}
      />
      {loader ? (
        <CustomLoader isSmall={false} color={ovnioColors.primaryRed} />
      ) : (
        <EnterChannelComp arrChannel={arrChannel} />
      )}
      <View style={styles.containerPower}>
        <KeyPadBtnComp num={"1"} index={1} onPress={onRBtnPress} />
        <KeyPadBtnComp num={"2"} index={2} onPress={onRBtnPress} />
        <KeyPadBtnComp num={"3"} index={3} onPress={onRBtnPress} />
      </View>
      <View style={styles.containerPower}>
        <KeyPadBtnComp num={"4"} index={4} onPress={onRBtnPress} />
        <KeyPadBtnComp num={"5"} index={5} onPress={onRBtnPress} />
        <KeyPadBtnComp num={"6"} index={6} onPress={onRBtnPress} />
      </View>
      <View style={styles.containerPower}>
        <KeyPadBtnComp num={"7"} index={7} onPress={onRBtnPress} />
        <KeyPadBtnComp num={"8"} index={8} onPress={onRBtnPress} />
        <KeyPadBtnComp num={"9"} index={9} onPress={onRBtnPress} />
      </View>
      <View style={styles.containerPower}>
        <KeyPadBtnComp
          isIcon={true}
          icon={ic_backA}
          title={"BACK"}
          index={10}
          onPress={onRBtnPress}
        />
        <KeyPadBtnComp num={"0"} index={0} onPress={onRBtnPress} />
        <KeyPadBtnComp
          isIcon={true}
          icon={ic_cross}
          title={"CLOSE"}
          index={11}
          onPress={onRBtnPress}
        />
      </View>
      <View style={styles.containerPower}>
        <KeyPadBtnComp
          isIcon={true}
          icon={ic_go}
          title={"GO"}
          index={12}
          onPress={onRBtnPress}
        />
      </View>
      <Image
        source={plugr_logo}
        style={{
          width: scaleXiPhone15.seventyH,
          height: scaleXiPhone15.seventyH,
        }}
      />
    </ScreenWrapper>
  );
}
const ScreenWrapper = ({ children }) => {
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
};
const styles = StyleSheet.create({
  container: {
    gap: scaleXiPhone15.sixteenH,
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: ovnioColors.Remote_Red_Trans,
  },
  txtHeader: {
    fontSize: 24,
    fontFamily: fonts.bold,
    color: ovnioColors.white,
  },
  containerPower: {
    flexDirection: "row",
    width: "100%",
    justifyContent: "space-evenly",
    //backgroundColor: "gray",
  },
});
//#endregion

//#region EnterChannelComp
const EnterChannelComp = (prop) => {
  const ChannelNoComp = (prop) => {
    return <Text style={stylesCh.txtChannel}>{prop.item}</Text>;
  };

  return (
    <View style={stylesCh.container}>
      {prop.arrChannel.map((item, key) => {
        return <ChannelNoComp key={key} item={item} />;
      })}
    </View>
  );
};
const stylesCh = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: scaleXiPhone15.sixteenW,
    paddingHorizontal: scaleXiPhone15.sixteenW,
    paddingVertical: scaleXiPhone15.twentyEightH,
    backgroundColor: "#000000",
    //border
    borderRadius: scaleXiPhone15.twelveH,
  },
  txtChannel: {
    fontSize: scaleXiPhone15.sixteenW,
    fontFamily: fonts.bold,
    color: ovnioColors.white,
  },
});
//#endregion

//#region KeyPadBtnComp
const KeyPadBtnComp = (prop) => {
  return (
    <TouchableOpacity
      style={stylesK.container}
      onPress={() => prop.onPress(prop.index)}
    >
      {prop.isIcon ? (
        <View style={{ alignItems: "center", justifyContent: "center" }}>
          <Image
            source={prop.icon}
            style={{
              width: scaleXiPhone15.twentyFourH,
              height: scaleXiPhone15.twentyFourH,
              tintColor: ovnioColors.white,
              resizeMode: "contain",
              //backgroundColor: ovnioColors.white,
            }}
          />
          <Text
            style={[
              stylesK.txtNum,
              { fontSize: prop.size ? prop.size : scaleXiPhone15.twelveH },
            ]}
          >
            {prop.title}
          </Text>
        </View>
      ) : (
        <Text style={stylesK.txtNum}>{prop.num}</Text>
      )}
    </TouchableOpacity>
  );
};
const stylesK = StyleSheet.create({
  container: {
    ...stylesCommon.elvation,
    height: scaleXiPhone15.seventyH,
    width: scaleXiPhone15.seventyH,
    borderRadius: scaleXiPhone15.seventyH * 0.5,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#000000",
  },
  txtNum: {
    fontFamily: fonts.bold,
    fontSize: scaleXiPhone15.thrityTwoH,
    color: "#FFFFFF",
    textAlign: "center",
    marginTop: scaleXiPhone15.fourH,
    //backgroundColor: "green",
  },
});
//#endregion

//#region API
async function PostChannelFindAPICall(currentChannelNO, setLoader, navigation) {
  const body = {
    seq_no: currentChannelNO,
  };
  setLoader(true);
  await PostChannelFind(body, {})
    .then((res) => {
      setLoader(false);
      console.log("\u001b[1;32mKP.js : Res = ", JSON.stringify(res.data));

      const chDet = {
        id: res.data.id,
        channel: res.data.seq_no,
        channel_name: res.data.channel_name,
        image: res.data.image,
        ispinned: res.data.ispinned,
        blocked: res.data.blocked,
        isfavourite: res.data.isfavourite,
        liveUrl: res.data.liveUrl,
      };
      navigation.pop(2);
      setTimeout(() => {
        /* navigation.navigate("HomeDetails", {
          ChannelDetails: chDet,
          navType: 4,
        }); */
        navigation.navigate("WatchAppStack", {
          screen: "HomeDetails",
          params: {
            ChannelDetails: chDet,
            navType: 4,
          },
        });
      }, 50);
    })
    .catch((error) => {
      setLoader(false);
      showAPIError(error, "Channel Find Error");
    });
}
//#endregion

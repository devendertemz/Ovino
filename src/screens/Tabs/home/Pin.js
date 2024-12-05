//#region import
import React, { useState } from "react";
import {
  View,
  Text,
  Dimensions,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
} from "react-native";
const { height, width } = Dimensions.get("window");
import Ionicons from "react-native-vector-icons/Ionicons";

//baseComponent
import CustomLoader from "../../../components/baseComponent/CustomLoader";
//blockComponent
import Header from "../../../components/blockComponent/Header";
//utils
import TextStrings from "../../../utils/TextStrings";
import { saveUserSetPin } from "../../../utils/LocalDataStorage";
import { stylesCommon } from "../../../utils/CommonStyle";
import { showCustomAlertWithMsg } from "../../../utils/Alert";
import {
  appSize,
  fonts,
  ovnioColors,
  scaleXiPhone15,
} from "../../../utils/Variable";

//api
import { showAPIError } from "../../../api/Config";
import { PostChannelPinVerify } from "../../../api/PostRequest";
import GlobalValue from "../../../api/GlobalVar";
import {
  DeleteUnlockChannel,
  GetChannelBlockWithId,
  UpdateAllChannelPin,
  DeleteAllChannelUnlock,
} from "../../../api/GetRequest";

//#endregion

//#region Main
export default function Pin({ navigation, route }) {
  //* pinType
  /* 
  1 - Set Pin for user & Add channel for parental control [i.e GlobalValue.pinSet === false , ]
  2 - Verify Pin  & Add channel for parental control based on ispinned [i.e GlobalValue.pinSet === true , ispinned == false ]
  3 - Verify Pin & Remove a channel from parental control based on ispinned [i.e GlobalValue.pinSet === true , ispinned == true ]
  4 - Verify Pin & Remove all channel from parental control  [i.e GlobalValue.pinSet === true ]
  5 - Update Pin for parntal control
  */
  const { chObj } = route.params;
  console.log("\u001b[1;33m P.js chObj  = ", JSON.stringify(chObj));
  console.log("\u001b[1;33m P.js GlobalValue.pinSet = ", GlobalValue.pinSet);

  //#region useState
  const [loader, setLoader] = useState(false);
  const [arrPin, setArrPin] = useState(["_", "_", "_", "_"]);
  //#endregion

  //#region action
  const onBackBtnPress = () => {
    navigation.goBack();
  };
  const onRBtnPress = (item) => {
    if (item === 11) {
      let strPin = arrPin.toString();
      strPin = strPin.replaceAll("_", "");
      strPin = strPin.replaceAll(",", "");
      console.log("\u001b[1;33m P.js strPin  = ", strPin);
      if (strPin.length !== 4) {
        showCustomAlertWithMsg(TextStrings.alertPin, navigation);
        return;
      }
      if (chObj?.pinType === 1 || chObj?.pinType === 5) {
        UpdateAllChannelPinAPICall(
          strPin,
          chObj.chId,
          chObj?.pinType,
          setLoader,
          navigation
        );
      } else if (
        chObj?.pinType === 2 ||
        chObj?.pinType === 3 ||
        chObj?.pinType === 4
      ) {
        PostChannelPinVerifyAPICall(
          strPin,
          chObj.chId,
          chObj?.pinType,
          setLoader,
          navigation
        );
      } else {
        console.log("\u001b[1;31mP.js :  undefined pinType");
      }
    } else if (item === 10) {
      let arrTemp = [...arrPin];
      for (let i = 3; i >= 0; i--) {
        const item = arrTemp[i];
        if (item !== "_") {
          arrTemp[i] = "_";
          setArrPin(arrTemp);
          break;
        }
      }
    } else if (item === 12) {
      console.log("Forgot");
      navigation.navigate("Pin", {
        chObj: {
          pinType: 5,
        },
      });
    } else {
      let arrTemp = [...arrPin];
      const index = arrTemp.indexOf("_");
      if (index !== -1) {
        arrTemp[index] = item;
        setArrPin(arrTemp);
      }
    }
  };
  //#endregion

  //#region JSX
  const setHeaderTitle = () => {
    if (chObj?.pinType === 1) {
      return "Set the Pin";
    } else if (chObj?.pinType === 3) {
      return "Unlock Channel";
    } else if (chObj?.pinType === 5) {
      return "Change the Pin";
    } else {
      return "Enter the Pin";
    }
  };
  const setScreenTitle = () => {
    if (chObj?.pinType === 1 || chObj?.pinType === 2 || chObj?.pinType === 3) {
      return "Channel " + chObj?.channel + ", " + chObj?.channel_name;
    } else if (chObj?.pinType === 4) {
      return "Remove all channels";
    } else if (chObj?.pinType === 5) {
      return "";
    } else {
      return "";
    }
  };
  //#endregion

  return (
    <SafeAreaView style={{ backgroundColor: ovnioColors.background }} flex={1}>
      <Header
        title={setHeaderTitle()}
        isBackDisable={false}
        onBackBtnPress={onBackBtnPress}
      />
      <Text style={styles.txtChannel}>{setScreenTitle()}</Text>
      <View style={styles.container}>
        {loader ? (
          <CustomLoader
            padding={scaleXiPhone15.sixteenH}
            isSmall={false}
            color={ovnioColors.primaryRed}
          />
        ) : (
          <EnterChannelComp arrPin={arrPin} />
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
          {chObj?.pinType === 5 || chObj?.pinType === 1 ? (
            <KeyPadBtnComp
              iconName={"enter-outline"}
              index={11}
              onPress={onRBtnPress}
            />
          ) : (
            <KeyPadTextComp num={"Forgot?"} index={12} onPress={onRBtnPress} />
          )}

          <KeyPadBtnComp num={"0"} index={0} onPress={onRBtnPress} />
          <KeyPadBtnComp
            iconName={"backspace-outline"}
            index={10}
            onPress={onRBtnPress}
          />
        </View>
        {chObj?.pinType === 5 || chObj?.pinType === 1 ? null : (
          <View style={styles.containerPower}>
            <KeyPadBtnComp
              iconName={"enter-outline"}
              index={11}
              onPress={onRBtnPress}
            />
          </View>
        )}
      </View>
    </SafeAreaView>
  );
}
const styles = StyleSheet.create({
  container: {
    gap: scaleXiPhone15.sixteenH,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: ovnioColors.background,
    //backgroundColor: "red",
  },
  containerPower: {
    flexDirection: "row",
    width: "100%",
    justifyContent: "space-evenly",
    //backgroundColor: "gray",
  },
  txtChannel: {
    paddingVertical: scaleXiPhone15.fortyH,
    fontSize: scaleXiPhone15.sixteenW,
    fontFamily: fonts.medium,
    color: ovnioColors.grayDesc,
    alignSelf: "center",
  },
});
//#endregion

//#region EnterChannelComp
const EnterChannelComp = (prop) => {
  const ChannelNoComp = (prop) => {
    return (
      <View
        style={[
          stylesCh.circlePin,
          {
            backgroundColor:
              prop.item == "_"
                ? ovnioColors.background
                : ovnioColors.primaryRed,
          },
        ]}
      ></View>
    );
  };

  return (
    <View style={stylesCh.container}>
      {prop.arrPin.map((item, key) => {
        return <ChannelNoComp key={key} item={item} />;
      })}
    </View>
  );
};
const stylesCh = StyleSheet.create({
  container: {
    flexDirection: "row",
    gap: height * 0.2 * 0.1,
    width: height * 0.2,
    height: height * 0.2 * 0.5,
    alignItems: "center",
    justifyContent: "center",
    //backgroundColor: ovnioColors.blackContainerBg,
    //backgroundColor: ovnioColors.fbBg,
  },
  circlePin: {
    width: height * 0.025,
    height: height * 0.025,
    borderRadius: (height * 0.025) / 2,
    borderColor: ovnioColors.primaryRed,
    borderWidth: scaleXiPhone15.oneH,
  },
});
//#endregion

//#region KeyPadBtnComp
const KeyPadBtnComp = (prop) => {
  return (
    <TouchableOpacity
      activeOpacity={0.2}
      style={[
        stylesK.container,
        {
          borderWidth:
            prop.iconName || prop.circleRemove ? null : scaleXiPhone15.oneH,
          borderColor:
            prop.iconName || prop.circleRemove ? null : ovnioColors.white,
        },
      ]}
      onPress={() => prop.onPress(prop.index)}
    >
      {prop.iconName ? (
        <Ionicons
          name={prop.iconName}
          size={scaleXiPhone15.twentyEightH}
          color={ovnioColors.white}
        />
      ) : (
        <Text
          style={[
            stylesK.txtNum,
            {
              fontSize: prop.circleRemove ? height * 0.022 : height * 0.042,
            },
          ]}
        >
          {prop.num}
        </Text>
      )}
    </TouchableOpacity>
  );
};
const stylesK = StyleSheet.create({
  container: {
    ...stylesCommon.elvation,
    height: height * 0.08,
    width: height * 0.08,
    borderRadius: height * 0.08 * 0.5,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: ovnioColors.background,
  },
  txtNum: {
    fontFamily: fonts.thin,
    color: "white",
    textAlign: "center",
    marginTop: 2,
  },
});
//#endregion

//#region KeyPadTextComp
const KeyPadTextComp = (prop) => {
  return (
    <TouchableOpacity
      activeOpacity={0.2}
      style={[stylesK.container]}
      onPress={() => prop.onPress(prop.index)}
    >
      <Text
        style={[
          stylesK.txtNum,
          {
            fontFamily: fonts.medium,
          },
        ]}
      >
        {prop.num}
      </Text>
    </TouchableOpacity>
  );
};

//#endregion

//#region Api
async function UpdateAllChannelPinAPICall(
  pin,
  chId,
  pinType,
  setLoader,
  navigation
) {
  const body = {
    pin: pin,
  };
  setLoader(true);
  await UpdateAllChannelPin(body)
    .then((res) => {
      console.log(
        "\u001b[1;32mPin.js : Res Update all channel Pin  = ",
        JSON.stringify(res.data)
      );
      if (!GlobalValue.pinSet) {
        saveUserSetPin(res.data.data.pinset);
        GlobalValue.pinSet = res.data.data.pinset;
      }
      if (pinType === 1) {
        GetChannelBlockWithIdAPICall(chId, setLoader, navigation);
      } else {
        setLoader(false);
        navigation.goBack();
        showCustomAlertWithMsg("pin changed successfully", navigation);
      }
    })
    .catch((error) => {
      setLoader(false);
      showAPIError(error, "Update Channel Pin Error");
    });
}
async function PostChannelPinVerifyAPICall(
  pin,
  chId,
  pinType,
  setLoader,
  navigation
) {
  const body = {
    pin: pin,
  };
  setLoader(true);
  await PostChannelPinVerify(body, chId)
    .then((res) => {
      console.log(
        "\u001b[1;32mP.js : Res pin verify = ",
        JSON.stringify(res.data)
      );
      if (pinType === 2) {
        GetChannelBlockWithIdAPICall(chId, setLoader, navigation);
      } else if (pinType === 3) {
        DeleteUnlockChannelAPICall(chId, setLoader, navigation);
      } else if (pinType === 4) {
        DeleteAllUnlockChannelAPICall(setLoader, navigation);
      }
    })
    .catch((error) => {
      setLoader(false);
      if (error.response.status === 400) {
        showCustomAlertWithMsg(
          error.response.data.errors[0].message,
          navigation
        );
        return;
      }
      showAPIError(error, "Channel Pin Verify Error");
    });
}
async function GetChannelBlockWithIdAPICall(chId, setLoader, navigation) {
  setLoader(true);
  await GetChannelBlockWithId(chId)
    .then((res) => {
      setLoader(false);
      console.log(
        "\u001b[1;32mPin.js : Res Add Channel Parent Ctrl = ",
        JSON.stringify(res.data)
      );
      navigation.goBack();
    })
    .catch((error) => {
      setLoader(false);
      showAPIError(error, "Channel Pin Error");
    });
}
async function DeleteUnlockChannelAPICall(chId, setLoader, navigation) {
  setLoader(true);
  await DeleteUnlockChannel(chId)
    .then((res) => {
      setLoader(false);
      console.log(
        "\u001b[1;32mP.js : Res Unlock Channel Res = ",
        JSON.stringify(res.data)
      );
      navigation.goBack();
    })
    .catch((error) => {
      setLoader(false);
      showAPIError(error, "Unlock Channel Error");
    });
}
async function DeleteAllUnlockChannelAPICall(setLoader, navigation) {
  setLoader(true);
  await DeleteAllChannelUnlock()
    .then((res) => {
      setLoader(false);
      console.log(
        "\u001b[1;32mP.js : Res Unlock All Channel Res = ",
        JSON.stringify(res.data)
      );
      navigation.goBack();
    })
    .catch((error) => {
      setLoader(false);
      showAPIError(error, "All Unlock Channel Error");
    });
}
//#endregion

//#region import
import React, { useState, useEffect } from "react";
import { Text, View, StyleSheet, TouchableOpacity } from "react-native";
//misc
import {
  appSize,
  fonts,
  ovnioColors,
  scaleXiPhone15,
  checkForTablet,
} from "../../utils/Variable";
import Ionicons from "react-native-vector-icons/Ionicons";
import { stylesCommon } from "../../utils/CommonStyle";
import CustomLoader from "../baseComponent/CustomLoader";

//api
import { GetSetReminder } from "../../api/GetRequest";
import { showAPIError } from "../../api/Config";
import GlobalValue from "../../api/GlobalVar";
//#endregion

//#region Main
export default ReminderAlert = ({ navigation, route }) => {
  //* remindType
  // 1 - Add a reminder no prev reminder
  // 2 - Replaces existing reminder
  const { remind, remindType, extradata } = route.params;
  console.log(
    "\u001b[1;33mRA.js : remind | remindType | extradata  = ",
    JSON.stringify(remind, null, 4),
    remindType,
    JSON.stringify(extradata)
  );

  //#region useState
  const [loader, setLoader] = useState(false);
  //#endregion

  //#region action
  const onSubmitPress = () => {
    GetSetReminderAPICall(remind, remindType, extradata, setLoader, navigation);
  };
  //#endregion

  //#region JSX
  const CrossComp = () => {
    return (
      <TouchableOpacity
        onPress={() => navigation.goBack()}
        style={styles.containerCross}
      >
        <Ionicons
          name="close"
          size={scaleXiPhone15.fortyH}
          color={ovnioColors.white}
        />
      </TouchableOpacity>
    );
  };
  const SubmitComp = () => {
    if (loader) {
      return (
        <CustomLoader
          padding={scaleXiPhone15.sixteenW}
          isSmall={false}
          color={ovnioColors.primaryRed}
        />
      );
    } else {
      return (
        <TouchableOpacity
          style={styles.containerBtmBtn}
          onPress={onSubmitPress}
        >
          <Text style={stylesCommon.txtBtn}>Yes</Text>
        </TouchableOpacity>
      );
    }
  };
  const HeaderTitleComp = () => {
    return remindType === 1
      ? "Do you want to add reminder"
      : "Already reminder of this slot replace with";
  };
  //#endregion

  return (
    <View style={styles.container}>
      <View style={styles.centeredView}>
        <CrossComp />
        <View style={styles.containerAlert}>
          <Ionicons
            name="alarm-sharp"
            size={scaleXiPhone15.fortyH}
            color={ovnioColors.primaryRed}
          />
          <Text style={[stylesCommon.txtCtryName, { fontFamily: fonts.bold }]}>
            {HeaderTitleComp()}
          </Text>
          <Text
            style={[
              stylesCommon.txtCtryName,
              { color: ovnioColors.primaryRed },
            ]}
          >
            {remind.time_start}
          </Text>
          <Text
            style={[
              stylesCommon.txtCtryName,
              { fontFamily: fonts.bold, color: ovnioColors.primaryRed },
            ]}
          >
            {remind.name}
          </Text>
          <SubmitComp />
        </View>
      </View>
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  centeredView: {
    gap: scaleXiPhone15.twelveH,
    padding: scaleXiPhone15.eightH,
    width: checkForTablet() ? "60%" : "90%",
    justifyContent: "center",
    alignItems: "center",
    //backgroundColor: ovnioColors.white,
  },
  containerCross: {
    justifyContent: "center",
    alignItems: "center",
    height: scaleXiPhone15.sixtyH,
    width: scaleXiPhone15.sixtyH,
    borderRadius: scaleXiPhone15.sixtyH * 0.5,
    backgroundColor: ovnioColors.blackContainerBg,
  },
  containerAlert: {
    //paddingHorizontal: scaleXiPhone15.eightH,
    gap: scaleXiPhone15.twelveH,
    paddingTop: scaleXiPhone15.twentyFourH,
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: scaleXiPhone15.tenW,
    backgroundColor: ovnioColors.white,
  },
  containerBtmBtn: {
    marginTop: scaleXiPhone15.sixteenH,
    paddingVertical: scaleXiPhone15.sixteenH,
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
    borderBottomLeftRadius: scaleXiPhone15.tenW,
    borderBottomRightRadius: scaleXiPhone15.tenW,
    backgroundColor: ovnioColors.primaryRed,
  },
});
//#endregion

//#region Api
async function GetSetReminderAPICall(
  item,
  remindType,
  extradata,
  setLoader,
  navigation
) {
  setLoader(true);
  const para = {};
  if (remindType === 2) {
    para.prev_schedule_id = extradata.prev_schedule_id;
  }
  await GetSetReminder(
    item.id,
    GlobalValue.crtChannel.id,
    item.content_id,
    para
  )
    .then((res) => {
      setLoader(false);
      console.log(
        "\u001b[1;32mRA.js : Res GetSetReminder = ",
        JSON.stringify(res.data)
      );
      navigation.goBack();
    })
    .catch((error) => {
      setLoader(false);
      if (error.response.data) {
        const { errors } = error.response.data;
        if (errors) {
          const { code, extradata } = errors[0];
          if (code && code === 101) {
            console.log(
              "\u001b[1;33mRA.js : extradata  = ",
              JSON.stringify(extradata, null, 4)
            );
            navigation.goBack();
            if (remindType === 1) {
              setTimeout(() => {
                navigation.navigate("ReminderAlert", {
                  remind: item,
                  remindType: 2,
                  extradata: extradata,
                });
              }, 50);
            }
            return;
          }
        }
      }
      showAPIError(error, "Add Reminder Error");
    });
}
//#endregion

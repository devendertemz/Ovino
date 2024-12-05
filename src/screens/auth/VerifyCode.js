//#region import
import {
  View,
  StyleSheet,
  Dimensions,
  SafeAreaView,
  ImageBackground,
  Text,
  KeyboardAvoidingView,
} from "react-native";
import React, { useEffect, useState } from "react";
const { height, width } = Dimensions.get("window");
import OTPInputView from "@twotalltotems/react-native-otp-input";
//blockComponent
import Header from "../../components/blockComponent/Header";
import PopupHeader from "../../components/blockComponent/PopupHeader";
//baseComponent
import BtnApp from "../../components/baseComponent/BtnApp";
//utils

import {
  appSize,
  fonts,
  ovnioColors,
  scaleXiPhone15,
  checkForTablet,
  APP_SCREEN,
} from "../../utils/Variable";
import { stylesCommon } from "../../utils/CommonStyle";
import { showCustomAlertWithMsg } from "../../utils/Alert";
import TextStrings from "../../utils/TextStrings";
//api
import { ResendOtp, VerifyOtp } from "../../api/PostRequest";
import { showAPIError } from "../../api/Config";
//asset
const plugr_bg_image = require("../../assets/images/plugr-bg-image/plugr-bg-image.png");
//#endregion

//#region Main
export default function VerifyCode({ navigation, route }) {
  const { id, otp, email_id } = route.params;
  console.log(
    "\u001b[1;31mVC.js : route.params ",
    JSON.stringify(route.params)
  );

  //#region useState
  const [loader, setLoader] = React.useState(false);
  const [codeValue, setCodeValue] = useState("");
  //#endregion

  //#region actions
  const onBackBtnPress = () => {
    navigation.goBack();
  };
  const onVerify = () => {
    VerifyOtpAPICall(id, codeValue, setLoader, navigation);
  };
  const onResendCodeClick = () => {
    ResendOtpAPICall(id, setLoader, navigation);
  };
  //#endregion

  return (
    <SafeAreaView style={{ backgroundColor: ovnioColors.background, flex: 1 }}>
      <ImageBackground
        source={plugr_bg_image} // Replace with your image URL
        style={{ flex: 1 }}
        imageStyle={{ opacity: 0.5 }}
      >
        <KeyboardAvoidingView
          style={styles.bottomView}
          behavior={Platform.OS === "ios" ? "padding" : "height"}
        >
          <PopupHeader title="Verify Code" />
          <Text style={[styles.labelBold, { fontFamily: fonts.regular }]}>
            {TextStrings.Pleaseenterthefourdigitcodesentto}
          </Text>
          <Text style={[styles.labelBold]}>{email_id}</Text>
          <OTPInputView
            code={codeValue}
            style={{ width: "100%", height: scaleXiPhone15.eightyH }}
            pinCount={4}
            autoFocusOnLoad={false}
            codeInputFieldStyle={styles.underlineStyleBase}
            codeInputHighlightStyle={styles.underlineStyleHighLighted}
            onCodeChanged={(code) => {
              console.log(`onCodeChanged ${code}`);
              setCodeValue(code);
            }}
            onCodeFilled={(code) => {
              console.log(`onCodeFilled ${code}`);
            }}
          />
          <View style={styles.resendView}>
            <Text style={[styles.label]}>Didn’t receive a code?</Text>
            <Text onPress={onResendCodeClick} style={[styles.resendLinkTxt]}>
              &nbsp;Resend Code
            </Text>
          </View>
          <BtnApp
            isAPICall={loader}
            title="Verify"
            marginVertical={0}
            onPress={onVerify}
          />
          <Text
            onPress={onBackBtnPress}
            style={[
              styles.resendLinkTxt,
              {
                textDecorationLine: "none",
                paddingBottom: scaleXiPhone15.sixteenH,
              },
            ]}
          >
            Back
          </Text>
        </KeyboardAvoidingView>
      </ImageBackground>
    </SafeAreaView>
  );
}
const styles = StyleSheet.create({
  bottomView: {
    alignItems: "center", // Center text in bottom view
    padding: scaleXiPhone15.twentyH,
    gap: scaleXiPhone15.sixteenH,
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    borderTopLeftRadius: scaleXiPhone15.fortyH,
    borderTopRightRadius: scaleXiPhone15.fortyH,
    backgroundColor: ovnioColors.background,
  },
  labelBold: {
    ...stylesCommon.txtBtn,
    textAlign: "left",
  },
  resendView: {
    alignItems: "center",
    flexDirection: "row",
    //backgroundColor: "red",
  },
  label: {
    ...stylesCommon.txtBtn,
    fontSize: scaleXiPhone15.fouteenH,
  },
  resendLinkTxt: {
    ...stylesCommon.txtBtn,
    fontSize: scaleXiPhone15.fouteenH,
    textDecorationLine: "underline",
    color: ovnioColors.primaryRed,
  },
  underlineStyleBase: {
    marginTop: scaleXiPhone15.twelveH,
    marginTop: 0,
    height: scaleXiPhone15.fivtyH,
    width: scaleXiPhone15.sixtyW,
    borderRadius: scaleXiPhone15.eightH,
    backgroundColor: ovnioColors.blackInputBg,
    borderColor: ovnioColors.blackInputBorder,
    ...stylesCommon.titleWelcome,
  },
  underlineStyleHighLighted: {
    borderColor: ovnioColors.grayIconColor,
    borderWidth: appSize.two,
    //backgroundColor: '#000000',
  },
});
//#endregion

//#region API
async function VerifyOtpAPICall(id, otp, setLoader, navigation) {
  //#region Validation
  if (otp.trim().length == 0) {
    showCustomAlertWithMsg(TextStrings.otpMsg, navigation);
    return;
  } else if (otp.trim().length !== 4) {
    showCustomAlertWithMsg(TextStrings.validotpMsg, navigation);
    return;
  }
  //#endregion

  setLoader(true);
  await VerifyOtp({
    id: id,
    otp: otp,
  })
    .then((res) => {
      setLoader(false);
      console.log("\u001b[1;32mVC.js : Res", JSON.stringify(res.data));
      const { user, pinset } = res.data;
      navigation.navigate(APP_SCREEN.APP_REG_PREF, {
        user: {
          id: user.id,
          email_id: user.email_id,
          first_name: user.first_name,
          username: user.username,
          profile_pic: user.profile_pic,
          created_at: user.created_at,
          pinset: pinset,
          is_subscribed: user.is_subscribed,
        },
      });
    })
    .catch((error) => {
      setLoader(false);
      showAPIError(error, "Verify Otp Error");
    });
}
async function ResendOtpAPICall(id, setLoader, navigation) {
  setLoader(true);
  await ResendOtp({
    id: id,
  })
    .then((res) => {
      setLoader(false);
      showCustomAlertWithMsg(TextStrings.otpResend, navigation);
      console.log("\u001b[1;32mVC.js: Res resend = ", JSON.stringify(res.data));
    })
    .catch((error) => {
      setLoader(false);
      showAPIError(error, "Resend Otp Error");
    });
}

//#endregion

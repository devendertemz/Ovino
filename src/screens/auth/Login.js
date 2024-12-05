//#region import
import React, { useState, useEffect } from "react";
import {
  Text,
  TouchableOpacity,
  SafeAreaView,
  StyleSheet,
  Alert,
  Platform,
  BackHandler,
  ImageBackground,
  KeyboardAvoidingView,
} from "react-native";
import DeviceInfo from "react-native-device-info";
//blockComponent
import PopupHeader from "../../components/blockComponent/PopupHeader";
import TextInputFieldWithLabel from "../../components/blockComponent/TextInputFieldWithLabel";
import PasswordInputFieldwithLabel from "../../components/blockComponent/PasswordInputFieldwithLabel";
import BtnApp from "../../components/baseComponent/BtnApp";

//utils
import TextStrings from "../../utils/TextStrings";
import Validation from "../../utils/Validation";
import { showMsgAlert, showCustomAlertWithMsg } from "../../utils/Alert";
import {
  ovnioColors,
  fonts,
  scaleXiPhone15,
  checkForTablet,
  APP_SCREEN,
} from "../../utils/Variable";
import {
  saveUserID,
  saveUserSetPin,
  saveUserEmail,
} from "../../utils/LocalDataStorage";
//api
import GlobalValue from "../../api/GlobalVar";
import { PostLogin } from "../../api/PostRequest";
import { showAPIError } from "../../api/Config";
import { HttpRequestBaseURLConfig } from "../../api/Config";
import { stylesCommon } from "../../utils/CommonStyle";
import { GetUserProfileAPICall, SaveUserData } from "../../api/GlobalAPICall";
//asset
const plugr_bg_image = require("../../assets/images/plugr-bg-image/plugr-bg-image.png");
//#endregion

//#region Main
export default function Login({ navigation }) {
  //#region useState
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [deviceId, setDeviceId] = useState("");
  const [loader, setLoader] = useState(false);
  //#endregion

  useEffect(() => {
    const fetchDeviceId = async () => {
      const id = await DeviceInfo.getUniqueId();
      setDeviceId(id);
    };
    fetchDeviceId();
  }, []);
  //console.log("\u001b[1;33mL.js.js : deviceId = ", deviceId);

  //#region back btn disable (on andriod)
  useEffect(() => {
    if (Platform.OS === "android") {
      const unsubscribe = navigation.addListener("beforeRemove", (e) => {
        if (e.data.action.type == "GO_BACK") {
          e.preventDefault();
          BackHandler.exitApp();
        }
      });
      return unsubscribe;
    }
  }, [navigation]);
  const backAction = () => {
    Alert.alert(
      "Exit App",
      "Exiting the application?",
      [
        {
          text: "Cancel",

          onPress: () => console.log("Cancel Pressed"),
          style: "cancel",
        },
        {
          text: "OK",
          onPress: () => BackHandler.exitApp(),
        },
      ],
      {
        cancelable: false,
      }
    );
    return true;
  };
  //#endregion

  //#region action
  const onLoginBtnPress = () => {
    navigation.navigate("VCScreen");
    //loginAPICall(email, password, deviceId, setLoader, navigation);
  };
  const onBackBtnPress = () => {
    navigation.navigate("Welcome", {
      navType: 1,
    });
  };
  const onRegBtnPress = () => {
    navigation.navigate("Reg");
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
          <PopupHeader title="Log in to Plugr " />
          <TextInputFieldWithLabel
            marginBottom={0}
            placeholder="Enter Email"
            value={email}
            onChangeText={setEmail}
          />
          <PasswordInputFieldwithLabel
            marginBottom={0}
            placeholder="Enter Password"
            value={password}
            onChangeText={setPassword}
          />
          <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
          <BtnApp
            isAPICall={loader}
            title="Login"
            marginVertical={scaleXiPhone15.eightH}
            onPress={onLoginBtnPress}
          />
          <TouchableOpacity
            style={styles.signUpContainer}
            onPress={onRegBtnPress}
          >
            <Text style={styles.signUpText}>
              {"New to Plugr? "}
              <Text style={styles.signUpLink}>Sign Up</Text>
            </Text>
          </TouchableOpacity>
          <VersionInfoComp />
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
  forgotPasswordText: {
    color: ovnioColors.white,
    fontFamily: fonts.regular,
    fontSize: scaleXiPhone15.twelveH,

    alignSelf: "flex-start",
    textDecorationLine: "underline",
  },
  signUpContainer: {
    marginTop: scaleXiPhone15.eightH,
    paddingBottom: scaleXiPhone15.twentyFourH,
    alignItems: "center",
  },
  signUpText: {
    ...stylesCommon.txtBtn,
    fontSize: scaleXiPhone15.fouteenH,
  },
  signUpLink: {
    ...stylesCommon.txtBtn,
    textDecorationLine: "underline",
    color: ovnioColors.primaryRed,
  },
});
//#endregion

//#region VersionInfoComp
const VersionInfoComp = () => {
  return (
    <Text
      style={{
        fontSize: scaleXiPhone15.fouteenH,
        fontFamily: fonts.regular,
        textAlign: "center",
        color: "white",
        width: "100%",
        // backgroundColor: "red",
      }}
    >
      {HttpRequestBaseURLConfig.appVersion}
    </Text>
  );
};
//#endregion

//#region API
async function loginAPICall(email, password, deviceId, setLoader, navigation) {
  //#region Validation
  if (email.trim().length == 0) {
    showCustomAlertWithMsg(TextStrings.emailMsg, navigation);
    return;
  } else if (
    Validation.phoneRegex.test(email.trim()) === false &&
    Validation.EmailValidation.test(email.trim()) === false
  ) {
    showCustomAlertWithMsg(TextStrings.emailInvalidMsg, navigation);
    return;
  } else if (password.trim().length == 0) {
    showCustomAlertWithMsg(TextStrings.passwordMsg, navigation);
    return;
  } else if (Validation.PasswordValidation.test(password.trim()) === false) {
    const msg =
      TextStrings.Minimum8characters +
      "\n" +
      TextStrings.passwordformate +
      "\n" +
      TextStrings.alertPassAllowedSpecialChar;
    showCustomAlertWithMsg(msg, navigation);
    return;
  }
  //#endregion

  setLoader(true);
  await PostLogin({
    email_id: email,
    password: password,
    fcm_id: GlobalValue.fcmToken,
    device_id: deviceId,
    device_type: Platform.OS === "ios" ? 3 : 1, // 1 Andriod | 2 Web | 3 iOS
  })
    .then((res) => {
      setLoader(false);
      const { pinset, user } = res.data.data;
      console.log("\u001b[1;32mL.js : RES | pinset = ", JSON.stringify(pinset));
      console.log("\u001b[1;32mL.js : RES | user = ", JSON.stringify(user));
      user.pinset = pinset;
      user.first_name = user.name;

      if (user.is_preferences) {
        SaveUserData(user);
        navigation.navigate(APP_SCREEN.APP_SPLASH_OPTION);
      } else {
        navigation.navigate(APP_SCREEN.APP_REG_PREF, {
          user: {
            id: user.id,
            email_id: user.email_id,
            first_name: user.first_name,
            username: user.username,
            profile_pic: user.profile_pic,
            created_at: user.created_at,
            pinset: user.pinset,
            is_subscribed: user.is_subscribed,
          },
        });
      }
    })
    .catch((error) => {
      setLoader(false);
      if (error.response?.data?.errors[0]?.code) {
        console.log(
          "\u001b[1;32mL.js : Res login catch ",
          JSON.stringify(error.response.data)
        );
        const userid = error.response.data.errors[0].extradata?.id;
        if (userid) {
          navigation.navigate(APP_SCREEN.APP_VERIFY_CODE, {
            id: userid,
            otp: 1234,
            email_id: email,
          });
        }
      } else {
        showAPIError(error, "Login Error");
      }
    });
}
//#endregion

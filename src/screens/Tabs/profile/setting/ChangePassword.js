//#region import
import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Alert,
  TouchableOpacity,
  SafeAreaView,
  StyleSheet,
  BackHandler,
} from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import Feather from "react-native-vector-icons/Feather";
import FontAwesome from "react-native-vector-icons/FontAwesome";

//blockComponent
import Header from "../../../../components/blockComponent/Header";
import TextInputField from "../../../../components/blockComponent/TextInputField";
import PasswordInputField from "../../../../components/blockComponent/PasswordInputField";
import BtnApp from "../../../../components/baseComponent/BtnApp";

//utils
import TextStrings from "../../../../utils/TextStrings";
import Validation from "../../../../utils/Validation";
import { showMsgAlert, showCustomAlertWithMsg } from "../../../../utils/Alert";
import { ovnioColors, fonts, appSize } from "../../../../utils/Variable";

//api
import { PostLogin } from "../../../../api/PostRequest";
//#endregion

//#region LoginScreen
export default function ChangePassword({ navigation }) {
  //#region useState
  const [password, setPassword] = useState("");
  const [cpassword, setcPassword] = useState("");

  const [loader, setLoader] = useState(false);
  //#endregion

  //#region action
  const onLoginBtnPress = () => {
    changePasswordAPICall(password, cpassword, navigation, setLoader);
  };
  const onBackBtnPress = () => {
    navigation.goBack();
  };
  const onRegBtnPress = () => {
    navigation.navigate("Reg");
  };
  //#endregion

  return (
    <SafeAreaView style={{ backgroundColor: ovnioColors.background, flex: 1 }}>
      <View style={styles.ovnioContainer}>
        <Header title="Change Password" onBackBtnPress={onBackBtnPress} />
        <View style={styles.innerContainer}>
          <TextInputField
            marginBottom={appSize.eighteen}
            icon="lock"
            placeholder="New Password"
            value={password}
            onChangeText={setPassword}
          />
          <TextInputField
            marginBottom={appSize.eighteen}
            icon="lock"
            placeholder="Re-type New Password"
            value={cpassword}
            onChangeText={setcPassword}
          />

          <BtnApp
            isAPICall={loader}
            title="Update Now"
            onPress={onLoginBtnPress}
          />
        </View>
      </View>
    </SafeAreaView>
  );
}
const styles = StyleSheet.create({
  ovnioContainer: {
    flex: 1,
    justifyContent: "flex-start",
    backgroundColor: ovnioColors.background,
  },
  innerContainer: {
    flex: 0.7,
    justifyContent: "center",
    paddingHorizontal: 16,
    //backgroundColor: 'lightblue',
  },
  forgotPasswordContainer: {
    alignItems: "flex-end",
  },
  forgotPasswordText: {
    color: ovnioColors.primaryRed,
    fontFamily: fonts.regular,
  },
  signUpContainer: {
    alignItems: "center",
  },
  signUpText: {
    color: ovnioColors.textSecondary,
    fontFamily: fonts.regular,
  },
  signUpLink: {
    color: ovnioColors.text,
    textDecorationLine: "underline",
    fontFamily: fonts.bold,
  },
});
//#endregion

//#region API
async function changePasswordAPICall(
  password,
  cpassword,
  navigation,
  setLoader
) {
  //#region Validation
  if (password.trim().length == 0) {
    showCustomAlertWithMsg(TextStrings.newPasswordMsg, navigation);
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
  } else if ((cpassword.trim() === password.trim()) === false) {
    showCustomAlertWithMsg(TextStrings.confirmPassword, navigation);
    return;
  }
  //#endregion
}
//#endregion

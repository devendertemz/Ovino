//#region import
import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  ImageBackground,
  KeyboardAvoidingView,
  Alert,
} from "react-native";
import DatePicker from "react-native-date-picker";
import DeviceInfo from "react-native-device-info";

//blockComponent
import PopupHeader from "../../components/blockComponent/PopupHeader";
import MobileNoTextInputWithLabel from "../../components/blockComponent/MobileNoTextInputWithLabel";
import TextInputFieldWithLabel from "../../components/blockComponent/TextInputFieldWithLabel";
import PasswordInputFieldwithLabel from "../../components/blockComponent/PasswordInputFieldwithLabel";
import DobFieldWithLabel from "../../components/blockComponent/DobFieldWithLabel";
//misc
import BtnApp from "../../components/baseComponent/BtnApp";
import { CtryListPopUp } from "../../components/popup/CtryList";
import {
  convertDateToDisplayFormat,
  convertDateToAPIFormat,
} from "../../utils/DateTimeUtil";

//utils
import TextStrings from "../../utils/TextStrings";
import Validation from "../../utils/Validation";
import { ovnioColors } from "../../utils/Variable";
import {
  fonts,
  APP_SCREEN,
  scaleXiPhone15,
  checkForTablet,
} from "../../utils/Variable";
import { showMsgAlert, showCustomAlertWithMsg } from "../../utils/Alert";
import { stylesCommon } from "../../utils/CommonStyle";
//api
import GlobalValue from "../../api/GlobalVar";
import { showAPIError } from "../../api/Config";
import { GetUserTypes, GetCountriesList } from "../../api/GetRequest";
import { PostRegister } from "../../api/PostRequest";
//asset
const plugr_bg_image = require("../../assets/images/plugr-bg-image/plugr-bg-image.png");
//#endregion

//#region Main
export default function Reg({ navigation, route }) {
  //#region useState
  const [loader, setLoader] = useState(false);
  const [deviceId, setDeviceId] = useState(null);
  const [arrUserType, setArrUserType] = useState([]);
  const [userType, setUserType] = useState({});
  const [arrCtry, setCtryData] = useState([]);
  const [userName, setUserName] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phoneNo, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [cpassword, setcPassword] = useState("");
  const [isCtryShow, setCtryPopUp] = useState(false);
  const [isCtry, setCtryFlag] = useState(false);
  const [bday, setBday] = useState(null);
  const [showCalendar, setShowCalendar] = useState(false);
  const [ctry, setCtry] = useState({
    id: 231,
    name: "United States",
    dial_code: "1",
    iso: "US",
    flag: "201802131356342ABN2F155M.png",
  });
  const [dialCode, setDialCode] = useState({
    id: 231,
    name: "United States",
    dial_code: "1",
    iso: "US",
    flag: "201802131356342ABN2F155M.png",
  });
  //#endregion

  //#region api
  //console.log("\u001b[1;33mReg.js : deviceId = ", deviceId);
  useEffect(() => {
    GetUserTypesAPICall(setArrUserType);
    GetCountriesListAPICall(setCtryData);
    const fetchDeviceId = async () => {
      const id = await DeviceInfo.getUniqueId();
      setDeviceId(id);
    };
    fetchDeviceId();
  }, []);
  useEffect(() => {
    if (route.params?.selItem.id) {
      setUserType(route.params?.selItem);
    }
  }, [route.params?.selItem]);
  //#endregion

  //#region action
  const onBackBtnPress = () => {
    navigation.goBack();
  };
  const onRegisterBtnPress = () => {
    /* navigation.navigate(APP_SCREEN.APP_VERIFY_CODE, {
      id: 34,
      otp: 3456,
      email_id: "adi@yopmail.com",
    });
    return; */
    RegisterAPICall(
      userName,
      name,
      email,
      phoneNo,
      bday,
      password,
      cpassword,
      dialCode,
      ctry,
      userType,
      deviceId,
      navigation,
      setLoader
    );
  };
  const onCtryDropClick = () => {
    if (arrCtry.length === 0) {
      showMsgAlert("No country found", "Please check your internet");
    } else {
      setCtryFlag(true);
      setCtryPopUp(true);
    }
  };
  const onDialCodeClick = () => {
    if (arrCtry.length === 0) {
      showMsgAlert("No country found", "Please check your internet");
    } else {
      setCtryFlag(false);
      setCtryPopUp(true);
    }
  };
  const onCtryPopUpClose = (item) => {
    setCtryPopUp(false);
    if (item) {
      isCtry ? setCtry(item) : setDialCode(item);
    }
  };
  const onShowCalenderClick = () => {
    setShowCalendar(true);
  };
  const setDatePickerMaxDate = () => {
    const maxDob = new Date();
    maxDob.setFullYear(maxDob.getFullYear() - 18);
    return maxDob;
  };
  const onShowDropDownClick = () => {
    navigation.navigate(APP_SCREEN.APP_SELECTMODAL, {
      indexFrom: 1,
      title: "Select",
      arrData: arrUserType,
    });
  };
  //#endregion

  //#region JSX
  const SetModalComp = () => {
    return (
      <>
        <CtryListPopUp
          arrCtry={arrCtry}
          status={isCtryShow}
          title={TextStrings.SelectCountry}
          onClose={onCtryPopUpClose}
        />
        <DatePicker
          modal
          open={showCalendar}
          maximumDate={setDatePickerMaxDate()}
          date={setDatePickerMaxDate()}
          mode="date"
          onConfirm={(date) => {
            setShowCalendar(false);
            setBday(date);
          }}
          onCancel={() => {
            setShowCalendar(false);
          }}
        />
      </>
    );
  };
  //#endregion

  return (
    <SafeAreaView style={{ backgroundColor: ovnioColors.background, flex: 1 }}>
      <SetModalComp />
      <ImageBackground
        source={plugr_bg_image} // Replace with your image URL
        style={{ flex: 1 }}
        imageStyle={{ opacity: 0.5 }}
      >
        <KeyboardAvoidingView
          style={styles.bottomView}
          behavior={Platform.OS === "ios" ? "padding" : "height"}
        >
          <PopupHeader title="Sign up to Plugr Loopz" />
          <ScrollView
            style={{
              width: "100%",
            }}
          >
            <TextInputFieldWithLabel
              marginBottom={scaleXiPhone15.tenH}
              placeholder="Enter username"
              value={userName}
              onChangeText={setUserName}
            />
            <TextInputFieldWithLabel
              marginBottom={scaleXiPhone15.tenH}
              placeholder="Enter name"
              value={name}
              onChangeText={setName}
            />
            <MobileNoTextInputWithLabel
              marginBottom={scaleXiPhone15.tenH}
              placeholder="Enter Phone number"
              value={phoneNo}
              onChangeText={setPhone}
              dialCode={dialCode.dial_code}
              onDialCodeSel={onDialCodeClick}
            />
            <TextInputFieldWithLabel
              marginBottom={scaleXiPhone15.tenH}
              placeholder="Enter email"
              value={email}
              onChangeText={setEmail}
            />
            <PasswordInputFieldwithLabel
              marginBottom={scaleXiPhone15.tenH}
              placeholder="Enter Password"
              value={password}
              onChangeText={setPassword}
            />
            <PasswordInputFieldwithLabel
              marginBottom={scaleXiPhone15.tenH}
              placeholder="Enter confirm password"
              value={cpassword}
              onChangeText={setcPassword}
            />
            <DobFieldWithLabel
              marginBottom={scaleXiPhone15.tenH}
              selicon="chevron-down"
              label="Country"
              placeholder="Where do you live currently?"
              value={ctry.name}
              onPress={onCtryDropClick}
            />
            <DobFieldWithLabel
              marginBottom={scaleXiPhone15.tenH}
              label="Enter date of birth"
              placeholder="select date of birth"
              selicon="calendar-month"
              value={bday != null ? convertDateToDisplayFormat(bday) : ""}
              onPress={onShowCalenderClick}
            />
            <DobFieldWithLabel
              marginBottom={scaleXiPhone15.tenH}
              selicon="chevron-down"
              label="Are You a ?"
              placeholder="select "
              value={userType.name}
              onPress={onShowDropDownClick}
            />
            <BtnApp
              isAPICall={loader}
              title="Register"
              marginVertical={scaleXiPhone15.eightH}
              onPress={onRegisterBtnPress}
            />
            <AlreadyMemComp nav={navigation} />
          </ScrollView>
        </KeyboardAvoidingView>
      </ImageBackground>
    </SafeAreaView>
  );
}
const styles = StyleSheet.create({
  innerContainer: {
    paddingHorizontal: checkForTablet()
      ? scaleXiPhone15.fortyW
      : scaleXiPhone15.sixteenW,
    gap: scaleXiPhone15.sixteenH,
    marginVertical: scaleXiPhone15.thrityH,
  },
  bottomView: {
    height: "95%",
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
});
//#endregion

//#region AlreadyMemComp
const AlreadyMemComp = (prop) => {
  const onBackBtnPress = () => {
    prop.nav.goBack();
  };

  return (
    <TouchableOpacity
      style={stylesAlready.signUpContainer}
      onPress={onBackBtnPress}
    >
      <Text style={stylesAlready.signUpText}>
        {TextStrings.alreadyOvinoMember}&nbsp;&nbsp;
        <Text style={stylesAlready.signUpLink}>{TextStrings.signin}.</Text>
      </Text>
    </TouchableOpacity>
  );
};
const stylesAlready = StyleSheet.create({
  signUpContainer: {
    paddingVertical: scaleXiPhone15.sixteenH,
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

//#region API
async function GetCountriesListAPICall(setCtryData) {
  await GetCountriesList()
    .then((res) => {
      console.log(
        "\u001b[1;32mReg.js : Res Ctry count = ",
        JSON.stringify(res.data.data.length)
      );
      setCtryData(res.data.data);
    })
    .catch((error) => {
      showAPIError(error, "Countries Error");
    });
}
async function GetUserTypesAPICall(setArrUserType) {
  await GetUserTypes()
    .then((res) => {
      console.log(
        "\u001b[1;32mReg.js : Res User Types = ",
        JSON.stringify(res.data.data.length)
      );
      setArrUserType(res.data.data);
    })
    .catch((error) => {
      showAPIError(error, "Error | User Types");
    });
}
async function RegisterAPICall(
  userName,
  name,
  email,
  phoneNo,
  bday,
  password,
  cpassword,
  dialCode,
  ctry,
  userType,
  deviceId,
  navigation,
  setLoader
) {
  //#region Validation

  if (userName.trim().length == 0) {
    showCustomAlertWithMsg(TextStrings.alertUserName, navigation);
    return;
  }
  if (name.trim().length == 0) {
    showCustomAlertWithMsg(TextStrings.fullNameMsg, navigation);
    return;
  } else if (Validation.FullNameValidation.test(name.trim()) === false) {
    showCustomAlertWithMsg(TextStrings.validNameMsg, navigation);
    return;
  } else if (!dialCode?.id) {
    showCustomAlertWithMsg(TextStrings.countryCodeMsg, navigation);
    return;
  } else if (phoneNo.trim().length == 0) {
    showCustomAlertWithMsg(TextStrings.phoneNumberMsg, navigation);
    return;
  } else if (Validation.phoneRegex.test(phoneNo.trim()) === false) {
    showCustomAlertWithMsg(TextStrings.validPhoneNumberMsg, navigation);
    return;
  } else if (email.trim().length == 0) {
    showCustomAlertWithMsg(TextStrings.emailMsg, navigation);
    return;
  } else if (Validation.EmailValidation.test(email.trim()) === false) {
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
  } else if ((cpassword.trim() === password.trim()) === false) {
    showCustomAlertWithMsg(TextStrings.alertConfirmPassword, navigation);
    return;
  } else if (!ctry?.id) {
    showCustomAlertWithMsg(TextStrings.countryMsg, navigation);
    return;
  } else if (!bday) {
    showCustomAlertWithMsg("Please select DOB", navigation);
    return;
  } else if (!userType.id) {
    showCustomAlertWithMsg(TextStrings.alertUserType, navigation);
    return;
  }
  const para = {
    username: userName,
    first_name: name,
    dial_code: dialCode.dial_code,
    phone_no: phoneNo,
    country_id: String(ctry.id),
    email_id: email,
    password: password,
    dob: convertDateToAPIFormat(bday),
    user_type: userType.id,
    fcm_id: GlobalValue.fcmToken,
    device_id: deviceId,
    device_type: 1,
    default_language_id: 1,
  };
  //#endregion

  setLoader(true);
  await PostRegister(para)
    .then((res) => {
      setLoader(false);
      console.log("\u001b[1;32mReg.js : Res = ", JSON.stringify(res.data));
      navigation.navigate(APP_SCREEN.APP_VERIFY_CODE, {
        id: res.data.data.id,
        otp: res.data.data.otp,
        email_id: email,
      });
    })
    .catch((error) => {
      setLoader(false);
      showAPIError(error, "Register Error");
    });
}
//#endregion

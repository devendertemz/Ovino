//#region import
import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  Dimensions,
  SafeAreaView,
  ScrollView,
  TextInput,
  View,
  Image,
  FlatList,
  Text,
  TouchableOpacity,
  Platform,
} from "react-native";

//package
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import Feather from "react-native-vector-icons/Feather";
import DatePicker from "react-native-date-picker";
//baseComponent
import { CtryListPopUp } from "../../../components/popup/CtryList";
import CustomLoader from "../../../components/baseComponent/CustomLoader.js";
//blockComponent
import Header from "../../../components/blockComponent/Header";
import { ProfileViewRow } from "../../../components/blockComponent/OvnioCustomRow.js";
//utils
import TextStrings from "../../../utils/TextStrings.js";
import { showCustomAlertWithMsg } from "../../../utils/Alert.js";
import {
  ovnioColors,
  fonts,
  scaleXiPhone15,
  APP_SCREEN,
} from "../../../utils/Variable";
import {
  convertDateToDisplayFormat,
  convertDateToAPIFormat,
  convertUTCDateTimeStampToDate,
} from "../../../utils/DateTimeUtil.js";
//api
import { showAPIError } from "../../../api/Config.js";
import {
  GetUserProfile,
  GetProfilePref,
  PutProfileUpdate,
  GetCountriesList,
} from "../../../api/GetRequest.js";
import GlobalValue from "../../../api/GlobalVar.js";
//#endregion

//#region Main
export default function ProfileEdit({ navigation, route }) {
  const selItem = route.params?.selItem;
  const type = route.params?.type;

  //#region data
  console.log("selItem = ", selItem);
  const arrProfile = [
    { id: 1, title: "First Name", icon: "users", isMatIcon: false },
    { id: 2, title: "Last Name", icon: "users", isMatIcon: false },
    { id: 3, title: "Username", icon: "user", isMatIcon: false },
    {
      id: 4,
      title: "Email",
      icon: "email-outline",
      isMatIcon: true,
    },
    {
      id: 5,
      title: "Birth Date",
      icon: "calendar-today",
      selicon: "calendar-month",
      isMatIcon: true,
    },
    {
      id: 6,
      title: "Country",
      icon: "flag",
      selicon: "keyboard-arrow-down",
      isMatIcon: false,
    },
  ];
  //#endregion

  //#region useState
  const [loader, setLoader] = useState(false);
  const [isCtryShow, setCtryPopUp] = useState(false);
  const [proObj, setProObj] = useState("");
  const [fName, setFName] = useState("");
  const [lName, setLName] = useState("");
  const [userName, setUserName] = useState("");
  const [email, setEmail] = useState("");
  const [bday, setBday] = useState(null);
  const [ctry, setCtry] = useState({});
  const [showCalendar, setShowCalendar] = useState(false);
  const [arrCtry, setArrCtry] = useState([]);

  //#endregion

  //#region api
  useEffect(() => {
    GetUserProfileAPICall(setLoader, setProObj);
    GetCountriesListAPICall(setArrCtry);
  }, []);
  useEffect(() => {
    setFName(proObj.first_name);
    setLName(proObj.last_name);
    setUserName(proObj.username);
    setEmail(proObj.email_id);
    setCtry({ id: proObj.country_id, name: proObj.country_name });
    if (proObj.dob) {
      setBday(new Date(proObj.dob));
    }
  }, [proObj]);
  //#endregion

  //#region action
  const onSelectIconClick = (item) => {
    // console.log("onSelectIconClick = ", item);
    // return;
    if (item.id === 5) {
      setShowCalendar(true);
    } else if (item.id === 6) {
      setCtryPopUp(true);
    } else {
      console.log("Invalid item clic = ", item);
    }
  };
  const setDatePickerMaxDate = () => {
    const maxDob = new Date();
    maxDob.setFullYear(maxDob.getFullYear() - 18);
    return maxDob;
  };
  const onCtryPopUpClose = (item) => {
    console.log("Ctry item = ", item);
    setCtryPopUp(false);
    if (item) {
      setCtry(item);
    }
  };
  const onBackBtnPress = () => {
    navigation.goBack();
  };
  const onSaveBtnPress = () => {
    console.log(JSON.stringify(profileEdit, null, 4));
    const profileEdit = {};

    profileEdit.first_name = fName;
    profileEdit.last_name = lName;
    profileEdit.phone_no = proObj.phone_no;
    profileEdit.dial_code = proObj.dial_code;
    profileEdit.country_id = ctry?.id ? ctry?.id : proObj.country_id; //at sign up sel dial code country is set as country_id
    if (bday) {
      profileEdit.dob = convertDateToAPIFormat(bday);
    }
    console.log(
      "\u001b[1;32mEP.js: profileEdit  = ",
      JSON.stringify(profileEdit, null, 4)
    );

    PutProfileUpdateAPICall(setLoader, profileEdit, setProObj);
  };
  //#endregion

  //#region JSX
  const LoaderComp = () => {
    if (loader) {
      return (
        <CustomLoader
          padding={scaleXiPhone15.sixteenH}
          isSmall={false}
          color={ovnioColors.primaryRed}
        />
      );
    } else {
      return null;
    }
  };
  //#endregion

  return (
    <SafeAreaView flex={1} backgroundColor={ovnioColors.background}>
      <Header
        title="Profile"
        actionText={"SAVE"}
        onBackBtnPress={onBackBtnPress}
        onActionBtnPress={onSaveBtnPress}
      />
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
          setBday(date);
          setShowCalendar(false);
        }}
        onCancel={() => {
          setShowCalendar(false);
        }}
      />
      <ScrollView style={{ padding: 16 }}>
        <LoaderComp />
        <ProfileEditInputComp
          item={arrProfile[0]}
          value={fName}
          setValue={setFName}
          isEditable={true}
        />
        <ProfileEditInputComp
          item={arrProfile[1]}
          value={lName}
          setValue={setLName}
          isEditable={true}
        />
        <ProfileEditInputComp
          item={arrProfile[2]}
          value={userName}
          setValue={setUserName}
          isEditable={false}
        />
        <ProfileEditInputComp
          item={arrProfile[3]}
          value={email}
          setValue={setEmail}
          isEditable={false}
        />
        <ProfileEditSelComp
          item={arrProfile[4]}
          value={bday ? convertDateToDisplayFormat(bday) : ""}
          setValue={setBday}
          onSelectIconCLick={onSelectIconClick}
        />

        <ProfileEditSelComp
          item={arrProfile[5]}
          value={ctry.name}
          setValue={setCtry}
          onSelectIconCLick={onSelectIconClick}
        />
      </ScrollView>
    </SafeAreaView>
  );
}
//#endregion

//#region ProfileEditInputComp
const ProfileEditInputComp = (props) => {
  const item = props.item;
  return (
    <View style={stylesPEI.container}>
      <View style={stylesPEI.containerIcon}>
        {!item.isMatIcon ? (
          <Feather
            name={item.icon}
            size={28}
            color={ovnioColors.grayIconColor}
          />
        ) : (
          <MaterialCommunityIcons
            name={item.icon}
            size={28}
            color={ovnioColors.grayIconColor}
          />
        )}
      </View>
      <View style={stylesPEI.containerTxt}>
        <Text style={stylesPEI.txtTitle}>{props.item.title}</Text>
        <TextInput
          editable={props.isEditable}
          style={stylesPEI.txtValue}
          placeholder={props.item.title}
          placeholderTextColor={ovnioColors.grayRemoteBg}
          maxLength={50}
          keyboardType={"default"}
          onChangeText={props.setValue}
          value={props.value}
        />
      </View>
    </View>
  );
};
const stylesPEI = StyleSheet.create({
  container: {
    flexDirection: "row",
    gap: 16,
    paddingHorizontal: 16,
    paddingVertical: 10,
    marginVertical: 4,
    alignItems: "center",

    //border
    borderRadius: 8,
    borderColor: ovnioColors.grayRemoteBg,
    borderWidth: 2,
  },
  containerIcon: {
    flex: 0.1,
    alignItems: "center",
    justifyContent: "center",
    //backgroundColor: "pink",
  },
  containerTxt: {
    flex: 0.9,
    gap: 0,
    //backgroundColor: "yellow",
  },
  txtTitle: {
    fontSize: 16,
    fontFamily: fonts.regular,
    color: ovnioColors.grayIconColor,
  },
  txtValue: {
    paddingVertical: 5,
    height: 30,
    fontSize: 16,
    fontFamily: fonts.bold,
    color: ovnioColors.grayDesc,
    //backgroundColor: "green",
  },
});
//#endregion

//#region ProfileEditSelComp
const ProfileEditSelComp = (props) => {
  const item = props.item;
  return (
    <View style={stylesPES.container}>
      <View style={stylesPES.containerIcon}>
        {!item.isMatIcon ? (
          <Feather
            name={item.icon}
            size={28}
            color={ovnioColors.grayIconColor}
          />
        ) : (
          <MaterialCommunityIcons
            name={item.icon}
            size={28}
            color={ovnioColors.grayIconColor}
          />
        )}
      </View>
      <View style={stylesPES.containerTxt}>
        <Text style={stylesPES.txtTitle}>{item.title}</Text>
        <Text style={stylesPES.txtValue}>{props.value}</Text>
      </View>
      <TouchableOpacity
        style={stylesPES.containerIcon}
        onPress={() => props.onSelectIconCLick(item)}
      >
        <MaterialIcons
          name={item.selicon}
          size={28}
          color={ovnioColors.grayIconColor}
        />
      </TouchableOpacity>
    </View>
  );
};
const stylesPES = StyleSheet.create({
  container: {
    flexDirection: "row",
    gap: 16,
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginVertical: 4,
    alignItems: "center",

    //border
    borderRadius: 8,
    borderColor: ovnioColors.grayRemoteBg,
    borderWidth: 2,
  },
  containerIcon: {
    flex: 0.1,
    alignItems: "center",
    justifyContent: "center",
    //backgroundColor: "pink",
  },
  containerTxt: {
    flex: 0.9,
    gap: 8,
    //backgroundColor: "yellow",
  },
  txtTitle: {
    fontSize: 16,
    fontFamily: fonts.regular,
    color: ovnioColors.grayIconColor,
  },
  txtValue: {
    fontSize: 16,
    fontFamily: fonts.bold,
    color: ovnioColors.grayDesc,
  },
});
//#endregion

//#region API
async function GetUserProfileAPICall(setLoader, setProObj) {
  await GetUserProfile()
    .then((res) => {
      setLoader(false);
      const user = res.data.user;
      console.log("\u001b[1;32mEP.js: RES  = ", JSON.stringify(user, null, 4));
      setProObj(user);
    })
    .catch((error) => {
      setLoader(false);
      showAPIError(error, "Error | Get User Profile");
    });
}
async function GetCountriesListAPICall(setArrCtry) {
  await GetCountriesList()
    .then((res) => {
      console.log(
        "\u001b[1;32mPE.js : Res Ctry count = ",
        JSON.stringify(res.data.data)
      );
      setArrCtry(res.data.data);
    })
    .catch((error) => {
      showAPIError(error, "Countries Error");
    });
}
async function PutProfileUpdateAPICall(setLoader, bodyData, setProObj) {
  setLoader(true);
  await PutProfileUpdate(bodyData)
    .then((res) => {
      setLoader(false);
      console.log(
        "\u001b[1;32mEP.js: RES  = ",
        JSON.stringify(res.data, null, 4)
      );
      const user = res.data.data;
      setProObj(user);
    })
    .catch((error) => {
      setLoader(false);
      showAPIError(error, "Error | Update Profile");
    });
}

//#endregion

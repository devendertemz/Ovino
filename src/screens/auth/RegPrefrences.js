//#region import
import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  SafeAreaView,
  ImageBackground,
} from "react-native";
//blockComponent
import Header from "../../components/blockComponent/Header";
import PopupHeader from "../../components/blockComponent/PopupHeader";
import DobFieldWithLabel from "../../components/blockComponent/DobFieldWithLabel";
//misc
import BtnApp from "../../components/baseComponent/BtnApp";
//utils
import TextStrings from "../../utils/TextStrings";
import { ovnioColors } from "../../utils/Variable";
import { fonts, scaleXiPhone15, APP_SCREEN } from "../../utils/Variable";
import { stylesCommon } from "../../utils/CommonStyle";
import { showCustomAlertWithMsg } from "../../utils/Alert";
//api
import { SaveUserData, GetUserProfileAPICall } from "../../api/GlobalAPICall";
import { GetProfilePref, GetPrefList } from "../../api/GetRequest";
import { PostPreferencesUpdate } from "../../api/PostRequest";
import { showAPIError } from "../../api/Config";
//asset
const plugr_bg_image = require("../../assets/images/plugr-bg-image/plugr-bg-image.png");
//#endregion

//#region Main
export default function RegPrefrences({ navigation, route }) {
  //From - Login.js | VerfiyCode.js | SelectModal.js
  const { user } = route.params;
  console.log("user  = ", user);

  //#region useState
  const [loader, setLoader] = useState(false);
  const [arrData, setArrData] = useState([]);
  const [arrSel, setArrSel] = useState([]);
  //#endregion

  //#region api
  useEffect(() => {
    GetUserProfilePrefAPICall(setLoader, setArrData, setArrSel);
  }, []);
  useEffect(() => {
    if (route.params?.arrSelTmp) {
      const { arrSelTmp, type } = route.params;
      if (arrSel[type].is_multiple) {
        const arrTmp = [...arrSel];
        arrTmp[type].arrSelO = arrSelTmp;
        setArrSel(arrTmp);
      }
    } else {
      console.log("useEffect[route.params?.arrSelTmp]");
    }
  }, [route.params?.arrSelTmp]);
  useEffect(() => {
    if (route.params?.selItem?.id) {
      const { selItem, type } = route.params;
      if (!arrSel[type].is_multiple) {
        const arrTmp = [...arrSel];
        arrTmp[type].selItem = selItem;
        setArrSel(arrTmp);
      }
    } else {
      console.log("useEffect[route.params?.selItem]");
    }
  }, [route.params?.selItem]);
  //#endregion

  //#region action
  const onNextBtnPress = () => {
    if (user?.id) {
      const arrTmpId = [];
      for (item of arrSel) {
        if (item.is_required) {
          if (item.is_multiple) {
            if (item?.arrSelO && item?.arrSelO.length > 0) {
              item?.arrSelO.forEach((item) => {
                arrTmpId.push(item.id);
              });
            } else {
              showCustomAlertWithMsg(
                "Please select mandatory prefrences",
                navigation
              );
              return;
            }
          } else {
            if (item.selItem) {
              arrTmpId.push(item.selItem.id);
            } else {
              showCustomAlertWithMsg(
                "Please select mandatory prefrences",
                navigation
              );
              return;
            }
          }
        } else {
          if (item.is_multiple) {
            if (item?.arrSelO && item?.arrSelO.length > 0) {
              item?.arrSelO.forEach((item) => {
                arrTmpId.push(item.id);
              });
            }
          } else {
            if (item.selItem) {
              arrTmpId.push(item.selItem.id);
            }
          }
        }
      }

      RegPrefrencesAPICall(arrTmpId.join(), user, navigation, setLoader);
    } else {
      showCustomAlertWithMsg(
        "Something went wrong \n User info not availble !",
        navigation
      );
    }
  };
  const onShowDropDownClick = (item, key) => {
    const { name, options } = item;
    const selItem = arrSel[key];
    console.log("selItem  = ", selItem);
    /* console.log("onShowDropDownClick selItem = ", JSON.stringify(selItem));
    console.log("onShowDropDownClick name = ", name);
    return; */

    if (selItem.is_multiple) {
      navigation.navigate("MutipleSelect", {
        type: key,
        indexFrom: 1,
        title: name,
        arrData: options,
      });
    } else {
      navigation.navigate(APP_SCREEN.APP_SELECTMODAL, {
        type: key,
        indexFrom: 2,
        title: name,
        arrData: options,
      });
    }

    return;
    setCtryPopUp(true);
  };
  const onBackBtnPress = () => {
    navigation.goBack();
  };

  //#endregion

  //#region JSX
  const setFieldTitle = (item) => {
    return item.is_required ? item.name + " " + "*" : item.name;
  };
  const setOptionTitle = (index) => {
    const item = arrSel[index];
    if (item?.is_multiple) {
      if (item?.arrSelO && item?.arrSelO.length > 0) {
        let selMuti = "";
        item?.arrSelO.forEach((item) => {
          selMuti += item.name + " | ";
        });
        return selMuti;
      } else {
        return item.name;
      }
    } else {
      if (item.selItem?.id) {
        return item.selItem?.name;
      } else {
        return item.name;
      }
    }
  };
  //#endregion

  return (
    <SafeAreaView style={{ backgroundColor: ovnioColors.background, flex: 1 }}>
      <ImageBackground
        source={plugr_bg_image} // Replace with your image URL
        style={{ flex: 1 }}
        imageStyle={{ opacity: 0.5 }}
      >
        <View style={styles.bottomView}>
          <ScrollView
            style={{
              width: "100%",
            }}
          >
            <View
              style={{
                gap: scaleXiPhone15.twelveH,
              }}
            >
              <PopupHeader title="Preferences" />
              <Text style={styles.signUpText}>
                {"Please choose your Preferences from below option."}
              </Text>
              {arrData.map((prop, key) => {
                return (
                  <DobFieldWithLabel
                    key={key}
                    selicon="chevron-down"
                    label={setFieldTitle(prop)}
                    placeholder={`Select ${prop.name}`}
                    value={setOptionTitle(key)}
                    onPress={() => onShowDropDownClick(prop, key)}
                  />
                );
              })}
              <BtnApp
                isAPICall={loader}
                title="Next"
                marginVertical={scaleXiPhone15.eightH}
                onPress={onNextBtnPress}
              />
            </View>
          </ScrollView>
        </View>
      </ImageBackground>
    </SafeAreaView>
  );
}
const styles = StyleSheet.create({
  bottomView: {
    height: "85%",
    alignItems: "center", // Center text in bottom view
    padding: scaleXiPhone15.twentyH,
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    borderTopLeftRadius: scaleXiPhone15.fortyH,
    borderTopRightRadius: scaleXiPhone15.fortyH,
    backgroundColor: ovnioColors.background,
  },
  signUpText: {
    ...stylesCommon.txtBtn,
    fontSize: scaleXiPhone15.fouteenH,
  },
});
//#endregion

//#region API
async function GetUserProfilePrefAPICall(setLoader, setArrData, setArrSel) {
  setLoader(true);
  await GetPrefList()
    .then((res) => {
      setLoader(false);
      console.log(
        "\u001b[1;32mRP.js: RES  = ",
        JSON.stringify(res.data.length, null, 4)
      );
      const arrSel = [];
      for (let i = 0; i < res.data.length; i++) {
        const { id, name, is_required, is_multiple } = res.data[i];
        const tmp = {
          id: id,
          name: name,
          is_required: is_required,
          is_multiple: is_multiple,
        };
        arrSel.push(tmp);
      }
      setArrSel(arrSel);
      setArrData(res.data);
    })
    .catch((error) => {
      setLoader(false);
      showAPIError(error, "Error | Get Pref");
    });
}
async function GetProfilePrefAPICall(setLoader, setArrData) {
  setLoader(true);
  await GetProfilePref()
    .then((res) => {
      setLoader(false);
      console.log(
        "\u001b[1;32mRP.js: RES  = ",
        JSON.stringify(res.data.length, null, 4)
      );

      const prefData = res.data;
      //gender
      const arrGender = prefData.filter(
        (item) => item.title.toLowerCase() == "gender"
      );
      setArrGender(arrGender[0].data);
      //ethnicity
      const arrEth = prefData.filter(
        (item) => item.title.toLowerCase() == "ethnicity"
      );
      setArrEthnicity(arrEth[0].data);
      //Orientation
      const arrOrientation = prefData.filter(
        (item) => item.title.toLowerCase() == "sexual preference"
      );
      setArrOrientation(arrOrientation[0].data);
      //smoker
      const arrSmoker = prefData.filter(
        (item) => item.title.toLowerCase() == "smoker"
      );
      setArrSmoke(arrSmoker[0].data);
      //drink
      const arrDrink = prefData.filter(
        (item) => item.title.toLowerCase() == "favorite drink"
      );
      setArrDrink(arrDrink[0].data);
    })
    .catch((error) => {
      setLoader(false);
      showAPIError(error, "Error | Get Pref");
    });
}
async function RegPrefrencesAPICall(body, user, navigation, setLoader) {
  setLoader(true);
  await PostPreferencesUpdate({ preferences_ids: body })
    .then((res) => {
      setLoader(false);
      console.log(
        "\u001b[1;32mRP.js : ResPrefrance = ",
        JSON.stringify(res.data)
      );
      SaveUserData(user);
      GetUserProfileAPICall();
      navigation.navigate(APP_SCREEN.APP_SPLASH_OPTION);
    })
    .catch((error) => {
      setLoader(false);
      showAPIError(error, "Set Prefreance Error");
    });
}
//#endregion

//#region import
import React, { useEffect, useState } from "react";
import { SafeAreaView, View, ScrollView } from "react-native";
//baseComponent
import CustomLoader from "../../../components/baseComponent/CustomLoader.js";
import BtnApp from "../../../components/baseComponent/BtnApp.js";
//blockComponent
import Header from "../../../components/blockComponent/Header";
import DobFieldWithLabel from "../../../components/blockComponent/DobFieldWithLabel.js";
//utils
import { ovnioColors, fonts, scaleXiPhone15 } from "../../../utils/Variable";
import { convertToCustomFormat } from "../../../utils/DateTimeUtil.js";
import { convertDateToDisplayFormat } from "../../../utils/DateTimeUtil.js";
import { APP_SCREEN } from "../../../utils/Variable";
import { showCustomAlertWithMsg } from "../../../utils/Alert.js";

//api
import {
  GetUserProfile,
  GetPrefList,
  GetUserPref,
} from "../../../api/GetRequest.js";
import { PostPreferencesUpdate } from "../../../api/PostRequest.js";
import { showAPIError } from "../../../api/Config.js";
//#endregion

//#region Main
export default function PrefView({ navigation, route }) {
  //#region useState
  const [loader, setLoader] = useState(false);
  const [arrData, setArrData] = useState([]);
  const [arrSel, setArrSel] = useState([]);
  //#endregion

  //#region api
  useEffect(() => {
    function callBackAPICall(arrTmp) {
      GetSelPrefAPICall(setLoader, arrTmp, setArrSel, setArrData);
    }
    GetUserProfilePrefAPICall(setLoader, callBackAPICall);
  }, []);
  useEffect(() => {
    if (route.params?.arrSelTmp) {
      const { arrSelTmp, type } = route.params;
      if (arrSel[type].is_multiple) {
        const arrTmp = [...arrSel];
        arrTmp[type].arrSelPref = arrSelTmp;
        setArrSel(arrTmp);
      }
    } else {
      console.log("ELSE useEffect[route.params?.arrSelTmp]");
    }
  }, [route.params?.arrSelTmp]);
  useEffect(() => {
    if (route.params?.selItem?.id) {
      const { selItem, type } = route.params;
      if (!arrSel[type].is_multiple) {
        const arrTmp = [...arrSel];
        arrTmp[type].selPref = selItem;
        setArrSel(arrTmp);
      }
    } else {
      console.log("ELSE useEffect[route.params?.selItem]");
    }
  }, [route.params?.selItem]);
  //#endregion

  //#region action
  const onBackBtnPress = () => {
    navigation.goBack();
  };
  const onShowDropDownClick = (item, key) => {
    const { name, options } = item;
    const selItem = arrSel[key];
    console.log("selItem  = ", selItem);
    if (selItem.is_multiple) {
      navigation.navigate("MutipleSelect", {
        type: key,
        indexFrom: 2,
        title: name,
        arrData: options,
      });
    } else {
      navigation.navigate(APP_SCREEN.APP_SELECTMODAL, {
        type: key,
        title: name,
        arrData: options,
        indexFrom: 3,
      });
    }
  };
  const onNextBtnPress = () => {
    const arrTmpId = [];
    for (item of arrSel) {
      if (item.is_required) {
        if (item.is_multiple) {
          if (item?.arrSelPref && item?.arrSelPref.length > 0) {
            item?.arrSelPref.forEach((item) => {
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
          if (item.selPref) {
            arrTmpId.push(item.selPref.id);
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
          if (item?.arrSelPref && item?.arrSelPref.length > 0) {
            item?.arrSelPref.forEach((item) => {
              arrTmpId.push(item.id);
            });
          }
        } else {
          if (item.selPref) {
            arrTmpId.push(item.selPref.id);
          }
        }
      }
    }
    RegPrefrencesAPICall(arrTmpId.join(), navigation, setLoader);
  };
  //#endregion

  //#region JSX
  const setFieldTitle = (item) => {
    return item.is_required ? item.name + " " + "*" : item.name;
  };
  const setOptionTitle = (index) => {
    const item = arrSel[index];
    if (item?.is_multiple) {
      if (item?.arrSelPref && item?.arrSelPref.length > 0) {
        let selMuti = "";
        item?.arrSelPref.forEach((item) => {
          selMuti += item.name + " | ";
        });
        return selMuti;
      } else {
        return item.name;
      }
    } else {
      if (item.selPref?.id) {
        return item.selPref?.name;
      } else {
        return item.name;
      }
    }

    return `Select + ${index}`;
  };
  //#endregion

  return (
    <SafeAreaView flex={1} backgroundColor={ovnioColors.background}>
      <Header title="Prefrences" onBackBtnPress={onBackBtnPress} />
      <ScrollView
        style={{
          width: "100%",
          padding: scaleXiPhone15.sixteenH,
        }}
      >
        <View
          style={{
            gap: scaleXiPhone15.twelveH,
            paddingBottom: scaleXiPhone15.sixteenH,
          }}
        >
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
            title="Update"
            marginVertical={scaleXiPhone15.eightH}
            onPress={onNextBtnPress}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
//#endregion

//#region Api
async function GetUserProfilePrefAPICall(setLoader, callBackAPICall) {
  setLoader(true);
  await GetPrefList()
    .then((res) => {
      setLoader(false);
      console.log(
        "\u001b[1;32mRP.js: RES all pref  = ",
        JSON.stringify(res.data.length, null, 4)
      );

      callBackAPICall(res.data);
    })
    .catch((error) => {
      setLoader(false);
      showAPIError(error, "Error | Get All Pref");
    });
}
async function GetSelPrefAPICall(setLoader, arrData, setArrSel, setArrData) {
  setLoader(true);
  await GetUserPref()
    .then((res) => {
      setLoader(false);
      console.log(
        "\u001b[1;32mPV.js: user pref = ",
        JSON.stringify(res.data.length, null, 4)
      );
      const arrSel = [];
      for (let i = 0; i < arrData.length; i++) {
        const { id, name, is_required, is_multiple } = arrData[i];
        const arrTmp = res.data.filter(
          (itemTmp) => Number(itemTmp.preferences_type_id) === Number(id)
        );
        const tmp = {
          id: id,
          name: name,
          is_required: is_required,
          is_multiple: is_multiple,
        };
        if (arrTmp.length === 0) {
          arrSel.push(tmp);
          continue;
        }
        if (is_multiple) {
          const arrMod = arrTmp.map(function (itemTmp) {
            return {
              id: itemTmp.preferences_id,
              name: itemTmp.preference_value_name,
            };
          });
          tmp.arrSelPref = arrMod;
        } else {
          const arrMod = arrTmp.map(function (itemTmp) {
            return {
              id: itemTmp.preferences_id,
              name: itemTmp.preference_value_name,
            };
          });
          tmp.selPref = arrMod[0];
        }
        arrSel.push(tmp);
      }
      setArrSel(arrSel);
      setArrData(arrData);
      //console.log("arrSel = ", JSON.stringify(arrSel));
    })
    .catch((error) => {
      setLoader(false);
      showAPIError(error, "Error | Get User Prefrences");
    });
}
async function RegPrefrencesAPICall(body, navigation, setLoader) {
  setLoader(true);
  await PostPreferencesUpdate({ preferences_ids: body })
    .then((res) => {
      setLoader(false);
      console.log(
        "\u001b[1;32mPV.js : ResPrefrance = ",
        JSON.stringify(res.data)
      );
      navigation.goBack();
    })
    .catch((error) => {
      setLoader(false);
      showAPIError(error, "Update Prefreance Error");
    });
}
//#endregion

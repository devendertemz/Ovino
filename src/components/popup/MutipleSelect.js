//#region import
import React, { useState } from "react";
import {
  View,
  Text,
  Dimensions,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  FlatList,
  Image,
} from "react-native";
const { height, width } = Dimensions.get("window");

import { showCustomAlertWithMsg } from "../../utils/Alert";

//utils
import {
  APP_SCREEN,
  fonts,
  ovnioColors,
  scaleXiPhone15,
} from "../../utils/Variable";
//asset
const check = require("../../assets/icon/check/check.png");
const uncheck = require("../../assets/icon/uncheck/uncheck.png");
//#endregion

//#region Main
export default function MutipleSelect({ navigation, route }) {
  const { arrData, indexFrom, title, type } = route.params;
  //indexFrom 1 : RegPrefrences.js
  //indexFrom 2 : PrefView.js

  //#region useState
  const [arrSel, setArrSel] = useState([]);
  //#endregion

  //#region btn action
  const onItemClicked = (item) => {
    console.log("onItemClicked item = ", JSON.stringify(item, null, 4));
    if (arrSel.some((itemTmp) => Number(itemTmp.id) === Number(item.id))) {
      const arrUpdate = arrSel.filter(
        (itemTmp) => Number(itemTmp.id) !== Number(item.id)
      );
      setArrSel(arrUpdate);
    } else {
      setArrSel((prevData) => [...prevData, item]);
    }
  };
  const onCancelClicked = () => {
    navigation.goBack();
  };
  const onDoneClicked = () => {
    if (arrSel.length === 0) {
      showCustomAlertWithMsg("Please select atleast one option", navigation);
      return;
    }

    if (indexFrom === 1) {
      navigation.navigate({
        name: APP_SCREEN.APP_REG_PREF,
        merge: true,
        params: {
          arrSelTmp: arrSel,
          type: type,
        },
      });
    } else if (indexFrom === 2) {
      navigation.navigate("WatchAppStack", {
        screen: "PrefView",
        merge: true,
        params: {
          arrSelTmp: arrSel,
          type: type,
        },
      });
    } else {
      console.log("MutipleSelect.js | Invalid indexFrom = ", indexFrom);
    }
  };
  //#endregion

  const renderFlatListRow = ({ item }) => {
    const isSel = arrSel.some(
      (itemTmp) => Number(itemTmp.id) === Number(item.id)
    );
    return <MutilSelectRow isSel={isSel} item={item} onPress={onItemClicked} />;
  };
  return (
    <SafeAreaView flex={1}>
      <View style={styles.container}>
        <View style={styles.centeredView}>
          <HeaderComp
            title={title}
            onCancelClicked={onCancelClicked}
            onDoneClicked={onDoneClicked}
          />
          <FlatList
            backgroundColor={ovnioColors.background}
            data={arrData}
            renderItem={renderFlatListRow}
            ItemSeparatorComponent={() => <View style={{ height: 1 }} />}
          />
        </View>
      </View>
    </SafeAreaView>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "flex-end",
  },
  centeredView: {
    maxHeight: "70%",
    width: "100%",
    backgroundColor: "white",
  },
});
//#endregion

//#region HeaderComp
const HeaderComp = ({ title, onCancelClicked, onDoneClicked }) => {
  return (
    <View style={stylesH.container}>
      <Text style={stylesH.txtBtn} onPress={onCancelClicked}>
        Cancel
      </Text>
      <Text style={stylesH.txtTitle}>{title}</Text>
      <Text style={stylesH.txtBtn} onPress={onDoneClicked}>
        Done
      </Text>
    </View>
  );
};
const stylesH = StyleSheet.create({
  container: {
    paddingVertical: scaleXiPhone15.twelveH,
    paddingHorizontal: scaleXiPhone15.twelveH,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: ovnioColors.primaryRed,
  },
  txtBtn: {
    textAlign: "center",
    fontSize: scaleXiPhone15.sixteenH,
    fontFamily: fonts.black,
    color: ovnioColors.white,
    //backgroundColor: "green",
  },
  txtTitle: {
    textAlign: "center",
    fontSize: scaleXiPhone15.eightteenH,
    fontFamily: fonts.medium,
    color: ovnioColors.white,
    //backgroundColor: "green",
  },
});
//#endregion

//#region MutilSelectRow
const MutilSelectRow = ({ item, isSel, onPress }) => {
  return (
    <TouchableOpacity style={stylesS.container} onPress={() => onPress(item)}>
      <Text style={stylesS.txtTitle}>{item.name}</Text>
      <Image style={stylesS.imgIcon} source={isSel ? check : uncheck} />
    </TouchableOpacity>
  );
};
const stylesS = StyleSheet.create({
  container: {
    paddingHorizontal: scaleXiPhone15.sixteenH,
    paddingVertical: scaleXiPhone15.twelveH,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: ovnioColors.blackContainerBg,
  },
  imgIcon: {
    width: scaleXiPhone15.twentyH,
    height: scaleXiPhone15.twentyH,
  },
  txtTitle: {
    fontSize: scaleXiPhone15.sixteenH,
    fontFamily: fonts.bold,
    color: ovnioColors.grayDesc,
    //backgroundColor: "yellow",
  },
});
//#endregion

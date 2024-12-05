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

//package
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import FontAwesome from "react-native-vector-icons/FontAwesome";

//utils
import { APP_SCREEN, appSize, fonts, ovnioColors } from "../../utils/Variable";
//#endregion

//#region SelectModal : Reg.js | ProfileEdit.js
export default function SelectModal({ navigation, route }) {
  //indexFrom 1 : Reg.js | for user selection
  //indexFrom 2 : RegPrefrences.js
  //indexFrom 3 : PrefView.js

  const { arrData, title, type, indexFrom } = route.params;

  const onItemClicked = (item) => {
    if (indexFrom === 1) {
      //Reg.js
      navigation.navigate("Reg", { selItem: item });
    } else if (indexFrom === 2) {
      //RegPrefrences.js
      navigation.navigate({
        name: APP_SCREEN.APP_REG_PREF,
        merge: true,
        params: {
          selItem: item,
          type: type,
        },
      });
    } else if (indexFrom === 3) {
      //PrefView.js
      navigation.navigate("WatchAppStack", {
        screen: "PrefView",
        merge: true,
        params: {
          selItem: item,
          type: type,
        },
      });
    } else {
      console.log("SelectModal.js | Invalid indexFrom = ", indexFrom);
    }
  };
  const renderFlatListRow = ({ item }) => {
    return <SelectRow item={item} onPress={onItemClicked} />;
  };
  return (
    <SafeAreaView flex={1}>
      <View style={styles.container}>
        <View style={styles.centeredView}>
          <HeaderComp title={title} navigation={navigation} />
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
const HeaderComp = (prop) => {
  return (
    <View style={stylesH.container}>
      <View style={{ flex: 0.1 }} />
      <Text style={stylesH.txtTitle}>{prop.title}</Text>
      <TouchableOpacity
        style={{ flex: 0.1 }}
        onPress={() => prop.navigation.goBack()}
      >
        <MaterialCommunityIcons
          name={"close-circle-outline"}
          size={32}
          color={ovnioColors.white}
        />
      </TouchableOpacity>
    </View>
  );
};
const stylesH = StyleSheet.create({
  container: {
    padding: 8,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: ovnioColors.primaryRed,
  },
  txtTitle: {
    flex: 0.8,
    textAlign: "center",
    fontSize: 18,
    fontFamily: fonts.medium,
    color: ovnioColors.white,
    //backgroundColor: "green",
  },
});
//#endregion

//#region SelectRow
const SelectRow = ({ item, onPress }) => {
  return (
    <TouchableOpacity style={stylesS.container} onPress={() => onPress(item)}>
      <Text style={stylesS.txtTitle}>{item.name}</Text>
    </TouchableOpacity>
  );
};
const stylesS = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: ovnioColors.blackContainerBg,
  },
  txtTitle: {
    fontSize: 16,
    fontFamily: fonts.bold,
    color: ovnioColors.grayDesc,
  },
});
//#endregion

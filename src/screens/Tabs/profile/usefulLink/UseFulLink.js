//#region import
import React, { useState } from "react";
import {
  StyleSheet,
  Dimensions,
  SafeAreaView,
  View,
  Image,
  FlatList,
  Text,
  Alert,
  TouchableOpacity,
} from "react-native";
const { height } = Dimensions.get("window");
import { useNavigation } from "@react-navigation/native";
//package
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import Feather from "react-native-vector-icons/Feather";
//component
import Header from "../../../../components/blockComponent/Header";
//utils
import {
  ovnioColors,
  fonts,
  appSize,
  scaleXiPhone15,
} from "../../../../utils/Variable";
//#endregion

//#region Main
export default function UseFulLink({ navigation }) {
  const arrData = [
    { id: 1, title: "About Plugr" },
    { id: 2, title: "Plugr Influencer Academy" },
    { id: 3, title: "Contact" },
    { id: 4, title: "Subscription Agreement " },
    { id: 5, title: "Privacy Policy" },
    { id: 6, title: "Plugr Shop Privacy Policy" },
    { id: 7, title: "California Privacy Policy" },
    { id: 8, title: "Ab Do Not Sell or Share My Personal Info out" },
    { id: 9, title: "Your US State Privacy Rights  " },
    { id: 10, title: "Channels " },
    { id: 11, title: "Jobs" },
    { id: 12, title: "Plans & Pricing" },
    { id: 13, title: "Account & Billing" },
    { id: 14, title: "Supported Devices" },
    { id: 15, title: "Advertise on Plugr" },
    { id: 16, title: "Advertising Guidelines" },
    { id: 17, title: "Community Guidelines" },
    { id: 18, title: "Sign Up for PLUGR" },
    { id: 19, title: "Plugr Affiliate Program" },
    { id: 20, title: "Guides: What to Watch (Plugr Popular Channels)" },
    { id: 21, title: "TV Channels" },
    { id: 22, title: "Help Center & FAQ" },
    { id: 23, title: "Cookie Policy" },
    { id: 24, title: "Security Policy" },
    { id: 25, title: "Intellectual Property Policy" },
    { id: 26, title: "Plugr Law Enforcement Guidelines" },
    { id: 27, title: "Open Source Software Notices" },
    { id: 28, title: "Plugr Influencer Affiliate Program" },
  ];

  //action
  const onBackBtnPress = () => {
    navigation.goBack();
  };
  const onFlatListRowClick = (item) => {
    console.log("onFlatListRowClick:-" + JSON.stringify(item));
    navigation.navigate("WebPage", {
      item: item,
    });
  };
  //flatlist
  const renderFlatListRow = ({ item }) => {
    return <ProfileRow item={item} onFlatListRowClick={onFlatListRowClick} />;
  };

  return (
    <SafeAreaView flex={1} backgroundColor={ovnioColors.background}>
      <Header title={"Useful Links"} onBackBtnPress={onBackBtnPress} />
      <FlatList
        style={{ padding: scaleXiPhone15.sixteenW }}
        data={arrData}
        renderItem={renderFlatListRow}
        ListFooterComponent={() => (
          <View style={{ height: scaleXiPhone15.fortyH }} />
        )}
      />
    </SafeAreaView>
  );
}
//#endregion

//#region ProfileRow
const ProfileRow = (prop) => {
  return (
    <TouchableOpacity
      style={stylesPR.container}
      onPress={() => prop.onFlatListRowClick(prop.item)}
    >
      <Text style={stylesPR.txtTitle}>{prop.item.title}</Text>
    </TouchableOpacity>
  );
};
const stylesPR = StyleSheet.create({
  container: {
    marginTop: scaleXiPhone15.tenH,
    paddingHorizontal: scaleXiPhone15.twelveH,
    paddingVertical: scaleXiPhone15.fouteenH,
    flexDirection: "row",
    alignItems: "center",
    borderRadius: scaleXiPhone15.fourH,
    backgroundColor: "#2A2D34",
    justifyContent: "space-between",
  },
  txtTitle: {
    fontFamily: fonts.regular,
    fontSize: scaleXiPhone15.eightteenH,
    color: ovnioColors.white,
  },
});
//#endregion

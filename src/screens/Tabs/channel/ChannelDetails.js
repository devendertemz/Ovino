//#region import
import React, { useState } from "react";
import {
  StyleSheet,
  Dimensions,
  SafeAreaView,
  View,
  ImageBackground,
  Image,
  FlatList,
  ScrollView,
  Text,
  TouchableOpacity,
  Switch,
} from "react-native";
const height = Dimensions.get("window").height;
const width = Dimensions.get("window").width;
import Ionicons from "react-native-vector-icons/Ionicons";
//blockComponent
import { TVShowRowComp } from "../../../components/blockComponent/OvinoGridCell";
import HeaderRightIcon from "../../../components/blockComponent/HeaderRightIcon";
import { ChannelGuideRow } from "../../../components/blockComponent/OvnioCustomRow";
//utils
import { ovnioColors, scaleXiPhone15, fonts } from "../../../utils/Variable";
import { stylesCommon } from "../../../utils/CommonStyle";
import GlobalValue from "../../../api/GlobalVar";
//#endregion

//#region Main
export default function ChannelDetails({ navigation, route }) {
  GlobalValue.crtChannel = route.params?.ChannelDetails;
  console.log(
    "\u001b[1;31mCD.js : crtChannel  = ",
    JSON.stringify(GlobalValue.crtChannel)
  );
  const [showDesc, setShowDesc] = useState(false);
  const onBackBtnPress = () => {
    navigation.goBack();
  };

  return (
    <SafeAreaView flex={1} backgroundColor={ovnioColors.background}>
      <ScrollView>
        <HeaderRightIcon
          iconRightTwo={"share-social"}
          iconRightOne={"heart"}
          title={GlobalValue.crtChannel?.name}
          onBackBtnPress={onBackBtnPress}
        />
        <TopImageComp IsContentBlock={false} isBlock={false} />
        <ContentDetailsComp showDesc={showDesc} setShowDesc={setShowDesc} />
        <ChannelGuideRegion />
        <FeatureShowRegion />
      </ScrollView>
    </SafeAreaView>
  );
}
//#endregion

//#region TopImageComp
const TopImageComp = (prop) => {
  return (
    <ImageBackground
      style={styleHB.container}
      source={{
        uri: "https://images.pexels.com/photos/369433/pexels-photo-369433.jpeg?auto=compress&cs=tinysrgb&w=600",
      }}
    >
      {prop.IsContentBlock ? <BlurBlockComp isBlock={prop.isBlock} /> : null}
    </ImageBackground>
  );
};
const styleHB = StyleSheet.create({
  container: {
    height: height * 0.28,
    justifyContent: "center",
    alignItems: "center",
    width: width,
    //backgroundColor: "green",
  },
});
//#endregion

//#region BlurBlockComp
const BlurBlockComp = (prop) => {
  return (
    <View style={styleB.containerBlur}>
      <Ionicons
        name={prop.isBlock ? "ban-outline" : "lock-closed"}
        size={scaleXiPhone15.fivtyH}
        color={ovnioColors.primaryRed}
      />
      <Text style={styleB.txtTitle}>
        {prop.isBlock ? "This Channel is Blocked" : "This Channel is Locked"}
      </Text>
      {!prop.isBlock ? (
        <Text style={styleB.txtWithBg}>Remove from Parental Control</Text>
      ) : null}
    </View>
  );
};
const styleB = StyleSheet.create({
  containerBlur: {
    height: "100%",
    gap: scaleXiPhone15.eightH,

    justifyContent: "center",
    alignItems: "center",

    width: width,
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.75)", // Dark semi-transparent overlay
  },
  txtTitle: {
    fontFamily: fonts.regular,
    fontSize: scaleXiPhone15.eightteenH,
    color: ovnioColors.grayDesc,
  },
  txtWithBg: {
    paddingVertical: scaleXiPhone15.fourH,
    paddingHorizontal: scaleXiPhone15.eightH,
    marginVertical: scaleXiPhone15.eightH,
    borderRadius: scaleXiPhone15.fouteenH,
    fontFamily: fonts.medium,
    fontSize: scaleXiPhone15.tenH,
    color: ovnioColors.grayDesc,
    backgroundColor: ovnioColors.primaryRed,
  },
});
//#endregion

//#region ContentDetailsComp
const ContentDetailsComp = (prop) => {
  const [isEnabled, setIsEnabled] = useState(false);
  const toggleSwitch = () => {
    setIsEnabled((previousState) => !previousState);
  };
  return (
    <View style={styleCD.container}>
      <View style={styleCD.subContainer}>
        <Text style={styleCD.txtTitle}>CH.1 NEWS</Text>
        <View style={{ flexDirection: "row", gap: scaleXiPhone15.fourW }}>
          <Text style={styleCD.txtTitle}>EASTERN STANDARD </Text>
          <Text style={[styleCD.txtTitle, { color: ovnioColors.white }]}>
            09:03:31 am
          </Text>
        </View>
      </View>
      <View style={styleCD.subContainer}>
        <Text style={styleCD.txtWithBg}>Set Pin for Parental Control</Text>
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <Text
            style={[
              styleCD.txtTitle,
              {
                color: ovnioColors.white,
                fontFamily: fonts.medium,
                paddingRight: scaleXiPhone15.eightH,
              },
            ]}
          >
            Block this Channel
          </Text>

          <Switch
            trackColor={{
              false: ovnioColors.grayIconColor,
              true: ovnioColors.primaryRed,
            }}
            thumbColor={isEnabled ? ovnioColors.white : ovnioColors.grayDesc}
            onValueChange={toggleSwitch}
            value={isEnabled}
          />
        </View>
      </View>
      <View style={styleCD.subContainer}>
        <View>
          <TouchableOpacity
            onPress={() => prop.setShowDesc(!prop.showDesc)}
            style={{
              flexDirection: "row",
              alignItems: "center",
            }}
          >
            <Text style={styleCD.txtHeading}>Game of thornes</Text>
            <Ionicons
              name={prop.showDesc ? "chevron-up-sharp" : "chevron-down-sharp"}
              size={scaleXiPhone15.sixteenH}
              color={ovnioColors.grayIconColor}
            />
          </TouchableOpacity>
          <Text style={[styleCD.txtTitle, { color: ovnioColors.yellowFood }]}>
            Sports
          </Text>
        </View>
        <View style={styleCD.containerEye}>
          <Ionicons
            name={"eye"}
            size={scaleXiPhone15.sixteenH}
            color={ovnioColors.grayIconColor}
          />
          <Text style={styleCD.txtTitle}>3.2k</Text>
        </View>
      </View>
      {prop.showDesc ? (
        <View>
          <View
            style={{
              paddingVertical: scaleXiPhone15.eightH,
              flexDirection: "row",
              alignItems: "center",
            }}
          >
            <Text
              style={[
                styleCD.txtHeading,
                {
                  fontFamily: fonts.medium,
                  paddingRight: scaleXiPhone15.twelveH,
                },
              ]}
            >
              NBC
            </Text>
            <Text style={styleCD.txtReactangleBg}>8:00pm - 8:30pm </Text>
          </View>
          <Text
            style={[
              styleCD.txtTitle,
              { fontFamily: fonts.medium, fontSize: scaleXiPhone15.tenH },
            ]}
          >
            Lorem Ipsum is simply dummy text of the printing and typesetting
            industry. Lorem Ipsum has been the industry's standard dummy text
            ever since the 1500s, when an unknown printer took a galley of type
            and scrambled it to make a type specimen book. It has survived not
            only five centuries, but also the leap into electronic typesetting,
            remaining essentially unchanged. It was popularised in the 1960s
            with the release of Letraset sheets containing Lorem Ipsum passages.
          </Text>
        </View>
      ) : null}
    </View>
  );
};
const styleCD = StyleSheet.create({
  container: {
    gap: scaleXiPhone15.eightH,
    padding: scaleXiPhone15.twelveW,
    width: width,
    backgroundColor: "#27282c",
  },
  subContainer: {
    justifyContent: "space-between",
    flexDirection: "row",
    alignItems: "center",
  },
  txtTitle: {
    fontFamily: fonts.bold,
    fontSize: scaleXiPhone15.twelveH,
    color: "#a3a4a6",
  },
  txtHeading: {
    fontFamily: fonts.bold,
    fontSize: scaleXiPhone15.sixteenH,

    color: ovnioColors.white,

    paddingRight: scaleXiPhone15.fourH,
  },
  txtWithBg: {
    paddingVertical: scaleXiPhone15.fourH,
    paddingHorizontal: scaleXiPhone15.eightH,
    marginVertical: scaleXiPhone15.eightH,
    borderRadius: scaleXiPhone15.eightH,
    fontFamily: fonts.medium,
    fontSize: scaleXiPhone15.tenH,
    color: ovnioColors.primaryRed,
    borderColor: ovnioColors.primaryRed,
    borderWidth: scaleXiPhone15.oneH,
  },
  containerEye: {
    alignItems: "center",
    gap: scaleXiPhone15.eightH,
    flexDirection: "row",
    backgroundColor: "green",
  },
  txtReactangleBg: {
    paddingVertical: scaleXiPhone15.twoH,
    paddingHorizontal: scaleXiPhone15.fourH,
    marginVertical: scaleXiPhone15.fourH,
    borderRadius: scaleXiPhone15.oneH,
    fontFamily: fonts.bold,
    fontSize: scaleXiPhone15.twelveH,
    color: ovnioColors.blackContainerBg,
    backgroundColor: ovnioColors.white,
  },
});
//#endregion

//#region ChannelGuideRegion
const ChannelGuideRegion = () => {
  return (
    <View style={styleGR.container}>
      <TVGuideHeader />
      <ChannelGuideRow />
    </View>
  );
};
const TVGuideHeader = () => {
  return (
    <View style={styleGR.containerHeader}>
      <Text
        style={[
          stylesCommon.titleWelcome,
          { textAlign: "left", fontFamily: fonts.medium },
        ]}
      >
        Channel Guide
      </Text>
      <View style={styleGR.containerIcon}>
        <Ionicons
          name={"arrow-back-circle-outline"}
          size={scaleXiPhone15.thrityTwoH}
          color={ovnioColors.grayDesc}
        />
        <Ionicons
          name={"arrow-forward-circle-outline"}
          size={scaleXiPhone15.thrityTwoH}
          color={ovnioColors.grayDesc}
        />
      </View>
    </View>
  );
};
const styleGR = StyleSheet.create({
  container: {
    paddingHorizontal: scaleXiPhone15.twelveW,
    paddingVertical: scaleXiPhone15.sixteenH,
    gap: scaleXiPhone15.eightH,
    //backgroundColor: "pink",
  },
  containerHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    //backgroundColor: "orange",
  },
  containerIcon: {
    gap: scaleXiPhone15.eightW,
    flexDirection: "row",
    justifyContent: "flex-end",
    //backgroundColor: "green",
  },
});
//#endregion

//#region FeatureShowRegion
const FeatureShowRegion = () => {
  const renderTVShowRow = () => {
    return <TVShowRowComp isShowEye={true} />;
  };
  return (
    <View style={styleFR.container}>
      <FeaturedShoweHeader />
      <FlatList
        style={styleFR.flatListTVShow}
        renderItem={renderTVShowRow}
        data={[1, 2, 3, 4, 5, 6]}
        horizontal
        showsHorizontalScrollIndicator={false}
      />
    </View>
  );
};
const FeaturedShoweHeader = () => {
  const onArrowClick = () => {};
  return (
    <View style={styleGR.containerHeader}>
      <Text
        style={[
          stylesCommon.titleWelcome,
          { textAlign: "left", fontFamily: fonts.medium },
        ]}
      >
        Featured Show
      </Text>
      <TouchableOpacity onPress={onArrowClick}>
        <Ionicons
          name={"arrow-forward"}
          size={scaleXiPhone15.twentyEightH}
          color={ovnioColors.white}
        />
      </TouchableOpacity>
    </View>
  );
};
const styleFR = StyleSheet.create({
  container: {
    paddingHorizontal: scaleXiPhone15.twelveW,
    paddingVertical: scaleXiPhone15.sixteenH,
    gap: scaleXiPhone15.eightH,
    //backgroundColor: "lightblue",
  },
  containerHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    //backgroundColor: "orange",
  },
  flatListTVShow: {
    flexGrow: 0,
    paddingVertical: scaleXiPhone15.eightH,
    //height: height * 0.22,
    // backgroundColor: "pink",
  },
});
//#endregion
